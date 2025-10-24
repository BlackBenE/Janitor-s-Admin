import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { SxProps, Theme } from '@mui/material/styles';

import { SystemStyleObject } from '@mui/system';
import { LABELS } from '@/core/config/labels';

interface DataModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: number | string;
  showCloseButton?: boolean;
  customStyle?: SxProps<Theme>;
}

const baseStyle: SystemStyleObject<Theme> = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
  maxHeight: '90vh',
  overflowY: 'auto',
};

function DataModal({
  open,
  onClose,
  children,
  width = 400,
  showCloseButton = true,
  customStyle,
}: DataModalProps) {
  const combinedStyle: SystemStyleObject<Theme> = {
    ...baseStyle,
    width: typeof width === 'number' ? width : width,
    ...((customStyle as SystemStyleObject<Theme>) || {}),
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={combinedStyle}>
        {showCloseButton && (
          <IconButton
            aria-label={LABELS.modal.ariaLabel}
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
        {children}
      </Box>
    </Modal>
  );
}

export default DataModal;
