import { supabase } from '@/core/config/supabase';

/**
 * Service utilitaire pour tester et visualiser le système GDPR
 */
export class GDPRTestService {
  /**
   * Affiche un aperçu des purges à venir
   */
  static async previewPendingPurges() {
    try {
      const { data, error } = await supabase.rpc('preview_pending_purges');

      if (error) {
        console.error("Erreur lors de l'aperçu des purges:", error);
        return null;
      }

      console.table(data);

      return data;
    } catch (error) {
      console.error("Erreur lors de l'aperçu:", error);
      return null;
    }
  }

  /**
   * Affiche les statistiques GDPR actuelles
   */
  static async getGDPRStatistics() {
    try {
      const { data, error } = await supabase.from('gdpr_statistics_simple').select('*').single();

      if (error) {
        console.error('Erreur lors de la récupération des stats:', error);
        return null;
      }

      console.table(data);

      return data;
    } catch (error) {
      console.error('Erreur lors des statistiques:', error);
      return null;
    }
  }

  /**
   * Test manuel de la fonction de purge
   */
  static async testPurgeFunction() {
    try {
      const { data, error } = await supabase.rpc('execute_gdpr_purges');

      if (error) {
        console.error('❌ Erreur lors du test de purge:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Erreur lors du test:', error);
      return false;
    }
  }

  /**
   * Simule une suppression avec anonymisation pour test
   */
  static async simulateUserDeletion(userId: string) {
    try {
      // 1. Soft delete
      const { error: deleteError } = await supabase
        .from('profiles')
        .update({
          deleted_at: new Date().toISOString(),
          deletion_reason: 'test_simulation',
          anonymization_level: 'partial',
          anonymized_at: new Date().toISOString(),
          // Programmer la purge dans 30 jours pour test
          scheduled_purge_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('id', userId);

      if (deleteError) {
        console.error('❌ Erreur lors de la simulation:', deleteError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la simulation:', error);
      return false;
    }
  }
}

// Fonctions utilitaires pour la console du navigateur
(window as any).gdprTest = {
  preview: GDPRTestService.previewPendingPurges,
  stats: GDPRTestService.getGDPRStatistics,
  testPurge: GDPRTestService.testPurgeFunction,
  simulate: GDPRTestService.simulateUserDeletion,

  // Helper pour voir les commandes disponibles
  help: () => {
    console.log(`
🧪 Commandes de test GDPR disponibles:

gdprTest.preview()     - Voir les purges à venir
gdprTest.stats()       - Statistiques GDPR actuelles  
gdprTest.testPurge()   - Tester la fonction de purge
gdprTest.simulate(id)  - Simuler suppression d'un utilisateur

Exemple:
gdprTest.stats()
gdprTest.preview()
`);
  },
};

export default GDPRTestService;
