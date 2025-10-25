import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import {
  FileDownload as ExportIcon,
  Description as PdfIcon,
  TableChart as CsvIcon,
  GridOn as ExcelIcon,
} from '@mui/icons-material';

export type ExportFormat = 'csv' | 'pdf' | 'excel';

interface ExportMenuProps {
  /**
   * Callback appelé lors du choix d'un format d'export
   */
  onExport: (format: ExportFormat) => void;
  /**
   * Formats disponibles pour l'export
   * @default ['csv', 'pdf']
   */
  formats?: ExportFormat[];
  /**
   * Désactiver le bouton d'export
   */
  disabled?: boolean;
  /**
   * Indique si un export est en cours
   */
  isExporting?: boolean;
  /**
   * Texte du tooltip
   * @default "Exporter les données"
   */
  tooltipTitle?: string;
  /**
   * Taille du bouton
   * @default "large"
   */
  size?: 'small' | 'medium' | 'large';
}

/**
 * ExportMenu - Menu déroulant pour choisir le format d'export
 *
 * Composant réutilisable pour gérer l'export de données dans différents formats.
 * Affiche un IconButton avec une icône d'export qui ouvre un menu déroulant.
 *
 * @example
 * ```tsx
 * <ExportMenu
 *   onExport={(format) => handleExport(format)}
 *   formats={['csv', 'pdf']}
 *   disabled={!hasData}
 * />
 * ```
 */
export const ExportMenu: React.FC<ExportMenuProps> = ({
  onExport,
  formats = ['csv', 'pdf'],
  disabled = false,
  isExporting = false,
  tooltipTitle = 'Exporter les données',
  size = 'large',
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (format: ExportFormat) => {
    onExport(format);
    handleClose();
  };

  const formatConfig: Record<ExportFormat, { icon: React.ReactNode; label: string }> = {
    csv: {
      icon: <CsvIcon fontSize="small" />,
      label: 'Exporter en CSV',
    },
    pdf: {
      icon: <PdfIcon fontSize="small" />,
      label: 'Exporter en PDF',
    },
    excel: {
      icon: <ExcelIcon fontSize="small" />,
      label: 'Exporter en Excel',
    },
  };

  return (
    <>
      <Tooltip title={tooltipTitle}>
        <span>
          <IconButton
            size={size}
            onClick={handleClick}
            disabled={disabled || isExporting}
            aria-controls={open ? 'export-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <ExportIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Menu
        id="export-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'export-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {formats.map((format) => (
          <MenuItem key={format} onClick={() => handleExport(format)} disabled={isExporting}>
            <ListItemIcon>{formatConfig[format].icon}</ListItemIcon>
            <ListItemText>{formatConfig[format].label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ExportMenu;
