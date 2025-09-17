import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Badge,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  CircularProgress,
  Button,
  Stack,
  Tooltip,
  Alert,
} from "@mui/material";
import {
  Close,
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
  Clear,
  SelectAll,
  Launch,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useNotifications } from "../hooks/useNotifications";
import { useNavigate } from "react-router-dom";

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
}

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

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  open,
  onClose,
}) => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
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

    // Fermer le drawer et naviguer
    onClose();

    // Navigation basée sur le type et related_id
    if (notification.related_id) {
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
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100vw", sm: 420 },
          maxWidth: "100vw",
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* En-tête */}
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Badge badgeContent={stats?.unread || 0} color="primary">
              <NotificationsIcon />
            </Badge>
            <Box>
              <Typography variant="h6">Notifications</Typography>
              <Typography variant="body2" color="text.secondary">
                {stats?.total || 0} au total • {stats?.unread || 0} non lues
              </Typography>
            </Box>
          </Box>
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Actualiser">
              <IconButton
                size="small"
                onClick={() => refreshNotifications()}
                disabled={isLoading}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="Marquer toutes comme lues">
              <IconButton
                size="small"
                onClick={handleMarkAllAsRead}
                disabled={isLoading || (stats?.unread || 0) === 0}
              >
                <MarkEmailRead />
              </IconButton>
            </Tooltip>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Stack>
        </Box>

        {/* Recherche */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <TextField
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm("")}>
                    <Clear fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Actions en masse */}
        {hasSelectedNotifications && (
          <Alert
            severity="info"
            sx={{ m: 2, mb: 0 }}
            action={
              <Stack direction="row" spacing={0.5}>
                <Button
                  size="small"
                  onClick={() => handleBulkAction("mark_read")}
                >
                  Lues
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
                  <Close fontSize="small" />
                </IconButton>
              </Stack>
            }
          >
            {selectedNotifications.length} sélectionnée(s)
          </Alert>
        )}

        {/* Onglets */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            variant="fullWidth"
          >
            <Tab
              label={
                <Badge
                  badgeContent={stats?.total || 0}
                  color="default"
                  max={99}
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
                  max={99}
                >
                  Non lues
                </Badge>
              }
            />
          </Tabs>

          {/* Sélection globale */}
          {filteredNotifications.length > 0 && (
            <Box sx={{ p: 1, borderBottom: 1, borderColor: "divider" }}>
              <Button
                size="small"
                startIcon={<SelectAll />}
                onClick={handleSelectAll}
                fullWidth
              >
                {selectedNotifications.length === filteredNotifications.length
                  ? "Tout désélectionner"
                  : "Tout sélectionner"}{" "}
                ({filteredNotifications.length})
              </Button>
            </Box>
          )}
        </Box>

        {/* Contenu des onglets */}
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
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
                  Aucune notification
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm
                    ? "Aucune notification ne correspond à votre recherche"
                    : "Vous n'avez pas encore de notifications"}
                </Typography>
              </Box>
            ) : (
              <List dense>
                {filteredNotifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <ListItem
                      sx={{
                        bgcolor: notification.read
                          ? "transparent"
                          : "action.hover",
                        cursor: "pointer",
                        "&:hover": { bgcolor: "action.selected" },
                        alignItems: "flex-start",
                        py: 1.5,
                      }}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(
                            notification.id
                          )}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectNotification(notification.id);
                          }}
                          style={{ margin: 0 }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </ListItemIcon>

                      <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                        {getNotificationIcon(
                          notification.type,
                          notification.read
                        )}
                      </ListItemIcon>

                      <ListItemText
                        primary={
                          <Box sx={{ mb: 0.5 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: notification.read
                                  ? "normal"
                                  : "bold",
                                lineHeight: 1.3,
                              }}
                            >
                              {notification.title}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 0.5, lineHeight: 1.3 }}
                            >
                              {notification.message}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                flexWrap: "wrap",
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.disabled"
                              >
                                {notification.created_at &&
                                  formatDistanceToNow(
                                    new Date(notification.created_at),
                                    { addSuffix: true, locale: fr }
                                  )}
                              </Typography>
                              <Chip
                                label={notification.type}
                                size="small"
                                color={getTypeChipColor(notification.type)}
                                variant={
                                  notification.read ? "outlined" : "filled"
                                }
                                sx={{ height: 20, fontSize: "0.7rem" }}
                              />
                            </Box>
                          </Box>
                        }
                      />

                      <ListItemSecondaryAction>
                        <Stack spacing={0.5}>
                          {notification.related_id && (
                            <Tooltip title="Ouvrir">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleNotificationClick(notification);
                                }}
                              >
                                <Launch fontSize="small" />
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
                                <NotificationsActive fontSize="small" />
                              ) : (
                                <MarkEmailRead fontSize="small" />
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
                              <Delete fontSize="small" />
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
                  {searchTerm
                    ? "Aucune notification non lue ne correspond à votre recherche"
                    : "Vous êtes à jour avec toutes vos notifications"}
                </Typography>
              </Box>
            ) : (
              <List dense>
                {filteredNotifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <ListItem
                      sx={{
                        bgcolor: "action.hover",
                        cursor: "pointer",
                        "&:hover": { bgcolor: "action.selected" },
                        alignItems: "flex-start",
                        py: 1.5,
                      }}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(
                            notification.id
                          )}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectNotification(notification.id);
                          }}
                          style={{ margin: 0 }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </ListItemIcon>

                      <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                        {getNotificationIcon(notification.type, false)}
                      </ListItemIcon>

                      <ListItemText
                        primary={
                          <Box sx={{ mb: 0.5 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: "bold", lineHeight: 1.3 }}
                            >
                              {notification.title}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 0.5, lineHeight: 1.3 }}
                            >
                              {notification.message}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                flexWrap: "wrap",
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.disabled"
                              >
                                {notification.created_at &&
                                  formatDistanceToNow(
                                    new Date(notification.created_at),
                                    { addSuffix: true, locale: fr }
                                  )}
                              </Typography>
                              <Chip
                                label={notification.type}
                                size="small"
                                color={getTypeChipColor(notification.type)}
                                sx={{ height: 20, fontSize: "0.7rem" }}
                              />
                            </Box>
                          </Box>
                        }
                      />

                      <ListItemSecondaryAction>
                        <Stack spacing={0.5}>
                          {notification.related_id && (
                            <Tooltip title="Ouvrir">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleNotificationClick(notification);
                                }}
                              >
                                <Launch fontSize="small" />
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
                              <MarkEmailRead fontSize="small" />
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
                              <Delete fontSize="small" />
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
        </Box>
      </Box>
    </Drawer>
  );
};

export default NotificationDrawer;
