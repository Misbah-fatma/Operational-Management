import { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { ReactNode } from 'react';

export interface RowMenuAction {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

interface TableRowMenuProps {
  actions: RowMenuAction[];
}

export default function TableRowMenu({ actions }: TableRowMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const regular = actions.filter((a) => !a.danger);
  const destructive = actions.filter((a) => a.danger);

  const handleClose = () => setAnchorEl(null);

  const renderItem = (action: RowMenuAction) => (
    <MenuItem
      key={action.label}
      disabled={action.disabled}
      onClick={() => {
        handleClose();
        action.onClick();
      }}
      sx={{
        py: 1,
        borderRadius: 1,
        mx: 0.5,
        color: action.danger ? 'error.main' : 'text.primary',
        '&:hover': action.danger ? { bgcolor: 'error.lighter' } : undefined,
      }}
    >
      <ListItemIcon sx={{ minWidth: 36, color: action.danger ? 'error.main' : 'text.secondary' }}>
        {action.icon}
      </ListItemIcon>
      <ListItemText
        primary={action.label}
        primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: action.danger ? 600 : 500 }}
      />
    </MenuItem>
  );

  return (
    <>
      <IconButton
        size="small"
        aria-label="Row actions"
        onClick={(e) => {
          e.stopPropagation();
          setAnchorEl(e.currentTarget);
        }}
        sx={{
          color: 'text.secondary',
          border: '1px solid rgba(30, 94, 255, 0.12)',
          borderRadius: 1.5,
          width: 32,
          height: 32,
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: 'rgba(30, 94, 255, 0.06)',
            borderColor: 'rgba(30, 94, 255, 0.2)',
            color: 'primary.main',
          },
        }}
      >
        <MoreVert sx={{ fontSize: 18 }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 180,
              mt: 0.5,
              borderRadius: 2,
              border: '1px solid rgba(30, 94, 255, 0.08)',
              boxShadow: '0 8px 24px rgba(30, 94, 255, 0.12)',
            },
          },
        }}
      >
        {regular.map(renderItem)}
        {destructive.length > 0 && regular.length > 0 && <Divider sx={{ my: 0.5 }} />}
        {destructive.map(renderItem)}
      </Menu>
    </>
  );
}
