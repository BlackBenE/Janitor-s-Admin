/**
 * Utilitaires pour la gestion des images Supabase
 * Fonctions helper pour les tokens et URL d'images
 */

import { supabase } from "../../../lib/supabaseClient";

// Constants
export const TOKEN_EXPIRY_HOURS = 3600; // 1 hour in seconds
export const SUPABASE_STORAGE_PATH_REGEX =
  /\/storage\/v1\/object\/sign\/image-bucket\/(.+?)\?/;

/**
 * Vérifie si des tokens d'images ont expiré
 */
export const hasExpiredTokens = (imageUrls: string[]): boolean => {
  return imageUrls.some((url: string) => {
    try {
      const tokenMatch = url.match(/token=([^&]+)/);
      if (!tokenMatch) return false;

      const payload = JSON.parse(atob(tokenMatch[1].split(".")[1]));
      const exp = new Date(payload.exp * 1000);
      return exp < new Date();
    } catch {
      return false;
    }
  });
};

/**
 * Rafraîchit les URLs d'images avec de nouveaux tokens
 */
export const refreshImageUrls = async (
  imageUrls: string[]
): Promise<string[]> => {
  try {
    const newUrls: string[] = [];

    for (const imageUrl of imageUrls) {
      try {
        const pathMatch = imageUrl.match(SUPABASE_STORAGE_PATH_REGEX);
        if (!pathMatch) {
          newUrls.push(imageUrl);
          continue;
        }

        const filePath = pathMatch[1];
        const { data, error } = await supabase.storage
          .from("image-bucket")
          .createSignedUrl(filePath, TOKEN_EXPIRY_HOURS);

        if (error || !data) {
          console.error("Erreur lors du rafraîchissement de l'image:", error);
          newUrls.push(imageUrl);
          continue;
        }

        newUrls.push(data.signedUrl);
      } catch (err) {
        console.error("Erreur lors du traitement de l'image:", err);
        newUrls.push(imageUrl);
      }
    }

    return newUrls;
  } catch (error) {
    console.error("Erreur lors du rafraîchissement des images:", error);
    return imageUrls; // Return original URLs as fallback
  }
};

/**
 * Génère un URL signé pour une image spécifique
 */
export const createSignedImageUrl = async (
  filePath: string
): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from("image-bucket")
      .createSignedUrl(filePath, TOKEN_EXPIRY_HOURS);

    if (error || !data) {
      console.error("Erreur lors de la création de l'URL signée:", error);
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    console.error("Erreur lors de la création de l'URL signée:", error);
    return null;
  }
};
