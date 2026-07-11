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
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { certificateApi, authApi } from '../../../services';
import { Certificate } from '../../../types';
import { CERTIFICATE_CATEGORIES } from '../../../utils/constants';

const schema = yup.object({
  certificateNumber: yup.string().required('Required'),
  certificateName: yup.string().required('Required'),
  category: yup.string().required('Required'),
  issueDate: yup.string().required('Required'),
  expiryDate: yup.string().required('Required'),
  issuingAuthority: yup.string().required('Required'),
  renewalDate: yup.string().optional(),
  remarks: yup.string().optional(),
  relatedEmployee: yup.string().optional(),
});

interface Props {
  open: boolean;
  certificate: Certificate | null;
  onClose: () => void;
}

export default function CertificateFormDialog({ open, certificate, onClose }: Props) {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const isEdit = !!certificate;

  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => authApi.getUsers(),
    enabled: open,
  });

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      certificateNumber: '',
      certificateName: '',
      category: '',
      issueDate: '',
      expiryDate: '',
      issuingAuthority: '',
      renewalDate: '',
      remarks: '',
      relatedEmployee: '',
    },
  });

  useEffect(() => {
    if (certificate) {
      reset({
        certificateNumber: certificate.certificateNumber,
        certificateName: certificate.certificateName,
        category: certificate.category,
        issueDate: certificate.issueDate?.split('T')[0],
        expiryDate: certificate.expiryDate?.split('T')[0],
        issuingAuthority: certificate.issuingAuthority,
        renewalDate: certificate.renewalDate?.split('T')[0] || '',
        remarks: certificate.remarks || '',
        relatedEmployee: certificate.relatedEmployee?._id || '',
      });
    } else {
      reset({
        certificateNumber: '',
        certificateName: '',
        category: '',
        issueDate: '',
        expiryDate: '',
        issuingAuthority: '',
        renewalDate: '',
        remarks: '',
        relatedEmployee: '',
      });
    }
  }, [certificate, reset, open]);

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (isEdit) return certificateApi.update(certificate!._id, formData);
      return certificateApi.create(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      queryClient.invalidateQueries({ queryKey: ['cert-dashboard'] });
      enqueueSnackbar(isEdit ? 'Certificate updated' : 'Certificate created', { variant: 'success' });
      onClose();
    },
    onError: () => enqueueSnackbar('Operation failed', { variant: 'error' }),
  });

  const onSubmit = (data: Record<string, string>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    const fileInput = document.getElementById('cert-file-input') as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      formData.append('certificateFile', fileInput.files[0]);
    }
    mutation.mutate(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Certificate' : 'Add Certificate'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="certificateNumber" control={control} render={({ field }) => (
                <TextField {...field} fullWidth label="Certificate Number" error={!!errors.certificateNumber} helperText={errors.certificateNumber?.message} />
              )} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="certificateName" control={control} render={({ field }) => (
                <TextField {...field} fullWidth label="Certificate Name" error={!!errors.certificateName} helperText={errors.certificateName?.message} />
              )} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="category" control={control} render={({ field }) => (
                <TextField {...field} fullWidth select label="Category" error={!!errors.category}>
                  {CERTIFICATE_CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
              )} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="issuingAuthority" control={control} render={({ field }) => (
                <TextField {...field} fullWidth label="Issuing Authority" error={!!errors.issuingAuthority} />
              )} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller name="issueDate" control={control} render={({ field }) => (
                <TextField {...field} fullWidth type="date" label="Issue Date" InputLabelProps={{ shrink: true }} />
              )} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller name="expiryDate" control={control} render={({ field }) => (
                <TextField {...field} fullWidth type="date" label="Expiry Date" InputLabelProps={{ shrink: true }} />
              )} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller name="renewalDate" control={control} render={({ field }) => (
                <TextField {...field} fullWidth type="date" label="Renewal Date" InputLabelProps={{ shrink: true }} />
              )} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="relatedEmployee" control={control} render={({ field }) => (
                <TextField {...field} fullWidth select label="Related Employee">
                  <MenuItem value="">None</MenuItem>
                  {(usersData?.data.data || []).map((u) => (
                    <MenuItem key={u._id} value={u._id}>{u.firstName} {u.lastName}</MenuItem>
                  ))}
                </TextField>
              )} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth type="file" id="cert-file-input" label="Certificate File" InputLabelProps={{ shrink: true }} inputProps={{ accept: '.pdf,.jpg,.jpeg,.png' }} />
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
