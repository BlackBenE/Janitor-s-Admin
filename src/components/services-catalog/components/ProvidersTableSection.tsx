import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Chip,
  Avatar,
  Tooltip,
  Alert,
  CircularProgress,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Visibility as ViewIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  AttachMoney as MoneyIcon,
} from "@mui/icons-material";
import { useProviders, ProviderWithMetrics, ProvidersFilters } from "../hooks/useProviders";

interface ProvidersTableSectionProps {
  onProviderSelect?: (provider: ProviderWithMetrics) => void;
}

export const ProvidersTableSection: React.FC<ProvidersTableSectionProps> = ({
  onProviderSelect,
}) => {
  // État local pour les filtres
  const [filters, setFilters] = useState<ProvidersFilters>({});
  const [searchText, setSearchText] = useState("");
  const [orderBy, setOrderBy] = useState<"name" | "servicesCount" | "totalRequests" | "averageRating" | "totalRevenue">("name");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  
  // États pour les modals
  const [selectedProvider, setSelectedProvider] = useState<ProviderWithMetrics | null>(null);
  const [showProviderDetails, setShowProviderDetails] = useState(false);

  // Query pour récupérer les providers
  const {
    data: providers = [],
    isLoading,
    error,
    refetch,
  } = useProviders({
    filters: {
      ...filters,
      search: searchText.trim() || undefined,
    },
    orderBy,
    orderDirection,
  });

  // Gestionnaires d'événements
  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      search: searchText.trim() || undefined,
    }));
  };

  const handleClearSearch = () => {
    setSearchText("");
    setFilters(prev => ({
      ...prev,
      search: undefined,
    }));
  };

  const handleViewProvider = (provider: ProviderWithMetrics) => {
    setSelectedProvider(provider);
    setShowProviderDetails(true);
  };

  const handleProviderClick = (provider: ProviderWithMetrics) => {
    if (onProviderSelect) {
      onProviderSelect(provider);
    }
  };

  // Configuration des colonnes du DataGrid
  const columns: GridColDef[] = useMemo(() => [
    {
      field: "provider",
      headerName: "Prestataire",
      flex: 2,
      minWidth: 250,
      renderCell: (params: GridRenderCellParams<ProviderWithMetrics>) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 1 }}>
          <Avatar 
            src={params.row.avatar_url || undefined}
            sx={{ width: 40, height: 40 }}
          >
            {(params.row.full_name || params.row.email)?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {params.row.full_name || `${params.row.first_name || ""} ${params.row.last_name || ""}`.trim() || "Sans nom"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.email}
            </Typography>
            {params.row.phone && (
              <Typography variant="caption" color="text.secondary" display="block">
                {params.row.phone}
              </Typography>
            )}
          </Box>
        </Box>
      ),
    },
    {
      field: "servicesCount",
      headerName: "Services",
      width: 120,
      renderCell: (params: GridRenderCellParams<ProviderWithMetrics>) => (
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" fontWeight="medium">
            {params.row.servicesCount}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.activeServicesCount} actifs
          </Typography>
        </Box>
      ),
    },
    {
      field: "totalRequests",
      headerName: "Demandes",
      width: 120,
      renderCell: (params: GridRenderCellParams<ProviderWithMetrics>) => (
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" fontWeight="medium">
            {params.row.totalRequests}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.pendingRequests} en cours
          </Typography>
        </Box>
      ),
    },
    {
      field: "averageRating",
      headerName: "Note",
      width: 130,
      renderCell: (params: GridRenderCellParams<ProviderWithMetrics>) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Rating
            value={params.row.averageRating}
            readOnly
            precision={0.1}
            size="small"
          />
          <Typography variant="caption" color="text.secondary">
            {params.row.averageRating > 0 ? params.row.averageRating.toFixed(1) : "N/A"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "totalRevenue",
      headerName: "CA Total",
      width: 120,
      renderCell: (params: GridRenderCellParams<ProviderWithMetrics>) => (
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="body2" fontWeight="medium">
            {params.row.totalRevenue.toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
            })}
          </Typography>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams<ProviderWithMetrics>) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="Voir détails">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleViewProvider(params.row);
              }}
            >
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ], []);

  // Calcul des statistiques globales
  const totalProviders = providers.length;
  const totalServices = providers.reduce((sum, p) => sum + p.servicesCount, 0);
  const totalRequests = providers.reduce((sum, p) => sum + p.totalRequests, 0);
  const totalRevenue = providers.reduce((sum, p) => sum + p.totalRevenue, 0);

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Erreur lors du chargement des prestataires: {error.message}
        <Button onClick={() => refetch()} sx={{ ml: 1 }}>
          Réessayer
        </Button>
      </Alert>
    );
  }

  return (
    <Box>
      {/* Statistiques globales */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="primary">
                {totalProviders}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Prestataires
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="info.main">
                {totalServices}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Services totaux
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="warning.main">
                {totalRequests}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Demandes totales
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="success.main">
                {totalRevenue.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                CA Total
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Barre de recherche et filtres */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end", flexWrap: "wrap" }}>
          <TextField
            label="Rechercher un prestataire"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            InputProps={{
              endAdornment: searchText && (
                <IconButton onClick={handleClearSearch} size="small">
                  <ClearIcon />
                </IconButton>
              ),
            }}
            sx={{ minWidth: 300 }}
          />
          
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            disabled={isLoading}
          >
            Rechercher
          </Button>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Trier par</InputLabel>
            <Select
              value={orderBy}
              label="Trier par"
              onChange={(e) => setOrderBy(e.target.value as any)}
            >
              <MenuItem value="name">Nom</MenuItem>
              <MenuItem value="servicesCount">Nb Services</MenuItem>
              <MenuItem value="totalRequests">Nb Demandes</MenuItem>
              <MenuItem value="averageRating">Note moyenne</MenuItem>
              <MenuItem value="totalRevenue">CA Total</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Direction</InputLabel>
            <Select
              value={orderDirection}
              label="Direction"
              onChange={(e) => setOrderDirection(e.target.value as any)}
            >
              <MenuItem value="asc">Croissant</MenuItem>
              <MenuItem value="desc">Décroissant</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Tableau des prestataires */}
      <Paper sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={providers}
          columns={columns}
          loading={isLoading}
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          onRowClick={(params) => handleProviderClick(params.row)}
          sx={{
            "& .MuiDataGrid-row": {
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            },
          }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 25,
              },
            },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
        />
      </Paper>

      {/* Modal détails prestataire */}
      <Dialog
        open={showProviderDetails}
        onClose={() => setShowProviderDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar src={selectedProvider?.avatar_url || undefined}>
              {selectedProvider?.full_name?.[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {selectedProvider?.full_name || "Prestataire"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedProvider?.email}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedProvider && (
            <Box sx={{ mt: 2 }}>
              {/* Métriques */}
              <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                <Box sx={{ flex: 1, minWidth: 120 }}>
                  <Box sx={{ textAlign: "center", p: 1, bgcolor: "primary.light", borderRadius: 1 }}>
                    <Typography variant="h4">{selectedProvider.servicesCount}</Typography>
                    <Typography variant="caption">Services</Typography>
                  </Box>
                </Box>
                <Box sx={{ flex: 1, minWidth: 120 }}>
                  <Box sx={{ textAlign: "center", p: 1, bgcolor: "info.light", borderRadius: 1 }}>
                    <Typography variant="h4">{selectedProvider.totalRequests}</Typography>
                    <Typography variant="caption">Demandes</Typography>
                  </Box>
                </Box>
                <Box sx={{ flex: 1, minWidth: 120 }}>
                  <Box sx={{ textAlign: "center", p: 1, bgcolor: "warning.light", borderRadius: 1 }}>
                    <Typography variant="h4">{selectedProvider.averageRating.toFixed(1)}</Typography>
                    <Typography variant="caption">Note</Typography>
                  </Box>
                </Box>
                <Box sx={{ flex: 1, minWidth: 120 }}>
                  <Box sx={{ textAlign: "center", p: 1, bgcolor: "success.light", borderRadius: 1 }}>
                    <Typography variant="h4">
                      {selectedProvider.totalRevenue.toLocaleString("fr-FR", { 
                        style: "currency", 
                        currency: "EUR",
                        minimumFractionDigits: 0,
                      })}
                    </Typography>
                    <Typography variant="caption">CA Total</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Services du prestataire */}
              <Typography variant="h6" gutterBottom>
                Services ({selectedProvider.servicesCount})
              </Typography>
              <List sx={{ maxHeight: 300, overflow: "auto" }}>
                {selectedProvider.services?.map((service, index) => (
                  <React.Fragment key={service.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="body1">{service.name}</Typography>
                            <Chip
                              label={service.is_active ? "Actif" : "Inactif"}
                              color={service.is_active ? "success" : "default"}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {service.category}
                            </Typography>
                            <Typography variant="body2" color="primary">
                              {service.base_price.toLocaleString("fr-FR", {
                                style: "currency",
                                currency: "EUR",
                              })}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < (selectedProvider.services?.length || 0) - 1 && <Divider />}
                  </React.Fragment>
                ))}
                {!selectedProvider.services?.length && (
                  <ListItem>
                    <ListItemText
                      primary="Aucun service"
                      secondary="Ce prestataire n'a pas encore créé de services"
                    />
                  </ListItem>
                )}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowProviderDetails(false)}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};