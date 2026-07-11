import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Add, Edit, Delete, FileDownload, PictureAsPdf } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { vehicleApi, downloadBlob } from '../../../services';
import DataTable from '../../../components/common/DataTable';
import StatusChip from '../../../components/common/StatusChip';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { FilterBar, FilterSelect, SearchField } from '../../../components/common/FilterBar';
import { VEHICLE_STATUSES, formatDate } from '../../../utils/constants';
import { Vehicle } from '../../../types';
import VehicleFormDialog from '../components/VehicleFormDialog';
import PageContainer from '../../../components/layout/PageContainer';

export default function VehiclesPage() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['vehicles', page, limit, search, status],
    queryFn: () =>
      vehicleApi.getAll({
        page,
        limit,
        search: search || undefined,
        status: status || undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => vehicleApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      enqueueSnackbar('Vehicle deleted', { variant: 'success' });
      setDeleteId(null);
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      enqueueSnackbar(msg || 'Delete failed', { variant: 'error' });
    },
  });

  const columns = [
    { id: 'vehicleId', label: 'ID', minWidth: 120 },
    { id: 'vehicleName', label: 'Name', minWidth: 140 },
    { id: 'registrationNumber', label: 'Registration', minWidth: 120 },
    { id: 'make', label: 'Make' },
    { id: 'model', label: 'Model' },
    { id: 'currentKm', label: 'KM' },
    {
      id: 'currentStatus',
      label: 'Status',
      render: (row: Vehicle) => <StatusChip status={row.currentStatus} />,
    },
    {
      id: 'insuranceExpiryDate',
      label: 'Insurance Exp.',
      render: (row: Vehicle) => formatDate(row.insuranceExpiryDate),
    },
    {
      id: 'actions',
      label: 'Actions',
      render: (row: Vehicle) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => { setEditVehicle(row); setFormOpen(true); }}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
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
      title="Vehicles"
      action={
        <>
          <Button startIcon={<FileDownload />} variant="outlined" size="small"
            onClick={async () => downloadBlob((await vehicleApi.exportExcel()).data as Blob, 'vehicles.xlsx')}>
            Excel
          </Button>
          <Button startIcon={<PictureAsPdf />} variant="outlined" size="small"
            onClick={async () => downloadBlob((await vehicleApi.exportPdf()).data as Blob, 'vehicles.pdf')}>
            PDF
          </Button>
          <Button startIcon={<Add />} variant="contained" onClick={() => { setEditVehicle(null); setFormOpen(true); }}>
            Add Vehicle
          </Button>
        </>
      }
    >

      <FilterBar>
        <SearchField value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search vehicles..." />
        <FilterSelect label="Status" value={status} onChange={(v) => { setStatus(v); setPage(1); }}
          options={VEHICLE_STATUSES.map((s) => ({ value: s, label: s }))} />
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

      <VehicleFormDialog open={formOpen} vehicle={editVehicle} onClose={() => { setFormOpen(false); setEditVehicle(null); }} />

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Vehicle"
        message="Are you sure you want to delete this vehicle?"
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
        loading={deleteMutation.isPending}
        danger
      />
    </PageContainer>
  );
}
