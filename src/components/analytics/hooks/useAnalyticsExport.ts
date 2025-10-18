import { useCallback } from "react";
import {
  ExportFormat,
  AnalyticsData,
  DateRange,
} from "../../../types/analytics";
import { useUINotifications } from "../../../hooks/shared";
import {
  generateCSVContent,
  generateHTMLContent,
  generateTextContent,
} from "./exportContentGenerators";

/**
 * Hook pour gérer les exports des données analytics
 */
export const useAnalyticsExport = () => {
  const { showNotification } = useUINotifications();

  // Export des données
  const exportData = useCallback(
    async (format: ExportFormat, data: AnalyticsData, dateRange: DateRange) => {
      try {
        // Préparer les données pour l'export
        const exportableData = {
          userMetrics: data.userMetrics,
          revenueMetrics: data.revenueMetrics,
          activityMetrics: data.activityMetrics,
          userGrowthData: data.userGrowthData,
          bookingTrends: data.bookingTrends,
          topServices: data.topServices,
          bookingsByStatus: data.usersByStatus,
          dateRange: dateRange,
          exportDate: new Date().toISOString(),
        };

        switch (format) {
          case "csv":
            await exportToCSV(exportableData);
            break;
          case "excel":
            await exportToExcel(exportableData);
            break;
          case "pdf":
            await exportToPDF(exportableData);
            break;
          default:
            throw new Error(`Format d'export non supporté: ${format}`);
        }

        showNotification(
          `Données exportées en ${format.toUpperCase()} avec succès`,
          "success"
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur lors de l'export";
        showNotification(errorMessage, "error");
        throw err;
      }
    },
    [showNotification]
  );

  // Fonctions utilitaires d'export
  const exportToCSV = useCallback(async (exportData: any) => {
    const csvContent = generateCSVContent(exportData);
    downloadFile(csvContent, `analytics-${Date.now()}.csv`, "text/csv");
  }, []);

  const exportToExcel = useCallback(async (exportData: any) => {
    // Export Excel au format CSV compatible
    const csvContent = generateCSVContent(exportData);
    downloadFile(
      csvContent,
      `analytics-${Date.now()}.xlsx`,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
  }, []);

  const exportToPDF = useCallback(async (exportData: any) => {
    try {
      // Générer le contenu HTML stylé pour le PDF
      const htmlContent = generateHTMLContent(exportData);

      // Créer une nouvelle fenêtre pour l'impression
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        throw new Error("Impossible d'ouvrir la fenêtre d'impression");
      }

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Attendre que le contenu soit chargé puis imprimer
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      };
    } catch (error) {
      console.error("Erreur PDF:", error);
      // Fallback: télécharger en tant que fichier texte
      const textContent = generateTextContent(exportData);
      downloadFile(textContent, `analytics-${Date.now()}.txt`, "text/plain");
    }
  }, []);

  const downloadFile = useCallback(
    (content: string, filename: string, mimeType: string) => {
      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    []
  );

  return {
    exportData,
  };
};
