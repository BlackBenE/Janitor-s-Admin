/**
 * Hook pour gérer la vérification 2FA lors de la connexion
 */

import { useState } from 'react';
import { supabase } from '@/core/config/supabase';

interface UseTwoFactorLoginReturn {
  // État
  showModal: boolean;
  isVerifying: boolean;
  error: string | null;
  factorId: string | null;

  // Actions
  checkAndPromptMFA: (email: string, password: string) => Promise<boolean>;
  verifyCode: (code: string) => Promise<boolean>;
  cancelVerification: () => void;
}

export const useTwoFactorLogin = (): UseTwoFactorLoginReturn => {
  const [showModal, setShowModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);

  /**
   * Vérifie si l'utilisateur a la 2FA activée et demande le code si nécessaire
   * Retourne true si l'utilisateur est connecté (avec ou sans 2FA)
   * Retourne false si 2FA requise et modal affichée
   */
  const checkAndPromptMFA = async (email: string, password: string): Promise<boolean> => {
    try {
      // 1. Se connecter avec email/password
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      // 2. Vérifier si l'utilisateur a des facteurs MFA
      const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();

      if (factorsError) {
        console.error('Erreur lors de la vérification MFA:', factorsError);
        // Continuer sans MFA si erreur
        return true;
      }

      const verifiedFactors = factorsData?.totp?.filter((f) => f.status === 'verified');

      // 3. Si pas de 2FA activée, connexion réussie
      if (!verifiedFactors || verifiedFactors.length === 0) {
        console.log('✅ Pas de 2FA activée, connexion directe');
        return true;
      }

      console.log('🔐 2FA activée, création du challenge...');

      // 4. Si 2FA activée, créer un challenge
      const factor = verifiedFactors[0];
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: factor.id,
      });

      if (challengeError || !challengeData) {
        console.error('Erreur lors de la création du challenge:', challengeError);
        // Continuer sans MFA si erreur
        return true;
      }

      // 5. Afficher la modal de vérification
      // On garde la session AAL1 active - ne pas déconnecter!
      setFactorId(factor.id);
      setChallengeId(challengeData.id);
      setShowModal(true);
      setError(null);

      console.log('🔐 Modal 2FA affichée, en attente du code...');

      // Retourner false pour indiquer qu'on attend la vérification 2FA
      return false;
    } catch (err) {
      console.error('Erreur checkAndPromptMFA:', err);
      throw err;
    }
  };

  /**
   * Vérifie le code TOTP entré par l'utilisateur
   */
  const verifyCode = async (code: string): Promise<boolean> => {
    if (!factorId || !challengeId) {
      setError('Erreur de configuration MFA');
      return false;
    }

    try {
      setIsVerifying(true);
      setError(null);

      // Vérifier le code TOTP avec la session AAL1 existante
      const { data, error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code,
      });

      if (error) {
        setError('Code invalide ou expiré');
        return false;
      }

      if (!data) {
        setError('Erreur lors de la vérification');
        return false;
      }

      // Vérification réussie! La session est maintenant AAL2
      console.log('✅ 2FA vérifiée, session AAL2 créée');

      setShowModal(false);
      setFactorId(null);
      setChallengeId(null);
      return true;
    } catch (err) {
      console.error('Erreur verifyCode:', err);
      setError('Erreur lors de la vérification');
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * Annule la vérification 2FA et déconnecte l'utilisateur
   */
  const cancelVerification = async () => {
    setShowModal(false);
    setFactorId(null);
    setChallengeId(null);
    setError(null);

    // Déconnecter l'utilisateur
    await supabase.auth.signOut();
  };

  return {
    showModal,
    isVerifying,
    error,
    factorId,
    checkAndPromptMFA,
    verifyCode,
    cancelVerification,
  };
};
