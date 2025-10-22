import html2pdf from "html2pdf.js";
import { PaymentWithDetails } from "../../../types/payments";

export interface PdfGenerationOptions {
  filename?: string;
  scale?: number;
  format?: "a4" | "letter";
  orientation?: "portrait" | "landscape";
}

/**
 * Service pour la génération de PDFs de factures/devis de paiement
 * Utilise html2pdf.js pour convertir un élément HTML en PDF
 */
export class PaymentPdfService {
  /**
   * Génère un PDF à partir d'un élément HTML
   */
  static async generatePdfFromElement(
    element: HTMLElement,
    payment: PaymentWithDetails,
    options: PdfGenerationOptions = {}
  ): Promise<void> {
    try {
      const filename =
        options.filename ||
        `facture-${
          payment.stripe_payment_intent_id || payment.id
        }-${Date.now()}.pdf`;

      console.log("🔍 Génération PDF:", {
        filename,
        elementId: element.id,
        elementSize: {
          width: element.scrollWidth,
          height: element.scrollHeight,
          offsetWidth: element.offsetWidth,
          offsetHeight: element.offsetHeight,
        },
        hasContent: element.innerHTML.length > 0,
      });

      const opt = {
        filename,
        image: {
          type: "jpeg" as const,
          quality: 1,
        },
        html2canvas: {
          scale: options.scale || 2,
          useCORS: true,
          letterRendering: true,
          backgroundColor: "#ffffff",
          height: element.scrollHeight || element.offsetHeight,
          width: element.scrollWidth || element.offsetWidth,
          logging: true, // Activer les logs html2canvas
        },
        jsPDF: {
          unit: "mm",
          format: options.format || "a4",
          orientation: options.orientation || ("portrait" as const),
          compress: true,
        },
        pagebreak: {
          mode: ["avoid-all", "css", "legacy"],
          before: ".page-break-before",
          after: ".page-break-after",
          avoid: ".page-break-avoid",
        },
      };

      console.log("📋 Options PDF:", opt);
      await html2pdf().set(opt).from(element).save();
      console.log("✅ PDF généré avec succès");
      return Promise.resolve();
    } catch (error) {
      console.error("❌ Error generating PDF:", error);
      throw new Error("Échec de la génération du PDF. Veuillez réessayer.");
    }
  }

  /**
   * Génère le nom de fichier pour la facture
   */
  static generateFilename(payment: PaymentWithDetails): string {
    const payerName = payment.payer
      ? `${payment.payer.first_name}-${payment.payer.last_name}`
          .toLowerCase()
          .replace(/\s+/g, "-")
      : "client";

    const invoiceId =
      payment.stripe_payment_intent_id || `inv-${payment.id.slice(-8)}`;
    const date = new Date().toISOString().split("T")[0];

    return `facture-${payerName}-${invoiceId}-${date}.pdf`;
  }

  /**
   * Formate une date pour l'affichage dans le PDF
   */
  static formatDateForPdf(dateString: string): string {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  /**
   * Formate un montant pour l'affichage dans le PDF
   */
  static formatAmountForPdf(amount: number): string {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  }

  /**
   * Calcule la TVA (20% par défaut)
   */
  static calculateTax(
    amount: number,
    taxRate: number = 0.2
  ): {
    taxAmount: number;
    totalWithTax: number;
    amountExclTax: number;
  } {
    const amountExclTax = amount / (1 + taxRate);
    const taxAmount = amount - amountExclTax;
    const totalWithTax = amount;

    return {
      taxAmount,
      totalWithTax,
      amountExclTax,
    };
  }
}
