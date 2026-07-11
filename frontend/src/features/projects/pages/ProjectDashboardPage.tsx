import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  alpha,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useQuery } from '@tanstack/react-query';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Line,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts';
import {
  Work,
  Timeline,
  Warning,
  CheckCircle,
  People,
  DirectionsCar,
  PendingActions,
  TrendingUp,
} from '@mui/icons-material';
import { projectApi } from '../../../services';
import StatCard from '../../../components/common/StatCard';
import ChartCard from '../../../components/common/ChartCard';
import ChartEmptyState, {
  hasResourceAllocationData,
  hasMonthlyProgressData,
} from '../../../components/common/ChartEmptyState';
import StatusChip from '../../../components/common/StatusChip';
import PageContainer from '../../../components/layout/PageContainer';
import { formatDate } from '../../../utils/constants';
import { Project } from '../../../types';

const COLORS = ['#1e5eff', '#2563eb', '#3b82f6', '#60a5fa', '#0d3cb8', '#93c5fd', '#5b8cff'];

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        bgcolor: '#fff',
        p: 1.5,
        borderRadius: 2,
        border: '1px solid rgba(30,94,255,0.12)',
        boxShadow: '0 4px 16px rgba(30,94,255,0.1)',
      }}
    >
      <Typography variant="caption" fontWeight={600}>
        {label}
      </Typography>
      {payload.map((p, i) => (
        <Typography key={i} variant="body2" color="primary">
          {p.name}: {p.value}
        </Typography>
      ))}
    </Box>
  );
};

