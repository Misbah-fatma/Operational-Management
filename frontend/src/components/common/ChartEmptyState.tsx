import { Box, Typography, alpha } from '@mui/material';
import { BarChartOutlined, ShowChartOutlined, PieChartOutline } from '@mui/icons-material';

type ChartEmptyVariant = 'bar' | 'line' | 'pie';

interface ChartEmptyStateProps {
  message?: string;
  hint?: string;
  variant?: ChartEmptyVariant;
  height?: number;
}

const variantIcon = {
  bar: BarChartOutlined,
  line: ShowChartOutlined,
  pie: PieChartOutline,
};

/** Placeholder grid + message when a chart has no data */
export default function ChartEmptyState({
  message = 'No data available',
  hint = 'Data will appear here once records are added',
  variant = 'bar',
  height = 280,
}: ChartEmptyStateProps) {
  const Icon = variantIcon[variant];

  return (
    <Box
      sx={{
        height,
        width: '100%',
        borderRadius: 2,
        border: '1px dashed rgba(30, 94, 255, 0.2)',
        bgcolor: alpha('#1e5eff', 0.02),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Faint chart grid background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 16,
          opacity: 0.35,
          pointerEvents: 'none',
        }}
      >
        {[...Array(5)].map((_, i) => (
          <Box
            key={`h-${i}`}
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${i * 25}%`,
              borderTop: '1px solid rgba(30, 94, 255, 0.12)',
            }}
          />
        ))}
        {variant === 'bar' &&
          [...Array(4)].map((_, i) => (
            <Box
              key={`b-${i}`}
              sx={{
                position: 'absolute',
                bottom: 0,
                left: `${12 + i * 22}%`,
                width: '14%',
                height: `${8 + i * 4}%`,
                bgcolor: alpha('#1e5eff', 0.08),
                borderRadius: '4px 4px 0 0',
              }}
            />
          ))}
        {variant === 'line' && (
          <svg width="100%" height="100%" viewBox="0 0 200 80" preserveAspectRatio="none">
            <path
              d="M0,60 L40,45 L80,55 L120,30 L160,40 L200,20"
              fill="none"
              stroke="rgba(30, 94, 255, 0.15)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>
        )}
        {variant === 'pie' && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 80,
              height: 80,
              borderRadius: '50%',
              border: '12px solid rgba(30, 94, 255, 0.1)',
            }}
          />
        )}
      </Box>

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          px: 2,
        }}
      >
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 2.5,
            mx: 'auto',
            mb: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha('#1e5eff', 0.1),
            color: '#1e5eff',
          }}
        >
          <Icon sx={{ fontSize: 28 }} />
        </Box>
        <Typography variant="body2" fontWeight={600} color="text.primary">
          {message}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', maxWidth: 260 }}>
          {hint}
        </Typography>
      </Box>
    </Box>
  );
}

export function hasResourceAllocationData(
  data?: { resourceType?: string; count?: number }[],
): boolean {
  return !!data?.length && data.some((d) => (d.count ?? 0) > 0);
}

export function hasMonthlyProgressData(
  data?: { month?: string; avgProgress?: number }[],
): boolean {
  return !!data?.length;
}
