import { Box, Card, CardContent, List, ListItem, ListItemText, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useQuery } from '@tanstack/react-query';
import { CardMembership, DirectionsCar, Warning, CheckCircle, TrendingUp } from '@mui/icons-material';
import { certificateApi, vehicleApi } from '../../../services';
import StatCard from '../../../components/common/StatCard';
import StatusChip from '../../../components/common/StatusChip';
import PageContainer from '../../../components/layout/PageContainer';
import { formatDate } from '../../../utils/constants';
import { Certificate, VehicleAssignment } from '../../../types';

const BLUE = {
  primary: '#1e5eff',
  mid: '#2563eb',
  light: '#3b82f6',
  soft: '#60a5fa',
};

export default function DashboardPage() {
  const { data: certData, isLoading: certLoading } = useQuery({
    queryKey: ['cert-dashboard'],
    queryFn: () => certificateApi.getDashboard(),
  });

  const { data: fleetData, isLoading: fleetLoading } = useQuery({
    queryKey: ['fleet-dashboard'],
    queryFn: () => vehicleApi.getDashboard(),
  });

  const cert = certData?.data.data;
  const fleet = fleetData?.data.data;

  return (
    <PageContainer
      title="Dashboard Overview"
      subtitle="Welcome back — here's what's happening across your operations"
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
        Certificates
      </Typography>
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Total Certificates" value={cert?.total ?? 0} icon={<CardMembership />} loading={certLoading} color={BLUE.primary} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Active" value={cert?.active ?? 0} icon={<CheckCircle />} color={BLUE.mid} loading={certLoading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Expired" value={cert?.expired ?? 0} icon={<Warning />} color={BLUE.light} loading={certLoading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Expiring (7 days)" value={cert?.expiringWithin7Days ?? 0} icon={<Warning />} color={BLUE.soft} loading={certLoading} />
        </Grid>
      </Grid>

      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
        Fleet
      </Typography>
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Total Vehicles" value={fleet?.total ?? 0} icon={<DirectionsCar />} loading={fleetLoading} color={BLUE.primary} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Available" value={fleet?.available ?? 0} color={BLUE.mid} loading={fleetLoading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Assigned" value={fleet?.assigned ?? 0} color={BLUE.light} loading={fleetLoading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Utilization" value={`${fleet?.utilization ?? 0}%`} icon={<TrendingUp />} color={BLUE.soft} loading={fleetLoading} />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Recently Added Certificates
              </Typography>
              <List dense disablePadding>
                {(cert?.recentlyAdded || []).slice(0, 5).map((c: Certificate) => (
                  <ListItem key={c._id} divider sx={{ px: 0 }}>
                    <ListItemText
                      primary={c.certificateName}
                      secondary={`${c.certificateId} • Expires: ${formatDate(c.expiryDate)}`}
                    />
                    <StatusChip status={c.status} />
                  </ListItem>
                ))}
                {!cert?.recentlyAdded?.length && (
                  <Typography color="text.secondary" py={2}>
                    No recent certificates
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Active Vehicle Assignments
              </Typography>
              <List dense disablePadding>
                {(fleet?.activeAssignments || []).slice(0, 5).map((a: VehicleAssignment) => (
                  <ListItem key={a._id} divider sx={{ px: 0 }}>
                    <ListItemText
                      primary={`${a.vehicle?.vehicleName} → ${a.assignedTo?.firstName} ${a.assignedTo?.lastName}`}
                      secondary={`${a.assignmentId} • Since: ${formatDate(a.assignmentDate)}`}
                    />
                    <StatusChip status={a.status} />
                  </ListItem>
                ))}
                {!fleet?.activeAssignments?.length && (
                  <Typography color="text.secondary" py={2}>
                    No active assignments
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
