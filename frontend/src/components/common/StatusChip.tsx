import { Chip, ChipProps } from '@mui/material';

interface StatusChipProps {
  status: string;
  size?: ChipProps['size'];
}

const blueStatusStyles: Record<string, { bg: string; color: string; border: string }> = {
  Active: { bg: 'rgba(30, 94, 255, 0.1)', color: '#1e5eff', border: 'rgba(30, 94, 255, 0.3)' },
  'Expiring Soon': { bg: 'rgba(59, 130, 246, 0.12)', color: '#2563eb', border: 'rgba(37, 99, 235, 0.35)' },
  Expired: { bg: 'rgba(13, 60, 184, 0.12)', color: '#0d3cb8', border: 'rgba(13, 60, 184, 0.35)' },
  Renewed: { bg: 'rgba(96, 165, 250, 0.15)', color: '#3b82f6', border: 'rgba(59, 130, 246, 0.35)' },
  Archived: { bg: 'rgba(100, 116, 139, 0.1)', color: '#64748b', border: 'rgba(100, 116, 139, 0.25)' },
  Available: { bg: 'rgba(30, 94, 255, 0.1)', color: '#1e5eff', border: 'rgba(30, 94, 255, 0.3)' },
  Assigned: { bg: 'rgba(37, 99, 235, 0.12)', color: '#2563eb', border: 'rgba(37, 99, 235, 0.35)' },
  'Under Maintenance': { bg: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', border: 'rgba(59, 130, 246, 0.35)' },
  'Insurance Expired': { bg: 'rgba(13, 60, 184, 0.12)', color: '#0d3cb8', border: 'rgba(13, 60, 184, 0.35)' },
  'MVPI Expired': { bg: 'rgba(96, 165, 250, 0.15)', color: '#60a5fa', border: 'rgba(96, 165, 250, 0.35)' },
  Inactive: { bg: 'rgba(100, 116, 139, 0.1)', color: '#64748b', border: 'rgba(100, 116, 139, 0.25)' },
  Overdue: { bg: 'rgba(13, 60, 184, 0.15)', color: '#0d3cb8', border: 'rgba(13, 60, 184, 0.4)' },
  Returned: { bg: 'rgba(30, 94, 255, 0.1)', color: '#1e5eff', border: 'rgba(30, 94, 255, 0.3)' },
};

const defaultStyle = { bg: 'rgba(30, 94, 255, 0.08)', color: '#2563eb', border: 'rgba(30, 94, 255, 0.2)' };

export default function StatusChip({ status, size = 'small' }: StatusChipProps) {
  const style = blueStatusStyles[status] || defaultStyle;

  return (
    <Chip
      label={status}
      size={size}
      sx={{
        bgcolor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        fontWeight: 600,
        fontSize: '0.75rem',
      }}
    />
  );
}
