import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider,
  Badge,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Fab,
  Tooltip,
  Alert,
  CircularProgress,
  Button,
  Stack,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  NotificationsActive,
  MarkEmailRead,
  Delete,
  Search,
  Refresh,
  CheckCircle,
  Warning,
  Error,
  Info,
  Settings,
  Clear,
  SelectAll,
  Close,
  Launch,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useNotifications } from "../hooks/useNotifications";
import { useNavigate } from "react-router-dom";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`notification-tabpanel-${index}`}
      aria-labelledby={`notification-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const NotificationCenter: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    []
  );

  const {
    useNotificationsList,
    useUnreadNotifications,
    useNotificationStats,
    useMarkAsRead,
    useMarkAsUnread,
    useDeleteNotification,
    useBulkNotificationActions,
    useMarkAllAsRead,
    refreshNotifications,
  } = useNotifications();

  const {
    data: allNotifications = [],
    isLoading: loadingAll,
    refetch: refetchAll,
  } = useNotificationsList();
  const { data: unreadNotifications = [], isLoading: loadingUnread } =
    useUnreadNotifications();
  const { data: stats } = useNotificationStats();

  const markAsReadMutation = useMarkAsRead();
  const markAsUnreadMutation = useMarkAsUnread();
  const deleteNotificationMutation = useDeleteNotification();
  const bulkActionsMutation = useBulkNotificationActions();
  const markAllAsReadMutation = useMarkAllAsRead();

  // Filtrer les notifications selon l'onglet actuel
  const getFilteredNotifications = () => {
    let notifications = tabValue === 0 ? allNotifications : unreadNotifications;

    // Filtre par terme de recherche
    if (searchTerm) {
      notifications = notifications.filter(
        (notif) =>
          notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notif.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par type
    if (typeFilter !== "all") {
      notifications = notifications.filter(
        (notif) => notif.type === typeFilter
      );
    }

    // Filtre par statut
    if (statusFilter === "read") {
      notifications = notifications.filter((notif) => notif.read);
    } else if (statusFilter === "unread") {
      notifications = notifications.filter((notif) => !notif.read);
    }

    return notifications;
  };

  const filteredNotifications = getFilteredNotifications();

  // Gérer la sélection des notifications
  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(notificationId)
        ? prev.filter((id) => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id));
    }
  };

  // Actions sur les notifications
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsReadMutation.mutateAsync(notificationId);
      await refetchAll();
    } catch (error) {
      console.error("Erreur lors du marquage comme lu:", error);
    }
  };

  const handleMarkAsUnread = async (notificationId: string) => {
    try {
      await markAsUnreadMutation.mutateAsync(notificationId);
      await refetchAll();
    } catch (error) {
      console.error("Erreur lors du marquage comme non lu:", error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await deleteNotificationMutation.mutateAsync(notificationId);
      setSelectedNotifications((prev) =>
        prev.filter((id) => id !== notificationId)
      );
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleBulkAction = async (
    action: "mark_read" | "mark_unread" | "delete"
  ) => {
    if (selectedNotifications.length === 0) return;

    try {
      await bulkActionsMutation.mutateAsync({
        notificationIds: selectedNotifications,
        action,
      });
      setSelectedNotifications([]);
    } catch (error) {
      console.error("Erreur lors de l'action en masse:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync(undefined);
    } catch (error) {
      console.error("Erreur lors du marquage global:", error);
    }
  };

  const handleNotificationClick = (notification: {
    id: string;
    read: boolean | null;
    related_id?: string | null;
    type: string;
  }) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }

    // Pour l'instant, on navigue vers une page générique
    // Plus tard on pourra utiliser related_id pour naviguer vers la bonne page
    if (notification.related_id) {
      // Logique de navigation basée sur le type et related_id
      switch (notification.type) {
        case "booking":
          navigate("/reservations");
          break;
        case "payment":
          navigate("/financial-overview");
          break;
        case "provider":
          navigate("/providers-moderation");
          break;
        case "user":
          navigate("/user-management");
          break;
        default:
          navigate("/dashboard");
      }
    }
  };

  // Icônes selon le type de notification
  const getNotificationIcon = (type: string, read: boolean | null) => {
    const isRead = read === true;
    const iconProps = {
      fontSize: "small" as const,
      sx: { opacity: isRead ? 0.6 : 1 },
    };

    switch (type) {
      case "success":
        return <CheckCircle color="success" {...iconProps} />;
      case "warning":
        return <Warning color="warning" {...iconProps} />;
      case "error":
        return <Error color="error" {...iconProps} />;
      case "info":
      default:
        return <Info color="info" {...iconProps} />;
    }
  };

  // Couleur du chip selon le type
  const getTypeChipColor = (
    type: string
  ):
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning" => {
    switch (type) {
      case "success":
        return "success";
      case "warning":
        return "warning";
      case "error":
        return "error";
      case "info":
        return "info";
      default:
        return "default";
    }
  };

  const isLoading = loadingAll || loadingUnread;
  const hasSelectedNotifications = selectedNotifications.length > 0;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      {/* En-tête */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Badge badgeContent={stats?.unread || 0} color="primary">
            <NotificationsIcon fontSize="large" />
          </Badge>
          <Box>
            <Typography variant="h4" component="h1">
              Centre de notifications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {stats?.total || 0} notifications au total • {stats?.unread || 0}{" "}
              non lues
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={1}>
          <Tooltip title="Actualiser">
            <IconButton
              onClick={() => refreshNotifications()}
              disabled={isLoading}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Marquer toutes comme lues">
            <IconButton
              onClick={handleMarkAllAsRead}
              disabled={isLoading || (stats?.unread || 0) === 0}
            >
              <MarkEmailRead />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Filtres et recherche */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="center"
          >
            <TextField
              placeholder="Rechercher des notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{ flexGrow: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm("")}>
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={typeFilter}
                label="Type"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="all">Tous</MenuItem>
                <MenuItem value="info">Info</MenuItem>
                <MenuItem value="success">Succès</MenuItem>
                <MenuItem value="warning">Attention</MenuItem>
                <MenuItem value="error">Erreur</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Statut</InputLabel>
              <Select
                value={statusFilter}
                label="Statut"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Tous</MenuItem>
                <MenuItem value="unread">Non lues</MenuItem>
                <MenuItem value="read">Lues</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </CardContent>
      </Card>

      {/* Actions en masse */}
      {hasSelectedNotifications && (
        <Alert
          severity="info"
          sx={{ mb: 2 }}
          action={
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                onClick={() => handleBulkAction("mark_read")}
              >
                Marquer comme lues
              </Button>
              <Button
                size="small"
                onClick={() => handleBulkAction("mark_unread")}
              >
                Marquer comme non lues
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => handleBulkAction("delete")}
              >
                Supprimer
              </Button>
              <IconButton
                size="small"
                onClick={() => setSelectedNotifications([])}
              >
                <Close />
              </IconButton>
            </Stack>
          }
        >
          {selectedNotifications.length} notification(s) sélectionnée(s)
        </Alert>
      )}

      {/* Onglets */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
          >
            <Tab
              label={
                <Badge
                  badgeContent={stats?.total || 0}
                  color="default"
                  max={999}
                >
                  Toutes
                </Badge>
              }
            />
            <Tab
              label={
                <Badge
                  badgeContent={stats?.unread || 0}
                  color="primary"
                  max={999}
                >
                  Non lues
                </Badge>
              }
            />
          </Tabs>

          {/* Sélection globale */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton
                size="small"
                onClick={handleSelectAll}
                disabled={filteredNotifications.length === 0}
              >
                <SelectAll />
              </IconButton>
              <Typography variant="body2">
                {selectedNotifications.length ===
                  filteredNotifications.length &&
                filteredNotifications.length > 0
                  ? "Tout désélectionner"
                  : "Tout sélectionner"}{" "}
                ({filteredNotifications.length})
              </Typography>
            </Stack>
          </Box>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredNotifications.length === 0 ? (
            <Box sx={{ textAlign: "center", p: 4 }}>
              <NotificationsIcon
                sx={{ fontSize: 48, color: "text.disabled", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Aucune notification trouvée
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                  ? "Essayez de modifier vos filtres de recherche"
                  : "Vous n'avez pas encore de notifications"}
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredNotifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    sx={{
                      bgcolor: notification.read
                        ? "transparent"
                        : "action.hover",
                      cursor: "pointer",
                      "&:hover": { bgcolor: "action.selected" },
                    }}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <ListItemIcon>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectNotification(notification.id);
                        }}
                        sx={{ mr: 1 }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(
                            notification.id
                          )}
                          readOnly
                          style={{ margin: 0 }}
                        />
                      </IconButton>
                      {getNotificationIcon(
                        notification.type,
                        notification.read
                      )}
                    </ListItemIcon>

                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: notification.read ? "normal" : "bold",
                              flexGrow: 1,
                            }}
                          >
                            {notification.title}
                          </Typography>
                          <Chip
                            label={notification.type}
                            size="small"
                            color={getTypeChipColor(notification.type)}
                            variant={notification.read ? "outlined" : "filled"}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.disabled">
                            {notification.created_at &&
                              formatDistanceToNow(
                                new Date(notification.created_at),
                                { addSuffix: true, locale: fr }
                              )}
                          </Typography>
                        </Box>
                      }
                    />

                    <ListItemSecondaryAction>
                      <Stack direction="row" spacing={0.5}>
                        {notification.related_id && (
                          <Tooltip title="Ouvrir">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Navigation basée sur le type et related_id
                                switch (notification.type) {
                                  case "booking":
                                    navigate("/reservations");
                                    break;
                                  case "payment":
                                    navigate("/financial-overview");
                                    break;
                                  case "provider":
                                    navigate("/providers-moderation");
                                    break;
                                  case "user":
                                    navigate("/user-management");
                                    break;
                                  default:
                                    navigate("/dashboard");
                                }
                              }}
                            >
                              <Launch />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip
                          title={
                            notification.read
                              ? "Marquer comme non lu"
                              : "Marquer comme lu"
                          }
                        >
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (notification.read) {
                                handleMarkAsUnread(notification.id);
                              } else {
                                handleMarkAsRead(notification.id);
                              }
                            }}
                          >
                            {notification.read ? (
                              <NotificationsActive />
                            ) : (
                              <MarkEmailRead />
                            )}
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Supprimer">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotification(notification.id);
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </ListItemSecondaryAction>
                  </ListItem>

                  {index < filteredNotifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Même contenu mais filtré pour les non lues */}
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredNotifications.length === 0 ? (
            <Box sx={{ textAlign: "center", p: 4 }}>
              <CheckCircle
                sx={{ fontSize: 48, color: "success.main", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Toutes les notifications sont lues !
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aucune notification non lue ne correspond à vos critères
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredNotifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    sx={{
                      bgcolor: "action.hover",
                      cursor: "pointer",
                      "&:hover": { bgcolor: "action.selected" },
                    }}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <ListItemIcon>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectNotification(notification.id);
                        }}
                        sx={{ mr: 1 }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(
                            notification.id
                          )}
                          readOnly
                          style={{ margin: 0 }}
                        />
                      </IconButton>
                      {getNotificationIcon(notification.type, false)}
                    </ListItemIcon>

                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: "bold", flexGrow: 1 }}
                          >
                            {notification.title}
                          </Typography>
                          <Chip
                            label={notification.type}
                            size="small"
                            color={getTypeChipColor(notification.type)}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.disabled">
                            {notification.created_at &&
                              formatDistanceToNow(
                                new Date(notification.created_at),
                                { addSuffix: true, locale: fr }
                              )}
                          </Typography>
                        </Box>
                      }
                    />

                    <ListItemSecondaryAction>
                      <Stack direction="row" spacing={0.5}>
                        {notification.related_id && (
                          <Tooltip title="Ouvrir">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Navigation basée sur le type et related_id
                                switch (notification.type) {
                                  case "booking":
                                    navigate("/reservations");
                                    break;
                                  case "payment":
                                    navigate("/financial-overview");
                                    break;
                                  case "provider":
                                    navigate("/providers-moderation");
                                    break;
                                  case "user":
                                    navigate("/user-management");
                                    break;
                                  default:
                                    navigate("/dashboard");
                                }
                              }}
                            >
                              <Launch />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="Marquer comme lu">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                          >
                            <MarkEmailRead />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Supprimer">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotification(notification.id);
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </ListItemSecondaryAction>
                  </ListItem>

                  {index < filteredNotifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </TabPanel>
      </Card>

      {/* FAB pour les paramètres */}
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => navigate("/settings")}
      >
        <Settings />
      </Fab>
    </Box>
  );
};

export default NotificationCenter;
