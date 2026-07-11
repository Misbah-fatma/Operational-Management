import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid2,
  Typography,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  Download,
  Edit,
  Description,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { certificateApi, downloadBlob } from '../../../services';
import { getUploadUrl } from '../../../services/api';
import PageContainer from '../../../components/layout/PageContainer';
import StatusChip from '../../../components/common/StatusChip';
import CertificateFormDialog from '../components/CertificateFormDialog';
import { formatDate } from '../../../utils/constants';
import { Certificate } from '../../../types';

function DetailField({ label, value }: { label: string; value?: string | null }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 600, mb: 0.25 }}>
        {label}
      </Typography>
      <Typography variant="body1">{value || '—'}</Typography>
    </Box>
  );
}

export default function CertificateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [editOpen, setEditOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['certificate', id],
    queryFn: () => certificateApi.getById(id!),
    enabled: !!id,
  });

  const cert = data?.data.data as Certificate | undefined;

  const handleDownload = async () => {
    if (!cert?.certificateFile) return;
    try {
      const res = await certificateApi.download(cert._id);
      downloadBlob(res.data as Blob, cert.certificateFile.originalName);
    } catch {
      enqueueSnackbar('Download failed', { variant: 'error' });
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !cert) {
    return (
      <PageContainer title="Certificate Not Found">
        <Alert severity="error" sx={{ mb: 2 }}>
          Unable to load certificate details.
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/certificates')}>
          Back to Certificates
        </Button>
      </PageContainer>
    );
  }

  const fileUrl = cert.certificateFile ? getUploadUrl(cert.certificateFile.url) : '';
  const isPdf =
    cert.certificateFile?.mimetype === 'application/pdf' ||
    cert.certificateFile?.originalName?.toLowerCase().endsWith('.pdf');
  const isImage =
    cert.certificateFile?.mimetype?.startsWith('image/') ||
    /\.(jpg|jpeg|png|webp|gif)$/i.test(cert.certificateFile?.originalName || '');

  return (
    <PageContainer
      title={cert.certificateName}
      subtitle={cert.certificateId}
      action={
        <>
          <Button startIcon={<ArrowBack />} variant="outlined" onClick={() => navigate('/certificates')}>
            Back
          </Button>
          {cert.certificateFile && (
            <Button startIcon={<Download />} variant="outlined" onClick={handleDownload}>
              Download File
            </Button>
          )}
          <Button startIcon={<Edit />} variant="contained" onClick={() => setEditOpen(true)}>
            Edit
          </Button>
        </>
      }
    >
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, lg: cert.certificateFile ? 6 : 12 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                  Certificate Details
                </Typography>
                <StatusChip status={cert.status} />
              </Box>

              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <DetailField label="Certificate Number" value={cert.certificateNumber} />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <DetailField label="Category" value={cert.category} />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <DetailField label="Issue Date" value={formatDate(cert.issueDate)} />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <DetailField label="Expiry Date" value={formatDate(cert.expiryDate)} />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <DetailField label="Renewal Date" value={formatDate(cert.renewalDate)} />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <DetailField label="Issuing Authority" value={cert.issuingAuthority} />
                </Grid2>
              </Grid2>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 1.5 }}>
                Related Records
              </Typography>
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <DetailField
                    label="Employee"
                    value={
                      cert.relatedEmployee
                        ? `${cert.relatedEmployee.firstName} ${cert.relatedEmployee.lastName}`
                        : undefined
                    }
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <DetailField
                    label="Equipment"
                    value={cert.relatedEquipment ? `${cert.relatedEquipment.name} (${cert.relatedEquipment.equipmentId})` : undefined}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <DetailField
                    label="Vehicle"
                    value={
                      cert.relatedVehicle
                        ? `${cert.relatedVehicle.vehicleName} (${cert.relatedVehicle.registrationNumber})`
                        : undefined
                    }
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <DetailField
                    label="Project"
                    value={cert.relatedProject ? `${cert.relatedProject.name} (${cert.relatedProject.code})` : undefined}
                  />
                </Grid2>
              </Grid2>

              {cert.remarks && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <DetailField label="Remarks" value={cert.remarks} />
                </>
              )}

              <Divider sx={{ my: 2 }} />
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <DetailField
                    label="Created By"
                    value={
                      cert.createdBy
                        ? `${cert.createdBy.firstName} ${cert.createdBy.lastName}`
                        : undefined
                    }
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <DetailField label="Created At" value={formatDate(cert.createdAt)} />
                </Grid2>
              </Grid2>
            </CardContent>
          </Card>
        </Grid2>

        {cert.certificateFile && (
          <Grid2 size={{ xs: 12, lg: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  {isPdf ? <Description color="primary" /> : <ImageIcon color="primary" />}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Uploaded Certificate
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap title={cert.certificateFile.originalName}>
                      {cert.certificateFile.originalName}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    minHeight: 400,
                    borderRadius: 2,
                    border: '1px solid rgba(30, 94, 255, 0.12)',
                    bgcolor: '#f8fafc',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isPdf ? (
                    <Box
                      component="iframe"
                      src={fileUrl}
                      title={cert.certificateFile.originalName}
                      sx={{ width: '100%', height: '100%', minHeight: 480, border: 'none' }}
                    />
                  ) : isImage ? (
                    <Box
                      component="img"
                      src={fileUrl}
                      alt={cert.certificateFile.originalName}
                      sx={{ maxWidth: '100%', maxHeight: 520, objectFit: 'contain', p: 2 }}
                    />
                  ) : (
                    <Box sx={{ textAlign: 'center', p: 4 }}>
                      <Description sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                      <Typography color="text.secondary" gutterBottom>
                        Preview not available for this file type
                      </Typography>
                      <Button variant="contained" startIcon={<Download />} onClick={handleDownload}>
                        Download File
                      </Button>
                    </Box>
                  )}
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleDownload}
                  sx={{ mt: 2 }}
                >
                  Download {cert.certificateFile.originalName}
                </Button>
              </CardContent>
            </Card>
          </Grid2>
        )}

        {!cert.certificateFile && (
          <Grid2 size={{ xs: 12 }}>
            <Alert severity="info">No certificate file was uploaded for this record.</Alert>
          </Grid2>
        )}
      </Grid2>

      <CertificateFormDialog
        open={editOpen}
        certificate={cert}
        onClose={() => {
          setEditOpen(false);
          refetch();
        }}
      />
    </PageContainer>
  );
}
