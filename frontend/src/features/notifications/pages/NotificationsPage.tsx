import { useState } from 'react';
import {
  Box, Typography, Button, List, ListItem, ListItemText, ListItemIcon,
  IconButton, Chip, Divider,
} from '@mui/material';
import { Notifications as NotifIcon, MarkEmailRead, Delete } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../../../services';
import { formatDate } from '../../../utils/constants';
import PageContainer from '../../../components/layout/PageContainer';

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', page],
    queryFn: () => notificationApi.getAll({ page, limit: 20 }),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllMutation = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const notifications = data?.data.data || [];

  return (
    <PageContainer
      title="Notifications"
      action={
        <Button startIcon={<MarkEmailRead />} onClick={() => markAllMutation.mutate()} disabled={markAllMutation.isPending}>
          Mark All Read
        </Button>
      }
    >
      <List sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(30, 94, 255, 0.08)' }}>
        {isLoading ? (
          <Typography p={3} color="text.secondary">Loading...</Typography>
        ) : notifications.length === 0 ? (
          <Typography p={3} color="text.secondary">No notifications</Typography>
        ) : (
          notifications.map((n, i) => (
            <Box key={n._id}>
              <ListItem
                secondaryAction={
                  !n.isRead && (
                    <IconButton edge="end" onClick={() => markReadMutation.mutate(n._id)}>
                      <MarkEmailRead />
                    </IconButton>
                  )
                }
                sx={{ bgcolor: n.isRead ? 'transparent' : 'action.hover', borderRadius: 1 }}
              >
                <ListItemIcon><NotifIcon color={n.isRead ? 'disabled' : 'primary'} /></ListItemIcon>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      {n.title}
                      {!n.isRead && <Chip label="New" size="small" color="primary" />}
                    </Box>
                  }
                  secondary={
                    <>
                      {n.message}
                      <Typography variant="caption" display="block" color="text.secondary">
                        {formatDate(n.createdAt)} • {n.type.replace(/_/g, ' ')}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {i < notifications.length - 1 && <Divider />}
            </Box>
          ))
        )}
      </List>
    </PageContainer>
  );
}
