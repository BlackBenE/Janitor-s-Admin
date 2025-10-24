import { supabase } from "@/core/config/supabase";

export class AvatarService {
  private static readonly BUCKET_NAME = "image-bucket";
  private static readonly AVATAR_FOLDER = "avatars";
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private static readonly ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  /**
   * Valide le fichier d'avatar
   */
  static validateFile(file: File): { isValid: boolean; error?: string } {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: "Format de fichier non supporté. Utilisez JPG, PNG ou WebP.",
      };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: "Le fichier est trop volumineux. Taille maximale : 5MB.",
      };
    }

    return { isValid: true };
  }

  /**
   * Upload un avatar pour un utilisateur
   */
  static async uploadAvatar(
    userId: string,
    file: File
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // Validation du fichier
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      // Nom unique pour le fichier dans le dossier avatars
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${this.AVATAR_FOLDER}/${fileName}`;

      // Upload vers Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true, // Remplace le fichier s'il existe
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return { success: false, error: "Erreur lors de l'upload du fichier." };
      }

      // Obtenir l'URL publique
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        return {
          success: false,
          error: "Impossible d'obtenir l'URL du fichier.",
        };
      }

      // Mettre à jour le profil avec la nouvelle URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: urlData.publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) {
        console.error("Profile update error:", updateError);
        // Nettoyer le fichier uploadé en cas d'erreur
        await this.deleteAvatar(filePath);
        return {
          success: false,
          error: "Erreur lors de la mise à jour du profil.",
        };
      }

      return { success: true, url: urlData.publicUrl };
    } catch (error) {
      console.error("Avatar upload error:", error);
      return { success: false, error: "Une erreur inattendue s'est produite." };
    }
  }

  /**
   * Supprime un avatar
   */
  static async deleteAvatar(filePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      return !error;
    } catch (error) {
      console.error("Delete avatar error:", error);
      return false;
    }
  }

  /**
   * Supprime l'ancien avatar d'un utilisateur et met à jour le profil
   */
  static async removeUserAvatar(userId: string): Promise<boolean> {
    try {
      // Récupérer l'URL actuelle de l'avatar
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", userId)
        .single();

      if (fetchError || !profile?.avatar_url) {
        return true; // Pas d'avatar à supprimer
      }

      // Extraire le chemin du fichier depuis l'URL
      const url = new URL(profile.avatar_url);
      const pathParts = url.pathname.split("/");
      const fileName = pathParts[pathParts.length - 1];
      const filePath = `${this.AVATAR_FOLDER}/${fileName}`;

      // Supprimer le fichier
      await this.deleteAvatar(filePath);

      // Mettre à jour le profil
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      return !updateError;
    } catch (error) {
      console.error("Remove user avatar error:", error);
      return false;
    }
  }

  /**
   * Obtient l'URL de l'avatar d'un utilisateur
   */
  static async getUserAvatarUrl(userId: string): Promise<string | null> {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", userId)
        .single();

      if (error || !profile?.avatar_url) {
        return null;
      }

      return profile.avatar_url;
    } catch (error) {
      console.error("Get user avatar URL error:", error);
      return null;
    }
  }
}
