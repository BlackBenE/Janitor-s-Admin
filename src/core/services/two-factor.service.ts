/**
 * Service de gestion de l'authentification à deux facteurs (2FA/TOTP)
 * Utilise Supabase Auth avec TOTP
 */

import { supabase } from '@/core/config/supabase';
import type { AuthMFAEnrollResponse } from '@supabase/supabase-js';

export interface TwoFactorEnrollment {
  id: string;
  type: string;
  totp: {
    qr_code: string;
    secret: string;
    uri: string;
  };
}

export interface TwoFactorFactor {
  id: string;
  friendly_name?: string;
  factor_type: string;
  status: 'verified' | 'unverified';
  created_at: string;
  updated_at: string;
}

export class TwoFactorService {
  /**
   * Vérifie si l'utilisateur a activé la 2FA
   */
  static async checkTwoFactorStatus(): Promise<{
    enabled: boolean;
    factors: TwoFactorFactor[];
  }> {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error('Utilisateur non authentifié');
      }

      // Récupérer tous les facteurs MFA
      const { data, error } = await supabase.auth.mfa.listFactors();

      if (error) {
        console.error('Erreur lors de la récupération des facteurs MFA:', error);
        throw error;
      }

      const totpFactors = data?.totp || [];
      const hasVerifiedFactor = totpFactors.some((factor) => factor.status === 'verified');

      return {
        enabled: hasVerifiedFactor,
        factors: totpFactors,
      };
    } catch (error) {
      console.error('Erreur checkTwoFactorStatus:', error);
      throw error;
    }
  }

  /**
   * Démarre le processus d'inscription 2FA
   * Génère un QR code et un secret
   */
  static async enrollTwoFactor(
    friendlyName: string = 'Authenticator App'
  ): Promise<TwoFactorEnrollment> {
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName,
      });

      if (error) {
        console.error("Erreur lors de l'inscription 2FA:", error);
        throw error;
      }

      if (!data) {
        throw new Error("Aucune donnée reçue lors de l'inscription 2FA");
      }

      return {
        id: data.id,
        type: data.type,
        totp: {
          qr_code: data.totp.qr_code,
          secret: data.totp.secret,
          uri: data.totp.uri,
        },
      };
    } catch (error) {
      console.error('Erreur enrollTwoFactor:', error);
      throw error;
    }
  }

  /**
   * Vérifie le code TOTP et active la 2FA
   */
  static async verifyTwoFactorCode(factorId: string, code: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code,
      });

      if (error) {
        console.error('Erreur lors de la vérification du code:', error);
        throw error;
      }

      return data !== null;
    } catch (error) {
      console.error('Erreur verifyTwoFactorCode:', error);
      throw error;
    }
  }

  /**
   * Désactive la 2FA pour un facteur donné
   */
  static async disableTwoFactor(factorId: string): Promise<void> {
    try {
      const { error } = await supabase.auth.mfa.unenroll({
        factorId,
      });

      if (error) {
        console.error('Erreur lors de la désactivation de la 2FA:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erreur disableTwoFactor:', error);
      throw error;
    }
  }

  /**
   * Obtient le niveau d'assurance AAL (Authenticator Assurance Level)
   * Simplifié: vérifie juste si l'utilisateur a un facteur MFA vérifié
   */
  static async getAssuranceLevel(): Promise<{
    currentLevel: 'aal1' | 'aal2' | null;
    nextLevel: 'aal1' | 'aal2' | null;
  }> {
    try {
      const status = await this.checkTwoFactorStatus();
      const aal = status.enabled ? 'aal2' : 'aal1';

      return {
        currentLevel: aal,
        nextLevel: aal === 'aal1' ? 'aal2' : null,
      };
    } catch (error) {
      console.error('Erreur getAssuranceLevel:', error);
      return {
        currentLevel: null,
        nextLevel: null,
      };
    }
  }

  /**
   * Challenge MFA - pour se connecter avec 2FA après authentification
   */
  static async createChallenge(factorId: string): Promise<string> {
    try {
      const { data, error } = await supabase.auth.mfa.challenge({
        factorId,
      });

      if (error) {
        console.error('Erreur lors de la création du challenge:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Aucun challenge créé');
      }

      return data.id;
    } catch (error) {
      console.error('Erreur createChallenge:', error);
      throw error;
    }
  }

  /**
   * Vérifie un challenge avec le code TOTP
   * Note: Cette méthode est utilisée lors de la connexion avec 2FA,
   * pas lors de l'activation initiale
   */
  static async verifyChallenge(
    factorId: string,
    challengeId: string,
    code: string
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code,
      });

      if (error) {
        console.error('Erreur lors de la vérification du challenge:', error);
        throw error;
      }

      return data !== null;
    } catch (error) {
      console.error('Erreur verifyChallenge:', error);
      throw error;
    }
  }
}
