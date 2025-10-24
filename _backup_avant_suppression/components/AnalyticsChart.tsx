import React from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartProps {
  title: string;
  subtitle?: string;
  data: Array<Record<string, unknown>>;
  type: "line" | "area" | "bar" | "pie";
  height?: number;
  loading?: boolean;
  dataKey?: string;
  xAxisKey?: string;
  colors?: string[];
}

const AnalyticsChart: React.FC<ChartProps> = ({
  title,
  subtitle,
  data,
  type,
  height = 300,
  loading = false,
  dataKey = "value",
  xAxisKey = "name",
  colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088fe"],
}) => {
  const theme = useTheme();

  const defaultColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
  ];

  const chartColors = colors.length > 0 ? colors : defaultColors;

  const renderChart = () => {
    if (loading) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={height}
        >
          <CircularProgress />
        </Box>
      );
    }

    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (type) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={xAxisKey}
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: theme.palette.text.secondary }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: theme.palette.text.secondary }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 4,
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={chartColors[0]}
                strokeWidth={2}
                dot={{ fill: chartColors[0], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: chartColors[0], strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart {...commonProps}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={chartColors[0]}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartColors[0]}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={xAxisKey}
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: theme.palette.text.secondary }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: theme.palette.text.secondary }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 4,
                }}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={chartColors[0]}
                fillOpacity={1}
                fill="url(#colorGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              {...commonProps}
              margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={xAxisKey}
                tick={{ fontSize: 11 }}
                tickLine={{ stroke: theme.palette.text.secondary }}
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
                tickFormatter={(value: string) => {
                  // Raccourcir les noms longs sur l'axe X
                  if (value && value.length > 15) {
                    return value.substring(0, 15) + "...";
                  }
                  return value;
                }}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={{ stroke: theme.palette.text.secondary }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 4,
                }}
                formatter={(value: any, name: string) => [
                  `${value}`,
                  name === dataKey ? "Valeur" : name,
                ]}
              />
              <Bar
                dataKey={dataKey}
                fill={chartColors[0]}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case "pie":
        const renderCustomLabel = (entry: any) => {
          const percent = (entry.percent * 100).toFixed(0);
          // N'afficher le label que si le pourcentage est >= 5% pour éviter le chevauchement
          if (entry.percent < 0.05) return "";

          // Raccourcir les noms longs
          let name = entry[xAxisKey] || "Unknown";
          if (name.length > 12) {
            name = name.substring(0, 12) + "...";
          }

          return `${percent}%`;
        };

        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={Math.min(height * 0.25, 100)}
                innerRadius={0}
                fill="#8884d8"
                dataKey={dataKey}
                fontSize={11}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={chartColors[index % chartColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 4,
                }}
                formatter={(value: any, name: string) => [
                  `${value}`,
                  name === dataKey ? "Valeur" : name,
                ]}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                formatter={(value: string) => {
                  // Raccourcir les noms dans la légende aussi
                  if (value.length > 15) {
                    return value.substring(0, 15) + "...";
                  }
                  return value;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return <div>Type de graphique non supporté</div>;
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
      <Box mb={2}>
        <Typography variant="h6" component="h3" gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {renderChart()}
    </Paper>
  );
};

export default AnalyticsChart;
