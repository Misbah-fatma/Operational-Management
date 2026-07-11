import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Download,
  FileDownload,
  PictureAsPdf,
  Visibility,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { certificateApi, downloadBlob } from '../../../services';
import DataTable from '../../../components/common/DataTable';
import StatusChip from '../../../components/common/StatusChip';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { FilterBar, FilterSelect, SearchField } from '../../../components/common/FilterBar';
import { CERTIFICATE_CATEGORIES, CERTIFICATE_STATUSES, formatDate } from '../../../utils/constants';
import { Certificate } from '../../../types';
import CertificateFormDialog from '../components/CertificateFormDialog';
import PageContainer from '../../../components/layout/PageContainer';

export default function CertificatesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editCert, setEditCert] = useState<Certificate | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['certificates', page, limit, search, category, status],
    queryFn: () =>
      certificateApi.getAll({
        page,
        limit,
        search: search || undefined,
        category: category || undefined,
        status: status || undefined,
        sortBy: 'expiryDate',
        sortOrder: 'asc',
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => certificateApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      enqueueSnackbar('Certificate deleted', { variant: 'success' });
      setDeleteId(null);
    },
    onError: () => enqueueSnackbar('Delete failed', { variant: 'error' }),
  });

  const handleDownload = async (id: string, name: string) => {
    try {
      const res = await certificateApi.download(id);
      downloadBlob(res.data as Blob, name);
    } catch {
      enqueueSnackbar('Download failed', { variant: 'error' });
    }
  };

  const handleExportExcel = async () => {
    const res = await certificateApi.exportExcel({ category, status, search });
    downloadBlob(res.data as Blob, 'certificates.xlsx');
  };

  const handleExportPdf = async () => {
    const res = await certificateApi.exportPdf({ category, status, search });
    downloadBlob(res.data as Blob, 'certificates.pdf');
  };

  const columns = [
    { id: 'certificateId', label: 'ID', minWidth: 130 },
    { id: 'certificateName', label: 'Name', minWidth: 180 },
    { id: 'category', label: 'Category', minWidth: 100 },
    {
      id: 'expiryDate',
      label: 'Expiry Date',
      render: (row: Certificate) => formatDate(row.expiryDate),
    },
    {
      id: 'status',
      label: 'Status',
      render: (row: Certificate) => <StatusChip status={row.status} />,
    },
    {
      id: 'actions',
      label: 'Actions',
      render: (row: Certificate) => (
        <Box>
          <Tooltip title="View">
            <IconButton size="small" onClick={() => navigate(`/certificates/${row._id}`)}>
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => { setEditCert(row); setFormOpen(true); }}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          {row.certificateFile && (
            <Tooltip title="Download">
              <IconButton size="small" onClick={() => handleDownload(row._id, row.certificateFile!.originalName)}>
                <Download fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => setDeleteId(row._id)}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <PageContainer
      title="Certificates"
      action={
        <>
          <Button startIcon={<FileDownload />} onClick={handleExportExcel} variant="outlined" size="small">
            Excel
          </Button>
          <Button startIcon={<PictureAsPdf />} onClick={handleExportPdf} variant="outlined" size="small">
            PDF
          </Button>
          <Button startIcon={<Add />} variant="contained" onClick={() => { setEditCert(null); setFormOpen(true); }}>
            Add Certificate
          </Button>
        </>
      }
    >

      <FilterBar>
        <SearchField value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search certificates..." />
        <FilterSelect label="Category" value={category} onChange={(v) => { setCategory(v); setPage(1); }}
          options={CERTIFICATE_CATEGORIES.map((c) => ({ value: c, label: c }))} />
        <FilterSelect label="Status" value={status} onChange={(v) => { setStatus(v); setPage(1); }}
          options={CERTIFICATE_STATUSES.map((s) => ({ value: s, label: s }))} />
      </FilterBar>

      <DataTable
        columns={columns}
        data={data?.data.data || []}
        pagination={data?.data.meta?.pagination}
        onPageChange={setPage}
        onRowsPerPageChange={(l) => { setLimit(l); setPage(1); }}
        loading={isLoading}
        getRowId={(row) => row._id}
      />

      <CertificateFormDialog
        open={formOpen}
        certificate={editCert}
        onClose={() => { setFormOpen(false); setEditCert(null); }}
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Certificate"
        message="Are you sure you want to delete this certificate? This action cannot be undone."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
        loading={deleteMutation.isPending}
        danger
      />
    </PageContainer>
  );
}
