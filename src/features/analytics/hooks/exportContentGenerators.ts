/**
 * Générateurs de contenu pour les exports analytics
 */
export const generateCSVContent = (exportData: any): string => {
  let csvContent = "Type,Métrique,Valeur\n";

  // Métriques utilisateurs
  csvContent += `Utilisateurs,Total,${exportData.userMetrics.totalUsers}\n`;
  csvContent += `Utilisateurs,Actifs,${exportData.userMetrics.activeUsers}\n`;
  csvContent += `Utilisateurs,Nouveaux,${exportData.userMetrics.newUsers}\n`;
  csvContent += `Utilisateurs,Croissance,${exportData.userMetrics.userGrowthRate}%\n`;

  // Métriques revenus
  csvContent += `Revenus,Total,€${exportData.revenueMetrics.totalRevenue}\n`;
  csvContent += `Revenus,Mensuel,€${exportData.revenueMetrics.monthlyRevenue}\n`;
  csvContent += `Revenus,Panier moyen,€${exportData.revenueMetrics.averageOrderValue}\n`;
  csvContent += `Revenus,Croissance,${exportData.revenueMetrics.revenueGrowthRate}%\n`;

  // Métriques activité
  csvContent += `Activité,Réservations totales,${exportData.activityMetrics.totalBookings}\n`;
  csvContent += `Activité,Réservations terminées,${exportData.activityMetrics.completedBookings}\n`;
  csvContent += `Activité,Réservations annulées,${exportData.activityMetrics.cancelledBookings}\n`;
  csvContent += `Activité,Services actifs,${exportData.activityMetrics.activeServices}\n`;

  return csvContent;
};

export const generateHTMLContent = (exportData: any): string => {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport Analytics</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 40px;
            color: #333;
            line-height: 1.6;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #1976d2;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #1976d2;
            margin: 0;
            font-size: 2.5em;
        }
        .header .period {
            color: #666;
            font-size: 1.1em;
            margin-top: 10px;
        }
        .metrics-section {
            margin-bottom: 30px;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 5px solid #1976d2;
        }
        .metrics-section h2 {
            color: #1976d2;
            margin-top: 0;
            font-size: 1.5em;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
        }
        .metric-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .metric-item:last-child {
            border-bottom: none;
        }
        .metric-label {
            font-weight: 500;
        }
        .metric-value {
            font-weight: bold;
            color: #2e7d32;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 0.9em;
            border-top: 1px solid #ddd;
            padding-top: 20px;
        }
        @media print {
            body { margin: 20px; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Rapport Analytics</h1>
        <div class="period">
            Période: ${new Date(exportData.dateRange.from).toLocaleDateString(
              "fr-FR"
            )} - ${new Date(exportData.dateRange.to).toLocaleDateString(
    "fr-FR"
  )}
        </div>
    </div>

    <div class="metrics-section">
        <h2>📊 Métriques Utilisateurs</h2>
        <div class="metric-item">
            <span class="metric-label">Total Utilisateurs</span>
            <span class="metric-value">${exportData.userMetrics.totalUsers.toLocaleString(
              "fr-FR"
            )}</span>
        </div>
        <div class="metric-item">
            <span class="metric-label">Utilisateurs Actifs</span>
            <span class="metric-value">${exportData.userMetrics.activeUsers.toLocaleString(
              "fr-FR"
            )}</span>
        </div>
        <div class="metric-item">
            <span class="metric-label">Nouveaux Utilisateurs</span>
            <span class="metric-value">${exportData.userMetrics.newUsers.toLocaleString(
              "fr-FR"
            )}</span>
        </div>
        <div class="metric-item">
            <span class="metric-label">Taux de Croissance</span>
            <span class="metric-value">${
              exportData.userMetrics.userGrowthRate
            }%</span>
        </div>
    </div>

    <div class="metrics-section">
        <h2>💰 Métriques Revenus</h2>
        <div class="metric-item">
            <span class="metric-label">Revenus Total</span>
            <span class="metric-value">${exportData.revenueMetrics.totalRevenue.toLocaleString(
              "fr-FR"
            )} €</span>
        </div>
        <div class="metric-item">
            <span class="metric-label">Revenus Mensuels</span>
            <span class="metric-value">${exportData.revenueMetrics.monthlyRevenue.toLocaleString(
              "fr-FR"
            )} €</span>
        </div>
        <div class="metric-item">
            <span class="metric-label">Panier Moyen</span>
            <span class="metric-value">${exportData.revenueMetrics.averageOrderValue.toLocaleString(
              "fr-FR"
            )} €</span>
        </div>
        <div class="metric-item">
            <span class="metric-label">Taux de Croissance</span>
            <span class="metric-value">${
              exportData.revenueMetrics.revenueGrowthRate
            }%</span>
        </div>
    </div>

    <div class="metrics-section">
        <h2>📈 Métriques Activité</h2>
        <div class="metric-item">
            <span class="metric-label">Réservations Totales</span>
            <span class="metric-value">${exportData.activityMetrics.totalBookings.toLocaleString(
              "fr-FR"
            )}</span>
        </div>
        <div class="metric-item">
            <span class="metric-label">Réservations Terminées</span>
            <span class="metric-value">${exportData.activityMetrics.completedBookings.toLocaleString(
              "fr-FR"
            )}</span>
        </div>
        <div class="metric-item">
            <span class="metric-label">Réservations Annulées</span>
            <span class="metric-value">${exportData.activityMetrics.cancelledBookings.toLocaleString(
              "fr-FR"
            )}</span>
        </div>
        <div class="metric-item">
            <span class="metric-label">Services Actifs</span>
            <span class="metric-value">${exportData.activityMetrics.activeServices.toLocaleString(
              "fr-FR"
            )}</span>
        </div>
    </div>

    <div class="footer">
        <p>Rapport généré le ${new Date(
          exportData.exportDate
        ).toLocaleDateString("fr-FR")} à ${new Date(
    exportData.exportDate
  ).toLocaleTimeString("fr-FR")}</p>
    </div>
</body>
</html>`;
};

export const generateTextContent = (exportData: any): string => {
  return `
Analytics Report - ${new Date(exportData.exportDate).toLocaleDateString()}
Période: ${new Date(
    exportData.dateRange.from
  ).toLocaleDateString()} - ${new Date(
    exportData.dateRange.to
  ).toLocaleDateString()}

MÉTRIQUES UTILISATEURS
Total: ${exportData.userMetrics.totalUsers}
Actifs: ${exportData.userMetrics.activeUsers}
Nouveaux: ${exportData.userMetrics.newUsers}
Croissance: ${exportData.userMetrics.userGrowthRate}%

MÉTRIQUES REVENUS
Total: €${exportData.revenueMetrics.totalRevenue}
Mensuel: €${exportData.revenueMetrics.monthlyRevenue}
Panier moyen: €${exportData.revenueMetrics.averageOrderValue}
Croissance: ${exportData.revenueMetrics.revenueGrowthRate}%

MÉTRIQUES ACTIVITÉ
Réservations totales: ${exportData.activityMetrics.totalBookings}
Réservations terminées: ${exportData.activityMetrics.completedBookings}
Réservations annulées: ${exportData.activityMetrics.cancelledBookings}
Services actifs: ${exportData.activityMetrics.activeServices}
    `;
};
