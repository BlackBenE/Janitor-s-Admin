import { useState } from "react";

export interface ExportOptions {
  format?: "csv" | "excel";
  filename?: string;
  includeHeaders?: boolean;
}

export interface ExportColumn {
  key: string;
  label: string;
  formatter?: (value: any) => string;
}

/**
 * Hook universel pour l'export de données
 * Supporte CSV et Excel avec configuration flexible
 */
export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number, currency = "EUR"): string => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
    }).format(amount);
  };

  const formatBoolean = (value: boolean): string => {
    return value ? "Oui" : "Non";
  };

  const exportToCSV = <T extends Record<string, any>>(
    data: T[],
    columns: ExportColumn[],
    options: ExportOptions = { format: "csv" }
  ): void => {
    try {
      setIsExporting(true);

      const headers = columns.map((col) => col.label);
      const rows = data.map((item) =>
        columns.map((col) => {
          const value = item[col.key];
          return col.formatter ? col.formatter(value) : value?.toString() || "";
        })
      );

      const csvContent = [
        ...(options.includeHeaders !== false ? [headers] : []),
        ...rows,
      ]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          options.filename ||
            `export_${new Date().toISOString().split("T")[0]}.csv`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Export failed:", error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  // Colonnes prédéfinies courantes
  const commonColumns = {
    date: (key: string, label = "Date"): ExportColumn => ({
      key,
      label,
      formatter: formatDate,
    }),
    currency: (
      key: string,
      label = "Amount",
      currency = "EUR"
    ): ExportColumn => ({
      key,
      label,
      formatter: (value) => formatCurrency(value, currency),
    }),
    boolean: (key: string, label: string): ExportColumn => ({
      key,
      label,
      formatter: formatBoolean,
    }),
    text: (key: string, label: string): ExportColumn => ({
      key,
      label,
    }),
  };

  // Template d'export pour les utilisateurs
  const exportUsers = <T extends Record<string, any>>(data: T[]) => {
    const columns: ExportColumn[] = [
      commonColumns.text("full_name", "Nom"),
      commonColumns.text("email", "Email"),
      commonColumns.text("phone", "Téléphone"),
      commonColumns.text("role", "Rôle"),
      commonColumns.boolean("profile_validated", "Validé"),
      commonColumns.boolean("vip_subscription", "VIP"),
      commonColumns.date("created_at", "Date d'inscription"),
    ];

    exportToCSV(data, columns, { filename: "users_export.csv" });
  };

  return {
    isExporting,
    exportToCSV,
    commonColumns,
    exportUsers,
    formatters: {
      date: formatDate,
      currency: formatCurrency,
      boolean: formatBoolean,
    },
  };
};

export default useExport;
