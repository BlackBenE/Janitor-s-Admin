import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { orange, blue, green } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import { LABELS } from '@/core/config/labels';

// Mettez à jour les couleurs pour correspondre au fond de la pastille
type Status = 'Pending' | 'Review Required' | 'Completed';

const statusColors: Record<Status, { text: string; background: string }> = {
  Pending: { text: orange[500], background: orange[50] },
  'Review Required': { text: blue[500], background: blue[50] },
  Completed: { text: green[500], background: green[50] },
};

const statusIcons: Record<Status, React.ReactNode> = {
  Pending: <HourglassEmptyIcon sx={{ color: orange[500] }} />,
  'Review Required': <AccessTimeIcon sx={{ color: blue[500] }} />,
  Completed: <CheckCircleOutlineIcon sx={{ color: green[500] }} />,
};

// Traduction des statuts
const statusTranslations: Record<Status, string> = {
  Pending: LABELS.dashboard.activities.status.pending,
  'Review Required': LABELS.dashboard.activities.status.reviewRequired,
  Completed: LABELS.dashboard.activities.status.completed,
};

interface ActivityItemProps {
  status: Status;
  title: string;
  description: string;
  actionLabel?: string;
  activityId?: string;
  activityType?: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  status,
  title,
  description,
  actionLabel,
  activityId,
  activityType,
}) => {
  const navigate = useNavigate();

  // Mapping des types d'activités vers les routes et actions
  const getNavigationInfo = (type: string) => {
    switch (type) {
      case 'property':
        return { route: '/property-approvals', param: activityId };
      case 'provider':
      case 'pending_user':
      case 'locked_account':
        return { route: '/user-management', param: activityId };
      case 'service':
        return { route: '/services-catalog', param: activityId };
      case 'payment':
      case 'failed_payment':
      case 'overdue_payment':
      case 'pending_refund':
        return { route: '/payments', param: activityId };
      case 'chat_report':
        return { route: '/user-management', param: activityId }; // Peut-être une future page de modération
      default:
        return { route: '/dashboard', param: null };
    }
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche le clic sur la row

    if (!activityType || !activityId) return;

    const navInfo = getNavigationInfo(activityType);

    // Navigation avec paramètre pour ouvrir directement le détail/modale
    if (navInfo.param) {
      navigate(`${navInfo.route}?highlight=${navInfo.param}`);
    } else {
      navigate(navInfo.route);
    }
  };
  const handleRowClick = () => {
    if (!activityType) return;

    const navInfo = getNavigationInfo(activityType);
    navigate(navInfo.route);
  };

  return (
    <Box
      onClick={handleRowClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        borderBottom: '1px solid #ffffffff', // Bordure fine en bas pour séparer les items
        '&:last-child': { borderBottom: 'none' },
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#f5f5f5',
        },
        transition: 'background-color 0.2s ease',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ mr: 2 }}>{statusIcons[status]}</Box>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
      </Box>

      {/* Ajout des encadrements pour les statuts */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: '16px', // forme de pastille
            backgroundColor: statusColors[status].background,
            color: statusColors[status].text,
            fontWeight: 'bold',
            fontSize: '0.8rem',
          }}
        >
          {statusTranslations[status]}
        </Box>
        {actionLabel && (
          <Button
            variant="contained"
            disableElevation
            onClick={handleActionClick}
            sx={{
              backgroundColor: '#1a202c',
              color: 'white',
              borderRadius: '8px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#2d3748',
              },
            }}
          >
            {actionLabel}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ActivityItem;
