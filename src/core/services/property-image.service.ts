import { supabase } from '@/core/config/supabase';

export class PropertyImageService {
  private static readonly BUCKET_NAME = 'image-bucket';
  private static readonly PROPERTIES_FOLDER = 'properties';
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB pour les images de propriété
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
        error: 'Le fichier est trop volumineux. Taille maximale : 10MB.',
      };
    }

    return { isValid: true };
  }

  /**
   * Upload une image pour une propriété
   */
  static async uploadPropertyImage(
    propertyId: string,
    file: File
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // Validation du fichier
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      // Nom unique pour le fichier dans le dossier properties
      const fileExt = file.name.split('.').pop();
      const fileName = `${propertyId}-${Date.now()}.${fileExt}`;
      const filePath = `${this.PROPERTIES_FOLDER}/${fileName}`;

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
      console.error('Property image upload error:', error);
      return { success: false, error: "Une erreur inattendue s'est produite." };
    }
  }

  /**
   * Supprime une image de propriété
   */
  static async deletePropertyImage(imageUrl: string): Promise<boolean> {
    try {
      // Extraire le chemin du fichier depuis l'URL
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const filePath = `${this.PROPERTIES_FOLDER}/${fileName}`;

      const { error } = await supabase.storage.from(this.BUCKET_NAME).remove([filePath]);

      return !error;
    } catch (error) {
      console.error('Delete property image error:', error);
      return false;
    }
  }

  /**
   * Upload multiple images pour une propriété
   */
  static async uploadMultipleImages(
    propertyId: string,
    files: File[]
  ): Promise<{ success: boolean; urls: string[]; errors: string[] }> {
    const urls: string[] = [];
    const errors: string[] = [];

    for (const file of files) {
      const result = await this.uploadPropertyImage(propertyId, file);
      
      if (result.success && result.url) {
        urls.push(result.url);
      } else {
        errors.push(result.error || 'Erreur inconnue');
      }
    }

    return {
      success: errors.length === 0,
      urls,
      errors,
    };
  }

  /**
   * Met à jour les images d'une propriété dans la base de données
   */
  static async updatePropertyImages(
    propertyId: string,
    imageUrls: string[]
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          images: imageUrls,
          updated_at: new Date().toISOString(),
        })
        .eq('id', propertyId);

      if (error) {
        console.error('Property images update error:', error);
        return {
          success: false,
          error: 'Erreur lors de la mise à jour des images.',
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Update property images error:', error);
      return { success: false, error: "Une erreur inattendue s'est produite." };
    }
  }
}
