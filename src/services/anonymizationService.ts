import { supabase } from "../lib/supabaseClient";
import {
  AnonymizationLevel,
  AnonymizationResult,
  AnonymizationStrategy,
  DEFAULT_ANONYMIZATION_STRATEGY,
  DeletionReason,
} from "../types/dataRetention";

/**
 * Service d'anonymisation des données utilisateur
 * Implémente la stratégie RGPD d'anonymisation graduée
 */
export class AnonymizationService {
  private strategy: AnonymizationStrategy;

  constructor(customStrategy?: Partial<AnonymizationStrategy>) {
    this.strategy = {
      ...DEFAULT_ANONYMIZATION_STRATEGY,
      ...customStrategy,
    };
  }

  /**
   * Anonymise un utilisateur selon la stratégie définie
   */
  async anonymizeUser(
    userId: string,
    reason: DeletionReason,
    level: AnonymizationLevel = AnonymizationLevel.PARTIAL
  ): Promise<AnonymizationResult> {
    try {
      const result: AnonymizationResult = {
        user_id: userId,
        anonymization_level: level,
        anonymized_fields: [],
        success: false,
      };

      // Étape 1 : Anonymisation des données personnelles (immédiate)
      if (this.strategy.personal_data.immediate) {
        await this.anonymizePersonalData(userId);
        result.anonymized_fields.push(...this.strategy.personal_data.fields);
      }

      // Étape 2 : Traitement des données métier selon le niveau
      if (level === AnonymizationLevel.PARTIAL) {
        // Conserver les données métier anonymisées
        await this.anonymizeBusinessDataReferences(userId);
        result.preserved_data_until = this.calculatePreservationDate(
          this.strategy.business_data.preserve_period_days
        );
      } else if (level === AnonymizationLevel.FULL) {
        // Anonymisation complète
        await this.anonymizeAllBusinessData(userId);
      }

      // Étape 3 : Programmation de la purge finale
      if (level !== AnonymizationLevel.PURGED) {
        result.scheduled_purge_at = this.calculatePurgeDate(userId, reason);
        await this.schedulePurge(userId, result.scheduled_purge_at);
      }

      // Étape 4 : Mise à jour du statut d'anonymisation
      await this.updateAnonymizationStatus(userId, level);

      result.success = true;
      return result;
    } catch (error) {
      console.error("Erreur lors de l'anonymisation:", error);
      return {
        user_id: userId,
        anonymization_level: level,
        anonymized_fields: [],
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  /**
   * Anonymise les données personnelles immédiatement
   */
  private async anonymizePersonalData(userId: string): Promise<void> {
    const anonymizedData: Record<string, any> = {};

    // Génération d'un ID anonyme permanent pour traçabilité
    const anonymousId = `anon_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Anonymisation des champs personnels
    this.strategy.personal_data.fields.forEach((field) => {
      switch (field) {
        case "email":
          anonymizedData[field] = `${anonymousId}@anonymized.local`;
          break;
        case "first_name":
          anonymizedData[field] = `Utilisateur`;
          break;
        case "last_name":
          anonymizedData[field] = `Anonymisé ${anonymousId.slice(-6)}`;
          break;
        case "full_name":
          anonymizedData[field] = `Utilisateur Anonymisé ${anonymousId.slice(
            -6
          )}`;
          break;
        case "phone":
          anonymizedData[field] = null;
          break;
        case "avatar_url":
          anonymizedData[field] = null;
          break;
        default:
          anonymizedData[field] = this.strategy.personal_data.replacement;
      }
    });

    // Ajout de l'ID anonyme pour traçabilité
    anonymizedData.anonymous_id = anonymousId;
    anonymizedData.anonymized_at = new Date().toISOString();

    // Mise à jour en base
    const { error } = await supabase
      .from("profiles")
      .update(anonymizedData)
      .eq("id", userId);

    if (error) {
      throw new Error(
        `Erreur lors de l'anonymisation des données personnelles: ${error.message}`
      );
    }
  }

  /**
   * Anonymise les références utilisateur dans les données métier
   */
  private async anonymizeBusinessDataReferences(userId: string): Promise<void> {
    // Récupération de l'ID anonyme
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("anonymous_id")
      .eq("id", userId)
      .single();

    if (profileError || !profile?.anonymous_id) {
      throw new Error("ID anonyme non trouvé");
    }

    const anonymousId = profile.anonymous_id;

    // Anonymisation dans les différentes tables
    const tablesToAnonymize = [
      "bookings",
      "service_requests",
      "reviews",
      "payments",
      "subscriptions",
      "properties",
      "notifications",
    ];

    for (const table of tablesToAnonymize) {
      try {
        // Remplacer user_id par anonymous_id dans une nouvelle colonne
        await supabase
          .from(table)
          .update({
            anonymous_user_id: anonymousId,
            user_anonymized_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
      } catch (error) {
        console.warn(`Impossible d'anonymiser la table ${table}:`, error);
        // Continue avec les autres tables
      }
    }
  }

  /**
   * Anonymisation complète de toutes les données métier
   */
  private async anonymizeAllBusinessData(userId: string): Promise<void> {
    // Suppression ou anonymisation complète des données métier
    const tablesToPurge = [
      "bookings",
      "service_requests",
      "reviews",
      "properties",
      "notifications",
    ];

    for (const table of tablesToPurge) {
      try {
        await supabase.from(table).delete().eq("user_id", userId);
      } catch (error) {
        console.warn(`Impossible de purger la table ${table}:`, error);
      }
    }

    // Conservation des données financières (obligation légale)
    await this.anonymizeBusinessDataReferences(userId);
  }

  /**
   * Calcule la date de conservation des données
   */
  private calculatePreservationDate(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }

  /**
   * Calcule la date de purge finale selon la raison
   */
  private calculatePurgeDate(userId: string, reason: DeletionReason): string {
    let retentionDays = this.strategy.business_data.preserve_period_days;

    // Ajustement selon la raison de suppression
    switch (reason) {
      case DeletionReason.GDPR_COMPLIANCE:
        retentionDays = 0; // Purge immédiate après anonymisation
        break;
      case DeletionReason.USER_REQUEST:
        retentionDays = 30; // Délai de rétractation
        break;
      case DeletionReason.POLICY_VIOLATION:
        retentionDays = this.strategy.audit_data.retention_days; // Conservation pour audit
        break;
    }

    return this.calculatePreservationDate(retentionDays);
  }

  /**
   * Programme une tâche de purge finale
   */
  private async schedulePurge(
    userId: string,
    purgeDate: string
  ): Promise<void> {
    const { error } = await supabase.from("scheduled_purges").insert({
      user_id: userId,
      table_name: "all",
      scheduled_for: purgeDate,
      policy_applied: "GDPR_ANONYMIZATION",
      status: "pending",
    });

    if (error) {
      console.warn("Impossible de programmer la purge:", error);
    }
  }

  /**
   * Restaure un utilisateur en nettoyant tous les champs d'anonymisation
   */
  async restoreUser(
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Nettoyer tous les champs d'anonymisation et de suppression
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          deleted_at: null,
          deletion_reason: null,
          anonymization_level: null,
          anonymized_at: null,
          preserved_data_until: null,
          scheduled_purge_at: null,
          anonymous_id: null,
        })
        .eq("id", userId);

      if (updateError) {
        return {
          success: false,
          error: `Erreur lors de la restauration: ${updateError.message}`,
        };
      }

      // Annuler les tâches de purge programmées
      const { error: cancelError } = await supabase
        .from("data_purge_tasks")
        .update({ status: "cancelled" })
        .eq("user_id", userId)
        .eq("status", "pending");

      if (cancelError) {
        console.warn("Impossible d'annuler les tâches de purge:", cancelError);
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  /**
   * Met à jour le statut d'anonymisation de l'utilisateur
   */
  private async updateAnonymizationStatus(
    userId: string,
    level: AnonymizationLevel
  ): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .update({
        anonymization_level: level,
        last_anonymized_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      throw new Error(
        `Erreur lors de la mise à jour du statut: ${error.message}`
      );
    }
  }
}

// Instance par défaut
export const anonymizationService = new AnonymizationService();
