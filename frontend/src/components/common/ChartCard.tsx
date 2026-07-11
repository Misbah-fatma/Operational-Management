import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  height?: number;
  loading?: boolean;
  action?: ReactNode;
  empty?: boolean;
  emptyContent?: ReactNode;
}

export default function ChartCard({
  title,
  subtitle,
  children,
  height = 320,
  loading,
  action,
  empty,
  emptyContent,
}: ChartCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {action}
        </Box>
        <Box sx={{ flex: 1, minHeight: height }}>
          {loading ? (
            <Skeleton variant="rounded" width="100%" height={height} sx={{ borderRadius: 2 }} />
          ) : empty && emptyContent ? (
            emptyContent
          ) : (
            children
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
