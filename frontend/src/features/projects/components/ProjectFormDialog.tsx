import { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { projectApi, authApi } from '../../../services';
import { PROJECT_STATUSES } from '../../../utils/constants';
import { Project } from '../../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  project?: Project | null;
}

interface FormData {
  name: string;
  code: string;
  client: string;
  contractNumber: string;
  contractValue: number;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  budget: number;
  sla: string;
  status: string;
  projectManager: string;
  remarks: string;
}

export default function ProjectFormDialog({ open, onClose, project }: Props) {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const isEdit = !!project;

  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => authApi.getUsers(),
    enabled: open,
  });

  const managers = (usersData?.data.data || []).filter((u) =>
    ['super_admin', 'admin', 'manager', 'engineer'].includes(u.role),
  );

  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      name: '',
      code: '',
      client: '',
      contractNumber: '',
      contractValue: 0,
      description: '',
      location: '',
      startDate: '',
      endDate: '',
      budget: 0,
      sla: '',
      status: 'Proposal Stage',
      projectManager: '',
      remarks: '',
    },
  });

  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        code: project.code,
        client: project.client || '',
        contractNumber: project.contractNumber || '',
        contractValue: project.contractValue || 0,
        description: project.description || '',
        location: project.location || '',
        startDate: project.startDate?.slice(0, 10) || '',
        endDate: project.endDate?.slice(0, 10) || '',
        budget: project.budget || 0,
        sla: project.sla || '',
        status: project.status,
        projectManager: project.projectManager?._id || '',
        remarks: project.remarks || '',
      });
    } else {
      reset({
        name: '',
        code: '',
        client: '',
        contractNumber: '',
        contractValue: 0,
        description: '',
        location: '',
        startDate: '',
        endDate: '',
        budget: 0,
        sla: '',
        status: 'Proposal Stage',
        projectManager: '',
        remarks: '',
      });
    }
  }, [project, reset, open]);

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      isEdit
        ? projectApi.update(project!._id, data as unknown as Partial<Project>)
        : projectApi.create(data as unknown as Partial<Project>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      enqueueSnackbar(isEdit ? 'Project updated' : 'Project created', { variant: 'success' });
      onClose();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Save failed';
      enqueueSnackbar(msg, { variant: 'error' });
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Project' : 'New Project'}</DialogTitle>
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="name" control={control} rules={{ required: true }}
                render={({ field }) => <TextField {...field} fullWidth label="Project Name" required />} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="code" control={control}
                render={({ field }) => <TextField {...field} fullWidth label="Project ID / Code" disabled={isEdit} />} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="client" control={control}
                render={({ field }) => <TextField {...field} fullWidth label="Client" />} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="contractNumber" control={control}
                render={({ field }) => <TextField {...field} fullWidth label="Contract Number" />} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="contractValue" control={control}
                render={({ field }) => <TextField {...field} fullWidth type="number" label="Contract Value" />} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="budget" control={control}
                render={({ field }) => <TextField {...field} fullWidth type="number" label="Budget" />} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="location" control={control}
                render={({ field }) => <TextField {...field} fullWidth label="Location" />} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="sla" control={control}
                render={({ field }) => <TextField {...field} fullWidth label="SLA" />} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="startDate" control={control}
                render={({ field }) => <TextField {...field} fullWidth type="date" label="Start Date" InputLabelProps={{ shrink: true }} />} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="endDate" control={control}
                render={({ field }) => <TextField {...field} fullWidth type="date" label="End Date" InputLabelProps={{ shrink: true }} />} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="status" control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth select label="Status">
                    {PROJECT_STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </TextField>
                )} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="projectManager" control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth select label="Project Manager">
                    <MenuItem value="">None</MenuItem>
                    {managers.map((u) => (
                      <MenuItem key={u._id} value={u._id}>{u.firstName} {u.lastName}</MenuItem>
                    ))}
                  </TextField>
                )} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller name="description" control={control}
                render={({ field }) => <TextField {...field} fullWidth multiline rows={2} label="Description" />} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller name="remarks" control={control}
                render={({ field }) => <TextField {...field} fullWidth label="Remarks" />} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={mutation.isPending}>
            {mutation.isPending ? <CircularProgress size={22} /> : isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
