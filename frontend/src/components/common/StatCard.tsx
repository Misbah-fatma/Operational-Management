import { Box, Card, CardContent, Typography, Skeleton, useTheme } from '@mui/material';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
  color?: string;
  subtitle?: string;
  loading?: boolean;
}

export default function StatCard({
  title,
  value,
  icon,
  color,
  subtitle,
  loading,
}: StatCardProps) {
  const theme = useTheme();
  const accentColor = color || theme.palette.primary.main;

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(30, 94, 255, 0.12)',
        },
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
            {loading ? (
              <Skeleton width={72} height={44} />
            ) : (
              <Typography variant="h4" sx={{ fontWeight: 700, color: accentColor, lineHeight: 1.2 }}>
                {value}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {icon && (
            <Box
              sx={{
                p: 1.25,
                borderRadius: 2.5,
                bgcolor: 'rgba(30, 94, 255, 0.1)',
                color: accentColor,
                display: 'flex',
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
