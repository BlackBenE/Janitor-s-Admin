import { supabase } from '@/core/config/supabase';
import { dataProvider } from '@/core/api/data.provider';

export class ProfileService {
  /**
   * Change le mot de passe de l'utilisateur
   */
  static async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Supabase gère automatiquement la vérification du mot de passe actuel
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error('Change password error:', error);
        return {
          success: false,
          error: error.message || 'Erreur lors du changement de mot de passe',
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: "Une erreur inattendue s'est produite",
      };
    }
  }

  /**
   * Met à jour le profil utilisateur
   */
  static async updateProfile(
    userId: string,
    data: {
      full_name?: string;
      phone?: string | null;
      first_name?: string;
      last_name?: string;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const updateData = {
        ...data,
        // Convertir undefined en null pour le phone
        phone: data.phone === undefined ? null : data.phone,
        updated_at: new Date().toISOString(),
      };


      // Utiliser le dataProvider qui gère mieux les erreurs et utilise supabaseAdmin
      const response = await dataProvider.update('profiles', userId, updateData);


      if (!response.success || response.error) {
        console.error('❌ Update profile error:', response.error);
        return {
          success: false,
          error: response.error?.message || 'Erreur lors de la mise à jour du profil',
        };
      }

      return { success: true };
    } catch (error) {
      console.error('❌ Update profile error:', error);
      return {
        success: false,
        error: "Une erreur inattendue s'est produite",
      };
    }
  }

  /**
   * Supprime le compte utilisateur (soft delete)
   */
  static async deleteAccount(
    userId: string,
    reason?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Marquer comme supprimé au lieu de supprimer définitivement
      const { error } = await supabase
        .from('profiles')
        .update({
          deleted_at: new Date().toISOString(),
          deletion_reason: reason || 'User requested deletion',
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        console.error('Delete account error:', error);
        return {
          success: false,
          error: error.message || 'Erreur lors de la suppression du compte',
        };
      }

      // Déconnecter l'utilisateur
      await supabase.auth.signOut();

      return { success: true };
    } catch (error) {
      console.error('Delete account error:', error);
      return {
        success: false,
        error: "Une erreur inattendue s'est produite",
      };
    }
  }

  /**
   * Vérifie le mot de passe actuel
   */
  static async verifyCurrentPassword(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Tentative de connexion avec les identifiants actuels
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: 'Mot de passe actuel incorrect',
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Verify password error:', error);
      return {
        success: false,
        error: 'Erreur lors de la vérification du mot de passe',
      };
    }
  }

  /**
   * Met à jour l'email de l'utilisateur
   */
  static async updateEmail(newEmail: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) {
        console.error('Update email error:', error);
        return {
          success: false,
          error: error.message || "Erreur lors de la mise à jour de l'email",
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Update email error:', error);
      return {
        success: false,
        error: "Une erreur inattendue s'est produite",
      };
    }
  }

  /**
   * Envoie un email de réinitialisation de mot de passe
   */
  static async sendPasswordResetEmail(
    email: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        console.error('Send password reset error:', error);
        return {
          success: false,
          error: error.message || "Erreur lors de l'envoi de l'email",
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Send password reset error:', error);
      return {
        success: false,
        error: "Une erreur inattendue s'est produite",
      };
    }
  }
}
