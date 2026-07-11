import { Box, Typography, Fade } from '@mui/material';
import { ReactNode } from 'react';

interface PageContainerProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}

export default function PageContainer({ title, subtitle, action, children }: PageContainerProps) {
  return (
    <Fade in timeout={400}>
      <Box
        sx={{
          width: '100%',
          maxWidth: '100%',
          textAlign: 'left',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2.5, sm: 3 },
          animation: 'fadeIn 0.4s ease',
          '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(8px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: '#0f172a' }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body1" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {action && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              {action}
            </Box>
          )}
        </Box>
        {children}
      </Box>
    </Fade>
  );
}