export default function ProjectDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['project-dashboard'],
    queryFn: () => projectApi.getDashboard(),
  });

  const stats = data?.data.data;
  const hasStatusData = (stats?.byStatus?.length ?? 0) > 0;
  const hasResourceData = hasResourceAllocationData(stats?.resourceAllocation);
  const hasProgressData = hasMonthlyProgressData(stats?.monthlyProgress);

  return (
    <PageContainer
      title="Project Analytics"
      subtitle="Real-time insights into project performance and resource utilization"
    >
      <Card
        sx={{
          mb: 3,
          background: 'linear-gradient(135deg, #0d3cb8 0%, #1e5eff 50%, #3b82f6 100%)',
          color: '#fff',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="overline" sx={{ opacity: 0.85, letterSpacing: 1.5 }}>
                Portfolio Health
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 1, color: '#fff' }}>
                {stats?.overallProgress ?? 0}% Overall Progress
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                {stats?.active ?? 0} active projects across {stats?.total ?? 0} total •{' '}
                {stats?.delayed ?? 0} delayed
              </Typography>
              <LinearProgress
                variant="determinate"
                value={stats?.overallProgress ?? 0}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: alpha('#fff', 0.2),
                  maxWidth: 480,
                  '& .MuiLinearProgress-bar': { borderRadius: 5, bgcolor: '#fff' },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: { md: 'flex-end' } }}>
                <Chip
                  label={`${stats?.manpowerUtilization ?? 0}% Manpower`}
                  sx={{ bgcolor: alpha('#fff', 0.15), color: '#fff', fontWeight: 600 }}
                />
                <Chip
                  label={`${stats?.vehicleAllocation ?? 0}% Vehicles`}
                  sx={{ bgcolor: alpha('#fff', 0.15), color: '#fff', fontWeight: 600 }}
                />
                <Chip
                  label={`${stats?.activeAssignments ?? 0} Assignments`}
                  sx={{ bgcolor: alpha('#fff', 0.15), color: '#fff', fontWeight: 600 }}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
        Key Metrics
      </Typography>
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
          <StatCard title="Total" value={stats?.total ?? 0} icon={<Work />} loading={isLoading} />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
          <StatCard title="Active" value={stats?.active ?? 0} icon={<Timeline />} color="#2563eb" loading={isLoading} />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
          <StatCard title="Delayed" value={stats?.delayed ?? 0} icon={<Warning />} color="#dc2626" loading={isLoading} />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
          <StatCard title="Completed" value={stats?.completed ?? 0} icon={<CheckCircle />} color="#1e5eff" loading={isLoading} />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
          <StatCard title="Proposal" value={stats?.proposalStage ?? 0} icon={<PendingActions />} loading={isLoading} />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
          <StatCard title="Pending Exec." value={stats?.pendingExecution ?? 0} icon={<TrendingUp />} color="#3b82f6" loading={isLoading} />
        </Grid>
      </Grid>

      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
        Analytics
      </Typography>
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard
            title="Status Distribution"
            subtitle="Projects by current status"
            loading={isLoading}
            height={300}
            empty={!hasStatusData}
            emptyContent={
              <ChartEmptyState
                variant="pie"
                height={300}
                message="No project status data"
                hint="Create projects to see status breakdown"
              />
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats?.byStatus || []}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                  label={(props) => {
                    const entry = props as { status?: string; count?: number };
                    return `${entry.status ?? ''}: ${entry.count ?? 0}`;
                  }}
                >
                  {(stats?.byStatus || []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard
            title="Resource Allocation"
            subtitle="Active assignments by type"
            loading={isLoading}
            height={300}
            empty={!hasResourceData}
            emptyContent={
              <ChartEmptyState
                variant="bar"
                height={300}
                message="No resource assignments yet"
                hint="Assign employees, vehicles, or equipment to projects from the project detail page"
              />
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.resourceAllocation || []} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,94,255,0.08)" vertical={false} />
                <XAxis
                  dataKey="resourceType"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => (v ? String(v).charAt(0).toUpperCase() + String(v).slice(1) : '')}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(30,94,255,0.04)' }} />
                <Bar dataKey="count" name="Assignments" fill="#1e5eff" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <ChartCard
            title="Monthly Progress Trend"
            subtitle="Average progress % over time"
            loading={isLoading}
            height={300}
            empty={!hasProgressData}
            emptyContent={
              <ChartEmptyState
                variant="line"
                height={300}
                message="No progress updates recorded"
                hint="Add weekly or monthly progress updates on project detail pages to track trends"
              />
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats?.monthlyProgress || []}>
                <defs>
                  <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e5eff" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#1e5eff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,94,255,0.08)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="avgProgress"
                  name="Progress %"
                  stroke="#1e5eff"
                  strokeWidth={2.5}
                  fill="url(#progressGrad)"
                />
                <Line
                  type="monotone"
                  dataKey="avgProgress"
                  stroke="#1e5eff"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#1e5eff', strokeWidth: 2, stroke: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartCard title="Utilization" subtitle="Workforce and fleet allocation" loading={isLoading} height={200}>
            <Grid container spacing={2} sx={{ height: '100%', alignItems: 'center' }}>
              <Grid size={6}>
                <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: alpha('#1e5eff', 0.06) }}>
                  <People sx={{ fontSize: 32, color: '#1e5eff', mb: 1 }} />
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {stats?.manpowerUtilization ?? 0}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Manpower
                  </Typography>
                </Box>
              </Grid>
              <Grid size={6}>
                <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: alpha('#2563eb', 0.06) }}>
                  <DirectionsCar sx={{ fontSize: 32, color: '#2563eb', mb: 1 }} />
                  <Typography variant="h4" fontWeight={700} sx={{ color: '#2563eb' }}>
                    {stats?.vehicleAllocation ?? 0}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Vehicles
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ChartCard title="Project Timeline" subtitle="Upcoming and active projects" loading={isLoading} height={200}>
            {(stats?.timeline?.length ?? 0) > 0 ? (
              <List dense disablePadding sx={{ maxHeight: 180, overflow: 'auto' }}>
                {(stats?.timeline || []).slice(0, 6).map((p: Project) => (
                  <ListItem key={p._id} divider sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" fontWeight={600} noWrap>
                            {p.name}
                          </Typography>
                          <StatusChip status={p.status} />
                        </Box>
                      }
                      secondary={`${p.code} • ${formatDate(p.startDate)} – ${formatDate(p.endDate)} • ${p.progressPercent}%`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <ChartEmptyState
                variant="bar"
                height={160}
                message="No projects in timeline"
                hint="Projects will appear here once created"
              />
            )}
          </ChartCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
