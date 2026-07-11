import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
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
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import {
  Work,
  People,
  DirectionsCar,
  CardMembership,
  Warning,
  Assessment,
  TrendingUp,
  PendingActions,
  CheckCircle,
} from '@mui/icons-material';
import { executiveApi } from '../../../services';
import StatCard from '../../../components/common/StatCard';
import ChartCard from '../../../components/common/ChartCard';
import ChartEmptyState from '../../../components/common/ChartEmptyState';
import PageContainer from '../../../components/layout/PageContainer';
import { formatCurrency } from '../../../utils/constants';

const COLORS = ['#1e5eff', '#2563eb', '#3b82f6', '#60a5fa', '#0d3cb8', '#93c5fd'];

const ChartTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string; color?: string }[];
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
      {label && (
        <Typography variant="caption" fontWeight={600} display="block" mb={0.5}>
          {label}
        </Typography>
      )}
      {payload.map((p, i) => (
        <Typography key={i} variant="body2" sx={{ color: p.color || 'primary.main' }}>
          {p.name}: {typeof p.value === 'number' && p.name?.includes('$') ? formatCurrency(p.value) : p.value}
        </Typography>
      ))}
    </Box>
  );
};

function hasData<T>(arr?: T[]): boolean {
  return !!arr?.length;
}

function hasCountData(arr?: { count?: number; label?: string }[]): boolean {
  return !!arr?.length && arr.some((d) => (d.count ?? 0) > 0);
}

