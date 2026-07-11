import { Box, Typography, Card, CardContent, Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useQuery } from '@tanstack/react-query';
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
} from 'recharts';
import { CardMembership, Warning, CheckCircle, Schedule } from '@mui/icons-material';
import { certificateApi } from '../../../services';
import StatCard from '../../../components/common/StatCard';
import StatusChip from '../../../components/common/StatusChip';
import { formatDate } from '../../../utils/constants';

import PageContainer from '../../../components/layout/PageContainer';

const COLORS = ['#1e5eff', '#2563eb', '#3b82f6', '#60a5fa', '#0d3cb8', '#5b8cff'];

export default function CertificateDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['cert-dashboard'],
    queryFn: () => certificateApi.getDashboard(),
  });

  const stats = data?.data.data;

  return (
    <PageContainer title="Certificate Dashboard" subtitle="Analytics and insights for certificate compliance">
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatCard title="Total" value={stats?.total ?? 0} icon={<CardMembership />} loading={isLoading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatCard title="Active" value={stats?.active ?? 0} icon={<CheckCircle />} color="#2E7D32" loading={isLoading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatCard title="Expired" value={stats?.expired ?? 0} icon={<Warning />} color="#D32F2F" loading={isLoading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <StatCard title="Expiring (7 days)" value={stats?.expiringWithin7Days ?? 0} icon={<Schedule />} color="#ED6C02" loading={isLoading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <StatCard title="Expiring (30 days)" value={stats?.expiringWithin30Days ?? 0} icon={<Schedule />} color="#F57C00" loading={isLoading} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, height: 360 }}>
            <Typography variant="h6" gutterBottom>By Category</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={stats?.byCategory || []}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(props) => `${(props as { category?: string }).category}: ${(props as { count?: number }).count}`}
                >
                  {(stats?.byCategory || []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, height: 360 }}>
            <Typography variant="h6" gutterBottom>By Status</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={stats?.byStatus || []}>
                <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#1565C0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Upcoming Renewals</Typography>
              {(stats?.upcomingRenewals || []).map((c) => (
                <Box key={c._id} display="flex" justifyContent="space-between" py={1} borderBottom="1px solid #eee">
                  <Box>
                    <Typography variant="body2" fontWeight={600}>{c.certificateName}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Renewal: {formatDate(c.renewalDate)}
                    </Typography>
                  </Box>
                  <StatusChip status={c.status} />
                </Box>
              ))}
              {!stats?.upcomingRenewals?.length && (
                <Typography color="text.secondary">No upcoming renewals</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recently Added</Typography>
              {(stats?.recentlyAdded || []).map((c) => (
                <Box key={c._id} display="flex" justifyContent="space-between" py={1} borderBottom="1px solid #eee">
                  <Box>
                    <Typography variant="body2" fontWeight={600}>{c.certificateName}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {c.certificateId} • {c.category}
                    </Typography>
                  </Box>
                  <StatusChip status={c.status} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
