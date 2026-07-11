import { useState } from 'react';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { vehicleApi } from '../../../services';
import DataTable from '../../../components/common/DataTable';
import { MAINTENANCE_TYPES, formatDate } from '../../../utils/constants';
import { ApiResponse, VehicleMaintenance } from '../../../types';
import PageContainer from '../../../components/layout/PageContainer';

export default function MaintenancePage() {
  const [page, setPage] = useState(1);
  const [vehicleId, setVehicleId] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { data: vehicles } = useQuery({
    queryKey: ['vehicles-all'],
    queryFn: () => vehicleApi.getAll({ limit: 100 }),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['maintenance', vehicleId, page],
    queryFn: () => vehicleApi.getMaintenanceHistory(vehicleId, { page, limit: 10 }),
    enabled: !!vehicleId,
  });

  const [form, setForm] = useState({
    vehicle: '', maintenanceType: '', description: '', cost: '', scheduledDate: '', completedDate: '', nextDueDate: '', notes: '',
  });

  const mutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => vehicleApi.createMaintenance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      enqueueSnackbar('Maintenance record created', { variant: 'success' });
      setFormOpen(false);
    },
    onError: () => enqueueSnackbar('Failed to create record', { variant: 'error' }),
  });

  const columns = [
    { id: 'maintenanceType', label: 'Type' },
    { id: 'description', label: 'Description' },
    { id: 'cost', label: 'Cost', render: (row: VehicleMaintenance) => `$${row.cost?.toLocaleString()}` },
    { id: 'scheduledDate', label: 'Scheduled', render: (row: VehicleMaintenance) => formatDate(row.scheduledDate) },
    { id: 'completedDate', label: 'Completed', render: (row: VehicleMaintenance) => formatDate(row.completedDate) },
    { id: 'nextDueDate', label: 'Next Due', render: (row: VehicleMaintenance) => formatDate(row.nextDueDate) },
  ];

  return (
    <PageContainer
      title="Vehicle Maintenance"
      action={<Button variant="contained" onClick={() => setFormOpen(true)}>Add Record</Button>}
    >
      <Box sx={{ mb: 3 }}>
        <TextField select label="Select Vehicle" value={vehicleId} onChange={(e) => { setVehicleId(e.target.value); setPage(1); }} sx={{ minWidth: 300 }}>
          <MenuItem value="">Select a vehicle</MenuItem>
          {(vehicles?.data.data || []).map((v) => (
            <MenuItem key={v._id} value={v._id}>{v.vehicleName} ({v.registrationNumber})</MenuItem>
          ))}
        </TextField>
      </Box>

      {vehicleId ? (
        <DataTable
          columns={columns}
          data={((data?.data as ApiResponse<VehicleMaintenance[]>)?.data) || []}
          pagination={(data?.data as ApiResponse<VehicleMaintenance[]>)?.meta?.pagination}
          onPageChange={setPage}
          onRowsPerPageChange={() => {}}
          loading={isLoading}
          getRowId={(row) => row._id}
        />
      ) : (
        <Typography color="text.secondary">Select a vehicle to view maintenance history</Typography>
      )}

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Maintenance Record</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth select label="Vehicle" value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })}>
                {(vehicles?.data.data || []).map((v) => (
                  <MenuItem key={v._id} value={v._id}>{v.vehicleName}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth select label="Type" value={form.maintenanceType} onChange={(e) => setForm({ ...form, maintenanceType: e.target.value })}>
                {MAINTENANCE_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth type="number" label="Cost" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth type="date" label="Next Due Date" InputLabelProps={{ shrink: true }}
                value={form.nextDueDate} onChange={(e) => setForm({ ...form, nextDueDate: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => mutation.mutate({ ...form, cost: parseFloat(form.cost) || 0 })}>Save</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}
