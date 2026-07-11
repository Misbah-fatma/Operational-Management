import { Box, IconButton, Tooltip } from '@mui/material';
import { ReactNode } from 'react';

export interface TableAction {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  color?: 'default' | 'primary' | 'error' | 'warning' | 'info';
  disabled?: boolean;
}

const colorMap = {
  default: { bg: 'rgba(100, 116, 139, 0.1)', hover: 'rgba(100, 116, 139, 0.18)', icon: '#64748b' },
  primary: { bg: 'rgba(30, 94, 255, 0.1)', hover: 'rgba(30, 94, 255, 0.18)', icon: '#1e5eff' },
  error: { bg: 'rgba(220, 38, 38, 0.1)', hover: 'rgba(220, 38, 38, 0.18)', icon: '#dc2626' },
  warning: { bg: 'rgba(245, 158, 11, 0.12)', hover: 'rgba(245, 158, 11, 0.2)', icon: '#d97706' },
  info: { bg: 'rgba(37, 99, 235, 0.1)', hover: 'rgba(37, 99, 235, 0.18)', icon: '#2563eb' },
};

export default function TableActionGroup({ actions }: { actions: TableAction[] }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
      {actions.map((action) => {
        const palette = colorMap[action.color || 'default'];
        return (
          <Tooltip key={action.label} title={action.label} arrow placement="top">
            <span>
              <IconButton
                size="small"
                disabled={action.disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                }}
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: palette.bg,
                  color: palette.icon,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: palette.hover,
                    transform: 'translateY(-1px)',
                  },
                  '&.Mui-disabled': { opacity: 0.4 },
                }}
              >
                {action.icon}
              </IconButton>
            </span>
          </Tooltip>
        );
      })}
    </Box>
  );
}
