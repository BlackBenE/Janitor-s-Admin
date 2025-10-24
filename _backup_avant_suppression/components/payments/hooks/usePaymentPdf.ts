import { useState } from "react";
import { PaymentWithDetails } from "../../../types/payments";
import { PaymentPdfService } from "../services/pdfService";

/**
 * Hook pour la génération de PDFs de paiements
 */
export const usePaymentPdf = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Génère et télécharge le PDF d'une facture de paiement
   */
  const generatePaymentPdf = async (
    payment: PaymentWithDetails
  ): Promise<void> => {
    try {
      setIsGenerating(true);

      // Cherche l'élément PDF dans le DOM
      let pdfElement = document.getElementById(`invoice-${payment.id}`);

      if (!pdfElement) {
        throw new Error(
          "Élément PDF non trouvé. Assurez-vous que le composant PaymentInvoicePdf est rendu."
        );
      }

      // Rendre l'élément temporairement visible pour la génération
      const originalStyles = {
        position: pdfElement.style.position,
        top: pdfElement.style.top,
        left: pdfElement.style.left,
        visibility: pdfElement.style.visibility,
        zIndex: pdfElement.style.zIndex,
      };

      // Mettre l'élément visible temporairement
      pdfElement.style.position = "absolute";
      pdfElement.style.top = "0";
      pdfElement.style.left = "0";
      pdfElement.style.visibility = "visible";
      pdfElement.style.zIndex = "9999";

      // Attendre que le rendu soit terminé
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Génère le PDF
      await PaymentPdfService.generatePdfFromElement(
        pdfElement as HTMLElement,
        payment,
        {
          filename: PaymentPdfService.generateFilename(payment),
          scale: 2,
          format: "a4",
          orientation: "portrait",
        }
      );

      // Restaurer les styles originaux
      pdfElement.style.position = originalStyles.position;
      pdfElement.style.top = originalStyles.top;
      pdfElement.style.left = originalStyles.left;
      pdfElement.style.visibility = originalStyles.visibility;
      pdfElement.style.zIndex = originalStyles.zIndex;
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Génère un PDF en préparant temporairement l'élément
   */
  const generatePaymentPdfWithRender = async (
    payment: PaymentWithDetails,
    renderPdfComponent: (payment: PaymentWithDetails) => void,
    cleanup: () => void
  ): Promise<void> => {
    try {
      setIsGenerating(true);

      // Rendre le composant PDF temporairement
      renderPdfComponent(payment);

      // Attendre que le DOM soit mis à jour
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Générer le PDF
      await generatePaymentPdf(payment);
    } finally {
      // Nettoyer le composant temporaire
      cleanup();
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generatePaymentPdf,
    generatePaymentPdfWithRender,
  };
};
