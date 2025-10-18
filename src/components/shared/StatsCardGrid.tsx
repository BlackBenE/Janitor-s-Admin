import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

export interface StatCard {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
    period?: string;
  };
  icon?: React.ReactNode;
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  tooltip?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface StatsCardGridProps {
  cards: StatCard[];
  loading?: boolean;
}

export const StatsCardGrid: React.FC<StatsCardGridProps> = ({
  cards,
  loading = false,
}) => {
  const formatValue = (value: string | number): string => {
    if (typeof value === "number") {
      // Format des grands nombres
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      }
      if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
      return value.toLocaleString();
    }
    return value;
  };

  const getTrendColor = (direction: "up" | "down" | "neutral") => {
    switch (direction) {
      case "up":
        return "success.main";
      case "down":
        return "error.main";
      default:
        return "text.secondary";
    }
  };

  const getTrendIcon = (direction: "up" | "down" | "neutral") => {
    switch (direction) {
      case "up":
        return <TrendingUpIcon fontSize="small" />;
      case "down":
        return <TrendingDownIcon fontSize="small" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
          mb: 3,
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ width: "70%" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      bgcolor: "grey.200",
                      borderRadius: 1,
                      height: 16,
                      mb: 1,
                    }}
                  />
                  <Typography
                    variant="h4"
                    sx={{
                      bgcolor: "grey.200",
                      borderRadius: 1,
                      height: 32,
                      mb: 1,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ bgcolor: "grey.200", borderRadius: 1, height: 16 }}
                  />
                </Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: "grey.200",
                    borderRadius: 1,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(4, 1fr)",
        },
        gap: 3,
        mb: 3,
      }}
    >
      {cards.map((card) => (
        <Card
          key={card.id}
          sx={{
            height: "100%",
            position: "relative",
            "&:hover": {
              boxShadow: 2,
              transform: "translateY(-1px)",
              transition: "all 0.2s ease-in-out",
            },
          }}
        >
          <CardContent>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: "medium" }}
                  >
                    {card.title}
                  </Typography>
                  {card.tooltip && (
                    <Tooltip title={card.tooltip}>
                      <InfoIcon fontSize="small" color="action" />
                    </Tooltip>
                  )}
                </Box>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    color: card.color ? `${card.color}.main` : "text.primary",
                    my: 1,
                  }}
                >
                  {formatValue(card.value)}
                </Typography>

                {card.subtitle && (
                  <Typography variant="body2" color="text.secondary">
                    {card.subtitle}
                  </Typography>
                )}

                {card.trend && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: getTrendColor(card.trend.direction),
                      }}
                    >
                      {getTrendIcon(card.trend.direction)}
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "medium", ml: 0.5 }}
                      >
                        {card.trend.value}
                      </Typography>
                    </Box>
                    {card.trend.period && (
                      <Typography variant="body2" color="text.secondary">
                        {card.trend.period}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>

              {card.icon && (
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 1,
                    bgcolor: card.color ? `${card.color}.light` : "grey.100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: card.color ? `${card.color}.main` : "text.secondary",
                  }}
                >
                  {card.icon}
                </Box>
              )}
            </Box>

            {card.action && (
              <Box sx={{ mt: 2 }}>
                <Chip
                  label={card.action.label}
                  size="small"
                  onClick={card.action.onClick}
                  clickable
                  color={card.color || "primary"}
                  variant="outlined"
                />
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default StatsCardGrid;
