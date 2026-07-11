import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Divider,
  Avatar,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Person, Lock, Visibility, VisibilityOff, Save } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useAuth } from '../../../contexts/AuthContext';
import { authApi } from '../../../services';
import PageContainer from '../../../components/layout/PageContainer';
import { formatRole } from '../../../utils/constants';

interface ProfileForm {
  firstName: string;
  lastName: string;
  phone: string;
  department: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const profileForm = useForm<ProfileForm>({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      department: user?.department || '',
    },
    values: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      department: user?.department || '',
    },
  });

  const passwordForm = useForm<PasswordForm>({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProfileForm) => authApi.updateProfile(data),
    onSuccess: (res) => {
      enqueueSnackbar('Profile updated successfully', { variant: 'success' });
      if (res.data.data) updateUser(res.data.data);
    },
    onError: () => enqueueSnackbar('Failed to update profile', { variant: 'error' }),
  });

  const passwordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(data.currentPassword, data.newPassword),
    onSuccess: () => {
      enqueueSnackbar('Password changed successfully', { variant: 'success' });
      passwordForm.reset();
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to change password';
      enqueueSnackbar(msg, { variant: 'error' });
    },
  });

  const onPasswordSubmit = (data: PasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      enqueueSnackbar('New passwords do not match', { variant: 'error' });
      return;
    }
    if (data.newPassword.length < 6) {
      enqueueSnackbar('Password must be at least 6 characters', { variant: 'error' });
      return;
    }
    passwordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  if (!user) return null;

  return (
    <PageContainer title="My Profile" subtitle="Manage your account settings and security">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 88,
                  height: 88,
                  mx: 'auto',
                  mb: 2,
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #1e5eff 0%, #3b82f6 100%)',
                }}
              >
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user.email}
              </Typography>
              <Box
                sx={{
                  display: 'inline-block',
                  mt: 1,
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(30, 94, 255, 0.1)',
                  color: 'primary.main',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                }}
              >
                {formatRole(user.role)}
              </Box>
              <Divider sx={{ my: 2.5 }} />
              <Box sx={{ textAlign: 'left' }}>
                {user.employeeId && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Employee ID: <strong>{user.employeeId}</strong>
                  </Typography>
                )}
                {user.department && (
                  <Typography variant="body2" color="text.secondary">
                    Department: <strong>{user.department}</strong>
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                <Person color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Profile Information
                </Typography>
              </Box>
              <form onSubmit={profileForm.handleSubmit((data) => updateMutation.mutate(data))}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      {...profileForm.register('firstName', { required: true })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      {...profileForm.register('lastName', { required: true })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Email" value={user.email} disabled />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Phone" {...profileForm.register('phone')} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth label="Department" {...profileForm.register('department')} />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={updateMutation.isPending ? <CircularProgress size={18} color="inherit" /> : <Save />}
                  disabled={updateMutation.isPending}
                  sx={{ mt: 3 }}
                >
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                <Lock color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Change Password
                </Typography>
              </Box>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      type={showCurrent ? 'text' : 'password'}
                      {...passwordForm.register('currentPassword', { required: true })}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowCurrent(!showCurrent)} edge="end">
                              {showCurrent ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type={showNew ? 'text' : 'password'}
                      {...passwordForm.register('newPassword', { required: true })}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowNew(!showNew)} edge="end">
                              {showNew ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type={showNew ? 'text' : 'password'}
                      {...passwordForm.register('confirmPassword', { required: true })}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="outlined"
                  disabled={passwordMutation.isPending}
                  sx={{ mt: 3 }}
                >
                  {passwordMutation.isPending ? <CircularProgress size={22} /> : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
