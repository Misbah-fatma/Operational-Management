import { useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { vehicleApi } from '../../../services';
import { Vehicle } from '../../../types';
import { FUEL_TYPES } from '../../../utils/constants';

const schema = yup.object({
  vehicleName: yup.string().required('Required'),
  registrationNumber: yup.string().required('Required'),
  make: yup.string().required('Required'),
  model: yup.string().required('Required'),
  year: yup.number().required('Required').min(1900).max(2100),
  fuelType: yup.string().required('Required'),
  currentKm: yup.number().optional(),
  vin: yup.string().optional(),
  insuranceNumber: yup.string().optional(),
  insuranceExpiryDate: yup.string().optional(),
  mvpiExpiryDate: yup.string().optional(),
  remarks: yup.string().optional(),
});

interface Props {
  open: boolean;
  vehicle: Vehicle | null;
  onClose: () => void;
}

export default function VehicleFormDialog({ open, vehicle, onClose }: Props) {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const isEdit = !!vehicle;

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (vehicle) {
      reset({
        vehicleName: vehicle.vehicleName,
        registrationNumber: vehicle.registrationNumber,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        fuelType: vehicle.fuelType,
        currentKm: vehicle.currentKm,
        vin: vehicle.vin || '',
        insuranceNumber: vehicle.insuranceNumber || '',
        insuranceExpiryDate: vehicle.insuranceExpiryDate?.split('T')[0] || '',
        mvpiExpiryDate: vehicle.mvpiExpiryDate?.split('T')[0] || '',
        remarks: vehicle.remarks || '',
      });
    } else {
      reset({
        vehicleName: '', registrationNumber: '', make: '', model: '',
        year: new Date().getFullYear(), fuelType: 'Diesel', currentKm: 0,
        vin: '', insuranceNumber: '', insuranceExpiryDate: '', mvpiExpiryDate: '', remarks: '',
      });
    }
  }, [vehicle, reset, open]);

  const mutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      isEdit ? vehicleApi.update(vehicle!._id, data) : vehicleApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['fleet-dashboard'] });
      enqueueSnackbar(isEdit ? 'Vehicle updated' : 'Vehicle created', { variant: 'success' });
      onClose();
    },
    onError: () => enqueueSnackbar('Operation failed', { variant: 'error' }),
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Vehicle' : 'Add Vehicle'}</DialogTitle>
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="vehicleName" control={control} render={({ field }) => (
                <TextField {...field} fullWidth label="Vehicle Name" error={!!errors.vehicleName} />
              )} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="registrationNumber" control={control} render={({ field }) => (
                <TextField {...field} fullWidth label="Registration Number" error={!!errors.registrationNumber} />
              )} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller name="make" control={control} render={({ field }) => (
                <TextField {...field} fullWidth label="Make" />
              )} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller name="model" control={control} render={({ field }) => (
                <TextField {...field} fullWidth label="Model" />
              )} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller name="year" control={control} render={({ field }) => (
                <TextField {...field} fullWidth type="number" label="Year" onChange={(e) => field.onChange(parseInt(e.target.value))} />
              )} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller name="fuelType" control={control} render={({ field }) => (
                <TextField {...field} fullWidth select label="Fuel Type">
                  {FUEL_TYPES.map((f) => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                </TextField>
              )} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller name="currentKm" control={control} render={({ field }) => (
                <TextField {...field} fullWidth type="number" label="Current KM" />
              )} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller name="vin" control={control} render={({ field }) => (
                <TextField {...field} fullWidth label="VIN" />
              )} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller name="insuranceNumber" control={control} render={({ field }) => (
                <TextField {...field} fullWidth label="Insurance Number" />
              )} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller name="insuranceExpiryDate" control={control} render={({ field }) => (
                <TextField {...field} fullWidth type="date" label="Insurance Expiry" InputLabelProps={{ shrink: true }} />
              )} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller name="mvpiExpiryDate" control={control} render={({ field }) => (
                <TextField {...field} fullWidth type="date" label="MVPI Expiry" InputLabelProps={{ shrink: true }} />
              )} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller name="remarks" control={control} render={({ field }) => (
                <TextField {...field} fullWidth multiline rows={2} label="Remarks" />
              )} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={mutation.isPending}>
            {mutation.isPending ? <CircularProgress size={24} /> : isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
