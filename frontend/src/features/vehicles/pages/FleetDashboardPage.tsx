import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Card, CardContent, Paper, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DirectionsCar, CheckCircle, Build, Speed, Edit, Delete, Undo } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { vehicleApi, authApi } from '../../../services';
import StatCard from '../../../components/common/StatCard';
import DataTable from '../../../components/common/DataTable';
import TableRowMenu from '../../../components/common/TableRowMenu';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import StatusChip from '../../../components/common/StatusChip';
import { FUEL_LEVELS, formatDate } from '../../../utils/constants';
import { Vehicle, VehicleAssignment } from '../../../types';

import PageContainer from '../../../components/layout/PageContainer';

const COLORS = ['#1e5eff', '#2563eb', '#3b82f6', '#60a5fa', '#0d3cb8', '#5b8cff'];
const BLUE = { primary: '#1e5eff', mid: '#2563eb', light: '#3b82f6', soft: '#60a5fa' };

export default function FleetDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['fleet-dashboard'],
    queryFn: () => vehicleApi.getDashboard(),
  });
  const stats = data?.data.data;

  return (
    <PageContainer title="Fleet Dashboard" subtitle="Monitor fleet utilization, status, and alerts">
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatCard title="Total" value={stats?.total ?? 0} icon={<DirectionsCar />} loading={isLoading} color={BLUE.primary} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatCard title="Available" value={stats?.available ?? 0} icon={<CheckCircle />} color={BLUE.mid} loading={isLoading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatCard title="Assigned" value={stats?.assigned ?? 0} color={BLUE.light} loading={isLoading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatCard title="Maintenance" value={stats?.underMaintenance ?? 0} icon={<Build />} color={BLUE.soft} loading={isLoading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatCard title="Utilization" value={`${stats?.utilization ?? 0}%`} icon={<Speed />} color={BLUE.primary} loading={isLoading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatCard title="Total KM" value={stats?.kmUsageSummary?.totalKm?.toLocaleString() ?? 0} color={BLUE.mid} loading={isLoading} />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2.5, height: 340, borderRadius: 3, border: '1px solid rgba(30, 94, 255, 0.08)' }}>
            <Typography variant="h6" gutterBottom>Status Breakdown</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie data={stats?.statusBreakdown || []} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={100}
                  label={(props) => `${(props as { status?: string }).status}: ${(props as { count?: number }).count}`}>
                  {(stats?.statusBreakdown || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Alerts</Typography>
              <Alert severity="info" sx={{ mb: 1, bgcolor: 'rgba(30, 94, 255, 0.08)', color: '#1e5eff' }}>
                Insurance expiring soon: {stats?.insuranceExpiringSoon ?? 0} vehicles
              </Alert>
              <Alert severity="info" sx={{ bgcolor: 'rgba(59, 130, 246, 0.08)', color: '#2563eb' }}>
                MVPI expiring soon: {stats?.mvpiExpiringSoon ?? 0} vehicles
              </Alert>
              <Box mt={2}>
                <Typography variant="subtitle2">KM Summary</Typography>
                <Typography variant="body2">Average: {Math.round(stats?.kmUsageSummary?.avgKm ?? 0).toLocaleString()} KM</Typography>
                <Typography variant="body2">Maximum: {stats?.kmUsageSummary?.maxKm?.toLocaleString() ?? 0} KM</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
}

export function AssignmentsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [assignOpen, setAssignOpen] = useState(false);
  const [editAssignment, setEditAssignment] = useState<VehicleAssignment | null>(null);
  const [returnId, setReturnId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { data, isLoading } = useQuery({
    queryKey: ['assignments', page, limit],
    queryFn: () => vehicleApi.getAssignments({ page, limit }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => vehicleApi.deleteAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['fleet-dashboard'] });
      enqueueSnackbar('Assignment deleted', { variant: 'success' });
      setDeleteId(null);
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      enqueueSnackbar(msg || 'Delete failed', { variant: 'error' });
    },
  });

  const columns = [
    { id: 'assignmentId', label: 'ID', minWidth: 130 },
    { id: 'vehicle', label: 'Vehicle', render: (row: VehicleAssignment) => row.vehicle?.vehicleName },
    { id: 'assignedTo', label: 'Assigned To', render: (row: VehicleAssignment) => `${row.assignedTo?.firstName} ${row.assignedTo?.lastName}` },
    { id: 'assignmentDate', label: 'Date', render: (row: VehicleAssignment) => formatDate(row.assignmentDate) },
    { id: 'startingKm', label: 'Start KM' },
    { id: 'status', label: 'Status', render: (row: VehicleAssignment) => <StatusChip status={row.status} /> },
    {
      id: 'actions',
      label: '',
      minWidth: 56,
      align: 'right' as const,
      render: (row: VehicleAssignment) => (
        <TableRowMenu
          actions={[
            {
              label: 'Edit',
              icon: <Edit fontSize="small" />,
              onClick: () => setEditAssignment(row),
            },
            ...(row.status === 'Active' || row.status === 'Overdue'
              ? [{
                  label: 'Return',
                  icon: <Undo fontSize="small" />,
                  onClick: () => setReturnId(row._id),
                }]
              : []),
            {
              label: 'Delete',
              icon: <Delete fontSize="small" />,
              onClick: () => setDeleteId(row._id),
              danger: true,
            },
          ]}
        />
      ),
    },
  ];

  return (
    <PageContainer
      title="Vehicle Assignments"
      action={<Button variant="contained" onClick={() => setAssignOpen(true)}>New Assignment</Button>}
    >
      <DataTable columns={columns} data={data?.data.data || []} pagination={data?.data.meta?.pagination}
        onPageChange={setPage} onRowsPerPageChange={(l) => { setLimit(l); setPage(1); }}
        loading={isLoading} getRowId={(row) => row._id} />

      <AssignmentFormDialog open={assignOpen} onClose={() => setAssignOpen(false)} />
      <AssignmentFormDialog
        open={!!editAssignment}
        assignment={editAssignment}
        onClose={() => setEditAssignment(null)}
      />
      {returnId && (
        <ReturnVehicleDialog
          assignmentId={returnId}
          onClose={() => {
            setReturnId(null);
            queryClient.invalidateQueries({ queryKey: ['assignments'] });
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
          }}
        />
      )}
      <ConfirmDialog
        open={!!deleteId}
        title="Delete Assignment"
        message="This will permanently remove the assignment record. If the vehicle is still active on this assignment, it will be marked available again."
        confirmLabel="Delete"
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
        loading={deleteMutation.isPending}
        danger
      />
    </PageContainer>
  );
}

function resourceId(value?: string | { _id: string }) {
  if (!value) return '';
  return typeof value === 'object' ? value._id : value;
}

function AssignmentFormDialog({
  open,
  onClose,
  assignment,
}: {
  open: boolean;
  onClose: () => void;
  assignment?: VehicleAssignment | null;
}) {
  const isEdit = !!assignment;
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    vehicle: '',
    assignedTo: '',
    startingKm: '',
    fuelLevel: 'Full',
    expectedReturnDate: '',
    notes: '',
  });

  useEffect(() => {
    if (!open) return;
    if (assignment) {
      setForm({
        vehicle: resourceId(assignment.vehicle),
        assignedTo: resourceId(assignment.assignedTo),
        startingKm: String(assignment.startingKm ?? ''),
        fuelLevel: assignment.fuelLevel || 'Full',
        expectedReturnDate: assignment.expectedReturnDate
          ? new Date(assignment.expectedReturnDate).toISOString().slice(0, 10)
          : '',
        notes: assignment.notes || '',
      });
    } else {
      setForm({ vehicle: '', assignedTo: '', startingKm: '', fuelLevel: 'Full', expectedReturnDate: '', notes: '' });
    }
  }, [open, assignment]);

  const { data: vehiclesAvailable } = useQuery({
    queryKey: ['vehicles-available'],
    queryFn: () => vehicleApi.getAll({ status: 'Available', limit: 100 }),
    enabled: open && !isEdit,
  });
  const { data: vehiclesAll } = useQuery({
    queryKey: ['vehicles-all-assign'],
    queryFn: () => vehicleApi.getAll({ limit: 100 }),
    enabled: open && isEdit,
  });
  const { data: users } = useQuery({ queryKey: ['users-assignable'], queryFn: () => authApi.getUsers(), enabled: open });

  const createMutation = useMutation({
    mutationFn: (fd: FormData) => vehicleApi.createAssignment(fd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['fleet-dashboard'] });
      enqueueSnackbar('Assignment created', { variant: 'success' });
      onClose();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      enqueueSnackbar(msg || 'Assignment failed', { variant: 'error' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      vehicleApi.updateAssignment(assignment!._id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['fleet-dashboard'] });
      enqueueSnackbar('Assignment updated', { variant: 'success' });
      onClose();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      enqueueSnackbar(msg || 'Update failed', { variant: 'error' });
    },
  });

  const handleSubmit = () => {
    if (isEdit) {
      if (assignment?.status === 'Returned') {
        updateMutation.mutate({ notes: form.notes });
        return;
      }
      updateMutation.mutate({
        vehicle: form.vehicle,
        assignedTo: form.assignedTo,
        startingKm: Number(form.startingKm),
        fuelLevel: form.fuelLevel,
        expectedReturnDate: form.expectedReturnDate || null,
        notes: form.notes,
      });
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
    const photoFields = ['frontPhoto', 'rearPhoto', 'leftSidePhoto', 'rightSidePhoto', 'interiorPhoto'];
    for (const field of photoFields) {
      const input = document.getElementById(`photo-${field}`) as HTMLInputElement;
      if (!input?.files?.[0]) {
        enqueueSnackbar(`Missing required photo: ${field}`, { variant: 'error' });
        return;
      }
      fd.append(field, input.files[0]);
    }
    createMutation.mutate(fd);
  };

  const assignableUsers = (users?.data.data || []).filter((u) =>
    ['engineer', 'technician', 'driver'].includes(u.role),
  );

  const vehicleOptions: Vehicle[] = isEdit
    ? (vehiclesAll?.data.data || [])
    : (vehiclesAvailable?.data.data || []);

  const isReturned = isEdit && assignment?.status === 'Returned';
  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Vehicle Assignment' : 'New Vehicle Assignment'}</DialogTitle>
      <DialogContent>
        {isReturned && (
          <Alert severity="info" sx={{ mt: 1, mb: 2 }}>
            This assignment is returned. Only notes can be edited.
          </Alert>
        )}
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              select
              label="Vehicle"
              value={form.vehicle}
              disabled={isReturned}
              onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
            >
              {vehicleOptions.map((v: Vehicle) => (
                <MenuItem key={v._id} value={v._id}>{v.vehicleName} ({v.registrationNumber})</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              select
              label="Assign To"
              value={form.assignedTo}
              disabled={isReturned}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
            >
              {assignableUsers.map((u) => (
                <MenuItem key={u._id} value={u._id}>{u.firstName} {u.lastName} ({u.role})</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              type="number"
              label="Starting KM"
              value={form.startingKm}
              disabled={isReturned}
              onChange={(e) => setForm({ ...form, startingKm: e.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              select
              label="Fuel Level"
              value={form.fuelLevel}
              disabled={isReturned}
              onChange={(e) => setForm({ ...form, fuelLevel: e.target.value })}
            >
              {FUEL_LEVELS.map((f) => <MenuItem key={f} value={f}>{f}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              type="date"
              label="Expected Return"
              InputLabelProps={{ shrink: true }}
              value={form.expectedReturnDate}
              disabled={isReturned}
              onChange={(e) => setForm({ ...form, expectedReturnDate: e.target.value })}
            />
          </Grid>
          {!isEdit &&
            ['frontPhoto', 'rearPhoto', 'leftSidePhoto', 'rightSidePhoto', 'interiorPhoto'].map((field) => (
              <Grid size={{ xs: 12, sm: 6 }} key={field}>
                <TextField
                  fullWidth
                  type="file"
                  id={`photo-${field}`}
                  label={field.replace(/([A-Z])/g, ' $1')}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ accept: 'image/*' }}
                />
              </Grid>
            ))}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isPending}>
          {isEdit ? 'Save Changes' : 'Assign'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ReturnVehicleDialog({ assignmentId, onClose }: { assignmentId: string; onClose: () => void }) {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({ finalKm: '', fuelLevel: 'Full', vehicleCondition: 'Good', remarks: '' });

  const mutation = useMutation({
    mutationFn: (fd: FormData) => vehicleApi.returnVehicle(assignmentId, fd),
    onSuccess: () => { enqueueSnackbar('Vehicle returned', { variant: 'success' }); onClose(); },
    onError: () => enqueueSnackbar('Return failed', { variant: 'error' }),
  });

  const handleSubmit = () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    mutation.mutate(fd);
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Return Vehicle</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth type="number" label="Final KM" value={form.finalKm} onChange={(e) => setForm({ ...form, finalKm: e.target.value })} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth select label="Fuel Level" value={form.fuelLevel} onChange={(e) => setForm({ ...form, fuelLevel: e.target.value })}>
              {FUEL_LEVELS.map((f) => <MenuItem key={f} value={f}>{f}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField fullWidth select label="Condition" value={form.vehicleCondition} onChange={(e) => setForm({ ...form, vehicleCondition: e.target.value })}>
              {['Excellent', 'Good', 'Fair', 'Poor', 'Damaged'].map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField fullWidth multiline rows={2} label="Remarks" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField fullWidth type="file" id="return-photos" label="Return Photos" InputLabelProps={{ shrink: true }} inputProps={{ accept: 'image/*', multiple: true }} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={mutation.isPending}>Confirm Return</Button>
      </DialogActions>
    </Dialog>
  );
}
