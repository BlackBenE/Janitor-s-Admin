import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from "@mui/material";
import {
  Close,
  Send,
  Group,
  Person,
  Email,
  Sms,
  Notifications,
  ExpandMore,
  Preview,
  Save,
  Edit,
  FileCopy,
  Campaign,
} from "@mui/icons-material";
import { useNotifications } from "../hooks/shared/useNotifications";

interface CommunicationDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: "email" | "notification" | "sms";
  variables: string[];
  created_at: string;
}

interface Recipient {
  id: string;
  name: string;
  email: string;
  type: "user" | "provider" | "admin";
  avatar?: string;
}

const CommunicationDrawer: React.FC<CommunicationDrawerProps> = ({
  open,
  onClose,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [messageType, setMessageType] = useState<
    "email" | "notification" | "sms"
  >("notification");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const { useBroadcastNotification } = useNotifications();
  const broadcastMutation = useBroadcastNotification();

  // Mock data pour les destinataires
  const mockRecipients: Recipient[] = React.useMemo(
    () => [
      { id: "1", name: "Jean Dupont", email: "jean@example.com", type: "user" },
      {
        id: "2",
        name: "Marie Martin",
        email: "marie@example.com",
        type: "user",
      },
      {
        id: "3",
        name: "Service Nettoyage Pro",
        email: "contact@nettoyage.com",
        type: "provider",
      },
      {
        id: "4",
        name: "Pierre Admin",
        email: "pierre@admin.com",
        type: "admin",
      },
      {
        id: "5",
        name: "Sophie Voyageuse",
        email: "sophie@example.com",
        type: "user",
      },
    ],
    []
  );

  // Mock templates
  const mockTemplates: Template[] = [
    {
      id: "1",
      name: "Bienvenue nouveau utilisateur",
      subject: "Bienvenue sur notre plateforme !",
      content:
        "Bonjour {{name}},\n\nNous sommes ravis de vous accueillir sur notre plateforme. Votre compte a été créé avec succès.\n\nCordialement,\nL'équipe",
      type: "email",
      variables: ["name"],
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Rappel validation prestataire",
      subject: "Action requise: Validation de profil",
      content:
        "Votre profil prestataire nécessite une validation. Merci de compléter les informations manquantes.",
      type: "notification",
      variables: [],
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Confirmation réservation",
      subject: "Votre réservation est confirmée",
      content:
        "Bonjour {{name}},\n\nVotre réservation du {{date}} est confirmée.\nRéférence: {{booking_id}}\n\nMerci de votre confiance.",
      type: "email",
      variables: ["name", "date", "booking_id"],
      created_at: new Date().toISOString(),
    },
  ];

  // Charger les destinataires au montage
  React.useEffect(() => {
    if (open) {
      setRecipients(mockRecipients);
    }
  }, [open, mockRecipients]);

  const handleRecipientToggle = (recipientId: string) => {
    setSelectedRecipients((prev) =>
      prev.includes(recipientId)
        ? prev.filter((id) => id !== recipientId)
        : [...prev, recipientId]
    );
  };

  // const handleSelectAllRecipients = () => {
  //   if (selectedRecipients.length === recipients.length) {
  //     setSelectedRecipients([]);
  //   } else {
  //     setSelectedRecipients(recipients.map((r) => r.id));
  //   }
  // };

  const handleFilterByType = (type: string) => {
    if (type === "all") {
      setSelectedRecipients(recipients.map((r) => r.id));
    } else {
      const filteredIds = recipients
        .filter((r) => r.type === type)
        .map((r) => r.id);
      setSelectedRecipients(filteredIds);
    }
  };

  const handleUseTemplate = (template: Template) => {
    setMessageType(template.type);
    setSubject(template.subject);
    setContent(template.content);
    setSelectedTab(0); // Retourner à l'onglet composition
  };

  const handleSendMessage = async () => {
    if (!content.trim() || selectedRecipients.length === 0) {
      return;
    }

    setSending(true);
    try {
      if (messageType === "notification") {
        await broadcastMutation.mutateAsync({
          userIds: selectedRecipients,
          title: subject || "Nouvelle notification",
          message: content,
          type: "info",
        });
      } else {
        // Pour email et SMS, on simulerait l'envoi ici
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      // Reset du formulaire
      setSubject("");
      setContent("");
      setSelectedRecipients([]);

      // Fermer le drawer après succès
      onClose();

      // Feedback à l'utilisateur (vous pourriez utiliser un toast/snackbar)
      alert(
        `Message ${messageType} envoyé avec succès à ${selectedRecipients.length} destinataire(s) !`
      );
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      alert("Erreur lors de l'envoi du message");
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    // Reset des formulaires au besoin
    if (!sending) {
      onClose();
    }
  };

  const getRecipientIcon = (type: string) => {
    switch (type) {
      case "user":
        return <Person color="primary" />;
      case "provider":
        return <Group color="secondary" />;
      case "admin":
        return <Person color="error" />;
      default:
        return <Person />;
    }
  };

  const TabPanel = ({
    children,
    value,
    index,
  }: {
    children: React.ReactNode;
    value: number;
    index: number;
  }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100vw", sm: 500 },
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
              <Campaign color="primary" />
              <Box>
                <Typography variant="h6">Centre de Communication</Typography>
                <Typography variant="body2" color="text.secondary">
                  Envoyez des messages aux utilisateurs
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleClose} disabled={sending}>
              <Close />
            </IconButton>
          </Box>

          {/* Onglets */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={selectedTab}
              onChange={(_, value) => setSelectedTab(value)}
              variant="fullWidth"
            >
              <Tab icon={<Edit />} label="Composer" />
              <Tab icon={<FileCopy />} label="Templates" />
            </Tabs>
          </Box>

          {/* Contenu */}
          <Box sx={{ flexGrow: 1, overflow: "auto" }}>
            <TabPanel value={selectedTab} index={0}>
              <Stack spacing={2}>
                {/* Type de message */}
                <FormControl fullWidth size="small">
                  <InputLabel>Type de message</InputLabel>
                  <Select
                    value={messageType}
                    label="Type de message"
                    onChange={(e) =>
                      setMessageType(
                        e.target.value as "email" | "notification" | "sms"
                      )
                    }
                  >
                    <MenuItem value="notification">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Notifications fontSize="small" /> Notification
                      </Box>
                    </MenuItem>
                    <MenuItem value="email">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Email fontSize="small" /> Email
                      </Box>
                    </MenuItem>
                    <MenuItem value="sms">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Sms fontSize="small" /> SMS
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>

                {/* Sujet/Titre */}
                {(messageType === "email" ||
                  messageType === "notification") && (
                  <TextField
                    label={
                      messageType === "email"
                        ? "Sujet"
                        : "Titre de la notification"
                    }
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    fullWidth
                    size="small"
                    placeholder={
                      messageType === "email"
                        ? "Entrez le sujet de votre email"
                        : "Titre de votre notification"
                    }
                  />
                )}

                {/* Contenu */}
                <TextField
                  label={messageType === "sms" ? "Message SMS" : "Contenu"}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  multiline
                  rows={messageType === "sms" ? 3 : 5}
                  fullWidth
                  size="small"
                  placeholder={
                    messageType === "sms"
                      ? "Rédigez votre message SMS (max 160 caractères)"
                      : "Rédigez votre message..."
                  }
                  helperText={
                    messageType === "sms"
                      ? `${content.length}/160 caractères`
                      : "Utilisez {{variable}} pour insérer des variables"
                  }
                />

                {/* Variables disponibles */}
                {messageType !== "sms" && (
                  <Paper sx={{ p: 1.5, bgcolor: "grey.50" }}>
                    <Typography
                      variant="caption"
                      gutterBottom
                      display="block"
                      fontWeight="bold"
                    >
                      Variables disponibles :
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={0.5}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      {[
                        "{{name}}",
                        "{{email}}",
                        "{{date}}",
                        "{{booking_id}}",
                      ].map((variable) => (
                        <Chip
                          key={variable}
                          label={variable}
                          size="small"
                          onClick={() =>
                            setContent((prev) => prev + " " + variable)
                          }
                          sx={{
                            cursor: "pointer",
                            fontSize: "0.7rem",
                            height: 20,
                          }}
                        />
                      ))}
                    </Stack>
                  </Paper>
                )}

                {/* Destinataires */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Destinataires ({selectedRecipients.length}/
                    {recipients.length})
                  </Typography>

                  {/* Filtres rapides */}
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Button
                      size="small"
                      variant={
                        selectedRecipients.length === recipients.length
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => handleFilterByType("all")}
                    >
                      Tous
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleFilterByType("user")}
                    >
                      Users
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleFilterByType("provider")}
                    >
                      Prestataires
                    </Button>
                  </Stack>

                  {/* Liste des destinataires */}
                  <Paper
                    sx={{
                      maxHeight: 200,
                      overflow: "auto",
                      border: 1,
                      borderColor: "divider",
                    }}
                  >
                    <List dense>
                      {recipients.map((recipient) => (
                        <ListItem key={recipient.id} sx={{ px: 1, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Checkbox
                              size="small"
                              checked={selectedRecipients.includes(
                                recipient.id
                              )}
                              onChange={() =>
                                handleRecipientToggle(recipient.id)
                              }
                            />
                          </ListItemIcon>
                          <ListItemIcon sx={{ minWidth: 24 }}>
                            {getRecipientIcon(recipient.type)}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body2">
                                {recipient.name}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {recipient.email}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Box>

                {/* Résumé */}
                <Alert severity="info" sx={{ fontSize: "0.8rem" }}>
                  <Typography variant="body2">
                    📊 <strong>Résumé:</strong> {messageType} pour{" "}
                    {selectedRecipients.length} destinataire(s)
                    {messageType === "sms" && (
                      <span>
                        {" "}
                        • Coût estimé:{" "}
                        {(selectedRecipients.length * 0.05).toFixed(2)}€
                      </span>
                    )}
                  </Typography>
                </Alert>
              </Stack>
            </TabPanel>

            <TabPanel value={selectedTab} index={1}>
              <Stack spacing={1}>
                <Typography variant="subtitle2" gutterBottom>
                  Templates disponibles
                </Typography>
                {mockTemplates.map((template) => (
                  <Accordion key={template.id}>
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      sx={{ py: 0.5 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          width: "100%",
                        }}
                      >
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" fontWeight="bold">
                            {template.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {template.type} • {template.variables.length}{" "}
                            variables
                          </Typography>
                        </Box>
                        <Chip label={template.type} size="small" />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0 }}>
                      <Box sx={{ mb: 1 }}>
                        {template.subject && (
                          <>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              Sujet:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                mb: 1,
                                p: 0.5,
                                bgcolor: "grey.100",
                                borderRadius: 0.5,
                                fontSize: "0.8rem",
                              }}
                            >
                              {template.subject}
                            </Typography>
                          </>
                        )}

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          Contenu:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 1,
                            p: 0.5,
                            bgcolor: "grey.100",
                            borderRadius: 0.5,
                            whiteSpace: "pre-wrap",
                            fontSize: "0.8rem",
                          }}
                        >
                          {template.content}
                        </Typography>

                        {template.variables.length > 0 && (
                          <>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              Variables:
                            </Typography>
                            <Stack direction="row" spacing={0.5} sx={{ mb: 1 }}>
                              {template.variables.map((variable) => (
                                <Chip
                                  key={variable}
                                  label={`{{${variable}}}`}
                                  size="small"
                                  sx={{ fontSize: "0.7rem", height: 20 }}
                                />
                              ))}
                            </Stack>
                          </>
                        )}
                      </Box>

                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleUseTemplate(template)}
                        startIcon={<Edit />}
                        fullWidth
                      >
                        Utiliser ce template
                      </Button>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Stack>
            </TabPanel>
          </Box>

          {/* Actions */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
            <Stack spacing={1}>
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={
                  !content.trim() || selectedRecipients.length === 0 || sending
                }
                startIcon={sending ? <CircularProgress size={16} /> : <Send />}
                fullWidth
              >
                {sending
                  ? "Envoi..."
                  : `Envoyer (${selectedRecipients.length})`}
              </Button>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  onClick={() => setPreviewOpen(true)}
                  disabled={!content.trim()}
                  startIcon={<Preview />}
                  size="small"
                  fullWidth
                >
                  Aperçu
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Save />}
                  size="small"
                  fullWidth
                >
                  Sauvegarder
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Drawer>

      {/* Dialog d'aperçu */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Aperçu du message</DialogTitle>
        <DialogContent>
          <Paper sx={{ p: 2, mb: 2, bgcolor: "grey.50" }}>
            <Typography variant="subtitle2" gutterBottom>
              Type: {messageType}
            </Typography>
            {subject && (
              <Typography variant="subtitle2" gutterBottom>
                {messageType === "email" ? "Sujet" : "Titre"}: {subject}
              </Typography>
            )}
            <Typography variant="subtitle2" gutterBottom>
              Destinataires: {selectedRecipients.length}
            </Typography>
          </Paper>

          <Paper sx={{ p: 2, border: 1, borderColor: "divider" }}>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {content}
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Fermer</Button>
          <Button
            variant="contained"
            onClick={() => {
              setPreviewOpen(false);
              handleSendMessage();
            }}
          >
            Envoyer maintenant
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CommunicationDrawer;
