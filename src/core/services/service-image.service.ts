import { supabase } from '@/core/config/supabase';

export class ServiceImageService {
  private static readonly BUCKET_NAME = 'image-bucket';
  private static readonly SERVICES_FOLDER = 'services';
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB pour les images de service
  private static readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  /**
   * Valide le fichier d'image
   */
  static validateFile(file: File): { isValid: boolean; error?: string } {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: 'Format de fichier non supporté. Utilisez JPG, PNG ou WebP.',
      };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: 'Le fichier est trop volumineux. Taille maximale : 5MB.',
      };
    }

    return { isValid: true };
  }

  /**
   * Upload une image pour un service
   */
  static async uploadServiceImage(
    file: File,
    serviceId?: string
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // Validation du fichier
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      // Nom unique pour le fichier dans le dossier services
      const fileExt = file.name.split('.').pop();
      const uniqueId = serviceId || `temp-${Date.now()}`;
      const fileName = `${uniqueId}-${Date.now()}.${fileExt}`;
      const filePath = `${this.SERVICES_FOLDER}/${fileName}`;

      // Upload vers Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false, // Ne pas remplacer, créer nouveau
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return { success: false, error: "Erreur lors de l'upload du fichier." };
      }

      // Obtenir l'URL publique
      const { data: urlData } = supabase.storage.from(this.BUCKET_NAME).getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        return {
          success: false,
          error: "Impossible d'obtenir l'URL du fichier.",
        };
      }

      return { success: true, url: urlData.publicUrl };
    } catch (error) {
      console.error('Service image upload error:', error);
      return { success: false, error: "Une erreur inattendue s'est produite." };
    }
  }

  /**
   * Supprime une image de service
   */
  static async deleteServiceImage(imageUrl: string): Promise<boolean> {
    try {
      // Extraire le chemin du fichier depuis l'URL
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const filePath = `${this.SERVICES_FOLDER}/${fileName}`;

      const { error } = await supabase.storage.from(this.BUCKET_NAME).remove([filePath]);

      return !error;
    } catch (error) {
      console.error('Delete service image error:', error);
      return false;
    }
  }

  /**
   * Met à jour l'image d'un service dans la base de données
   */
  static async updateServiceImage(
    serviceId: string,
    imageUrl: string | null
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('services')
        .update({
          image_url: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', serviceId);

      if (error) {
        console.error('Service image update error:', error);
        return {
          success: false,
          error: "Erreur lors de la mise à jour de l'image.",
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Update service image error:', error);
      return { success: false, error: "Une erreur inattendue s'est produite." };
    }
  }
}