export default function ExecutiveDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['executive-dashboard'],
    queryFn: () => executiveApi.getDashboard(),
  });

  const d = data?.data.data;

  const projectProgress = d?.projects.overallProgress ?? 0;

  return (
    <PageContainer
      title="Executive Dashboard"
      subtitle="Unified view of projects, fleet, certificates, and financial health"
    >
      {/* Hero summary */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #1e5eff 100%)',
          color: '#fff',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, lg: 7 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Assessment sx={{ fontSize: 22, opacity: 0.9 }} />
                <Typography variant="overline" sx={{ letterSpacing: 1.5, opacity: 0.9 }}>
                  Operations Overview
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 1, color: '#fff' }}>
                {d?.projects.total ?? 0} Projects · {d?.employees.total ?? 0} Employees ·{' '}
                {d?.vehicles.total ?? 0} Vehicles
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85, mb: 2 }}>
                {d?.projects.active ?? 0} active · {d?.projects.delayed ?? 0} delayed ·{' '}
                {d?.certificates.expiringSoon ?? 0} certificates expiring soon
              </Typography>
              <Box sx={{ maxWidth: 420 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ opacity: 0.85 }}>
                    Portfolio progress
                  </Typography>
                  <Typography variant="caption" fontWeight={700}>
                    {projectProgress}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={projectProgress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: alpha('#fff', 0.2),
                    '& .MuiLinearProgress-bar': { borderRadius: 4, bgcolor: '#fff' },
                  }}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Grid container spacing={1.5} sx={{ color: '#fff' }}>
                {[
                  { label: 'Open RFIs', value: d?.openRFIs ?? 0 },
                  { label: 'Open NCRs', value: d?.openNCRs ?? 0 },
                  { label: 'Pending Approvals', value: d?.pendingApprovals ?? 0 },
                  {
                    label: 'Outstanding',
                    value: formatCurrency(d?.outstandingPayments),
                  },
                ].map((item) => (
                  <Grid key={item.label} size={6}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: alpha('#fff', 0.1),
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: '#fff',
                      }}
                    >
                      <Typography variant="body2" fontWeight={500} sx={{ opacity: 0.8, color: '#fff' }}>
                        {item.label}
                      </Typography>
                      <Typography variant="h6" fontWeight={700} sx={{ color: '#fff' }}>
                        {item.value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
        Projects
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { title: 'Total', value: d?.projects.total ?? 0, icon: <Work /> },
          { title: 'Active', value: d?.projects.active ?? 0, icon: <TrendingUp />, color: '#2563eb' },
          { title: 'Completed', value: d?.projects.completed ?? 0, icon: <CheckCircle />, color: '#1e5eff' },
          { title: 'Delayed', value: d?.projects.delayed ?? 0, icon: <Warning />, color: '#dc2626' },
          { title: 'Proposal', value: d?.projects.proposal ?? 0, icon: <PendingActions /> },
          { title: 'Progress', value: `${projectProgress}%` },
        ].map((s) => (
          <Grid key={s.title} size={{ xs: 6, sm: 4, md: 2 }}>
            <StatCard
              title={s.title}
              value={s.value}
              icon={s.icon}
              color={s.color}
              loading={isLoading}
            />
          </Grid>
        ))}
      </Grid>

      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
        Resources & Compliance
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { title: 'Employees', value: d?.employees.total ?? 0, icon: <People /> },
          { title: 'Vehicles', value: d?.vehicles.total ?? 0, icon: <DirectionsCar /> },
          { title: 'Assigned', value: d?.vehicles.assigned ?? 0 },
          { title: 'Available', value: d?.vehicles.available ?? 0 },
          {
            title: 'Fleet Util.',
            value: `${d?.vehicles.utilization ?? 0}%`,
            color: '#2563eb',
          },
          {
            title: 'Certs Expiring',
            value: d?.certificates.expiringSoon ?? 0,
            icon: <CardMembership />,
            color: '#d97706',
          },
          { title: 'Expired Certs', value: d?.certificates.expired ?? 0, color: '#dc2626' },
        ].map((s) => (
          <Grid key={s.title} size={{ xs: 6, sm: 4, lg: 3 }}>
            <StatCard title={s.title} value={s.value} icon={s.icon} color={s.color} loading={isLoading} />
          </Grid>
        ))}
      </Grid>

      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
        Analytics
      </Typography>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard
            title="Project Status"
            subtitle="Distribution across lifecycle stages"
            loading={isLoading}
            height={300}
            empty={!hasCountData(d?.charts.projectStatusDistribution)}
            emptyContent={
              <ChartEmptyState
                variant="pie"
                height={300}
                message="No project data"
                hint="Projects will appear once created in the system"
              />
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={d?.charts.projectStatusDistribution || []}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  label={(props) => {
                    const e = props as { status?: string; count?: number };
                    return `${e.status ?? ''}: ${e.count ?? 0}`;
                  }}
                >
                  {(d?.charts.projectStatusDistribution || []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard
            title="Certificate Expiry"
            subtitle="Compliance snapshot"
            loading={isLoading}
            height={300}
            empty={!hasCountData(d?.charts.certificateExpiry)}
            emptyContent={
              <ChartEmptyState
                variant="bar"
                height={300}
                message="No certificate data"
                hint="Add certificates to monitor expiry status"
              />
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={d?.charts.certificateExpiry || []} barSize={48}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,94,255,0.08)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="Certificates" fill="#1e5eff" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard
            title="Monthly Project Progress"
            subtitle="Average progress trend"
            loading={isLoading}
            height={300}
            empty={!hasData(d?.charts.monthlyProjectProgress)}
            emptyContent={
              <ChartEmptyState
                variant="line"
                height={300}
                message="No progress history"
                hint="Progress trends appear after project updates are logged"
              />
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={d?.charts.monthlyProjectProgress || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,94,255,0.08)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="progress"
                  name="Progress %"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard
            title="Cost vs Budget"
            subtitle="Financial variance by project"
            loading={isLoading}
            height={300}
            empty={!hasData(d?.charts.costVsBudget)}
            emptyContent={
              <ChartEmptyState
                variant="bar"
                height={300}
                message="No financial data"
                hint="Set project budgets and actual costs to compare variance"
              />
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={d?.charts.costVsBudget || []} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,94,255,0.08)" vertical={false} />
                <XAxis dataKey="code" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="budget" name="Budget" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actualCost" name="Actual" fill="#1e5eff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ChartCard
            title="Manpower Allocation"
            subtitle="Active assignments by role"
            loading={isLoading}
            height={260}
            empty={!hasCountData(d?.charts.manpowerAllocation?.map((m) => ({ count: m.count })))}
            emptyContent={
              <ChartEmptyState
                variant="bar"
                height={260}
                message="No manpower assigned"
                hint="Assign team members to projects to see allocation"
              />
            }
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={d?.charts.manpowerAllocation || []} layout="vertical" barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,94,255,0.08)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="role" width={90} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="Assigned" fill="#3b82f6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ChartCard
            title="Vehicle Utilization"
            subtitle="Fleet status breakdown"
            loading={isLoading}
            height={260}
            empty={!hasCountData(d?.charts.vehicleUtilization)}
            emptyContent={
              <ChartEmptyState
                variant="pie"
                height={260}
                message="No vehicle data"
                hint="Add vehicles to the fleet to track utilization"
              />
            }
          >
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={d?.charts.vehicleUtilization || []}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  label={(props) => {
                    const e = props as { status?: string; count?: number };
                    return `${e.status ?? ''}: ${e.count ?? 0}`;
                  }}
                >
                  {(d?.charts.vehicleUtilization || []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
