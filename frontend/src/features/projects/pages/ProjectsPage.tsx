import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Checkbox,
  Avatar,
  Chip,
  alpha,
  Tooltip,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Archive,
  ContentCopy,
  FileDownload,
  FolderOpen,
  TrendingUp,
  Schedule,
  Checklist,
  Close,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { projectApi, downloadBlob } from '../../../services';
import DataTable from '../../../components/common/DataTable';
import TableRowMenu from '../../../components/common/TableRowMenu';
import StatusChip from '../../../components/common/StatusChip';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import StatCard from '../../../components/common/StatCard';
import { FilterBar, FilterSelect, SearchField } from '../../../components/common/FilterBar';
import { PROJECT_STATUSES, formatDate, formatCurrency } from '../../../utils/constants';
import { Project } from '../../../types';
import ProjectFormDialog from '../components/ProjectFormDialog';
import PageContainer from '../../../components/layout/PageContainer';

function progressColor(pct: number) {
  if (pct >= 75) return '#1e5eff';
  if (pct >= 40) return '#3b82f6';
  if (pct >= 15) return '#60a5fa';
  return '#93c5fd';
}

export default function ProjectsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [client, setClient] = useState('');
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['projects', page, limit, search, status, client],
    queryFn: () =>
      projectApi.getAll({
        page,
        limit,
        search: search || undefined,
        status: status || undefined,
        client: client || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
  });

  const { data: dashData } = useQuery({
    queryKey: ['project-dashboard-mini'],
    queryFn: () => projectApi.getDashboard(),
  });

  const dash = dashData?.data.data;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      enqueueSnackbar('Project deleted', { variant: 'success' });
      setDeleteId(null);
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => projectApi.archive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      enqueueSnackbar('Project archived', { variant: 'success' });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: (id: string) => projectApi.duplicate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      enqueueSnackbar('Project duplicated', { variant: 'success' });
    },
  });

  const bulkMutation = useMutation({
    mutationFn: ({ ids, action }: { ids: string[]; action: 'delete' | 'archive' }) =>
      projectApi.bulkAction(ids, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setSelected([]);
      setSelectMode(false);
      enqueueSnackbar('Bulk action completed', { variant: 'success' });
    },
  });

  const projects = data?.data.data || [];
  const pagination = data?.data.meta?.pagination;

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelected([]);
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selected.length === projects.length) {
      setSelected([]);
    } else {
      setSelected(projects.map((p) => p._id));
    }
  };

  const rowMenuActions = (row: Project) => [
    {
      label: 'View details',
      icon: <Visibility fontSize="small" />,
      onClick: () => navigate(`/projects/${row._id}`),
    },
    {
      label: 'Edit project',
      icon: <Edit fontSize="small" />,
      onClick: () => { setEditProject(row); setFormOpen(true); },
    },
    {
      label: 'Duplicate',
      icon: <ContentCopy fontSize="small" />,
      onClick: () => duplicateMutation.mutate(row._id),
    },
    {
      label: 'Archive',
      icon: <Archive fontSize="small" />,
      onClick: () => archiveMutation.mutate(row._id),
    },
    {
      label: 'Delete',
      icon: <Delete fontSize="small" />,
      onClick: () => setDeleteId(row._id),
      danger: true,
    },
  ];

  const dataColumns = [
    {
      id: 'project',
      label: 'Project',
      minWidth: 220,
      render: (row: Project) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              fontSize: '0.7rem',
              fontWeight: 700,
              bgcolor: alpha('#1e5eff', 0.1),
              color: '#1e5eff',
            }}
          >
            {row.code.slice(-3)}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.3 }}>
              {row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.code}{row.client ? ` · ${row.client}` : ''}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'location',
      label: 'Location',
      minWidth: 110,
      render: (row: Project) => (
        <Typography variant="body2" color="text.secondary" noWrap>
          {row.location || '—'}
        </Typography>
      ),
    },
    {
      id: 'dates',
      label: 'Timeline',
      minWidth: 130,
      render: (row: Project) => (
        <Typography variant="caption" color="text.secondary" display="block">
          {formatDate(row.startDate)} – {formatDate(row.endDate)}
        </Typography>
      ),
    },
    {
      id: 'budget',
      label: 'Budget',
      minWidth: 100,
      align: 'right' as const,
      render: (row: Project) => (
        <Typography variant="body2" fontWeight={600}>
          {formatCurrency(row.budget)}
        </Typography>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      render: (row: Project) => <StatusChip status={row.status} />,
    },
    {
      id: 'progress',
      label: 'Progress',
      minWidth: 120,
      render: (row: Project) => {
        const pct = row.progressPercent || 0;
        return (
          <Box sx={{ minWidth: 96 }}>
            <Typography variant="caption" fontWeight={600} color={progressColor(pct)}>
              {pct}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={pct}
              sx={{
                mt: 0.5,
                height: 4,
                borderRadius: 2,
                bgcolor: alpha('#1e5eff', 0.08),
                '& .MuiLinearProgress-bar': { borderRadius: 2, bgcolor: progressColor(pct) },
              }}
            />
          </Box>
        );
      },
    },
    {
      id: 'manager',
      label: 'Manager',
      minWidth: 130,
      render: (row: Project) =>
        row.projectManager ? (
          <Typography variant="body2" noWrap>
            {row.projectManager.firstName} {row.projectManager.lastName}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.disabled">—</Typography>
        ),
    },
    {
      id: 'actions',
      label: '',
      minWidth: 48,
      sticky: 'right' as const,
      align: 'right' as const,
      render: (row: Project) => <TableRowMenu actions={rowMenuActions(row)} />,
    },
  ];

  const selectColumn = {
    id: 'select',
    label: (
      <Checkbox
        size="small"
        sx={{ p: 0 }}
        indeterminate={selected.length > 0 && selected.length < projects.length}
        checked={projects.length > 0 && selected.length === projects.length}
        onChange={toggleSelectAll}
        onClick={(e) => e.stopPropagation()}
      />
    ),
    minWidth: 44,
    render: (row: Project) => (
      <Checkbox
        size="small"
        sx={{ p: 0 }}
        checked={selected.includes(row._id)}
        onChange={() => toggleSelect(row._id)}
        onClick={(e) => e.stopPropagation()}
      />
    ),
  };

  const columns = selectMode ? [selectColumn, ...dataColumns] : dataColumns;

  return (
    <PageContainer
      title="Projects"
      subtitle="Track projects from proposal through completion"
      action={
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FileDownload />}
            onClick={async () => {
              const res = await projectApi.exportExcel({ search, status, client });
              downloadBlob(res.data as Blob, 'projects.xlsx');
            }}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => { setEditProject(null); setFormOpen(true); }}
          >
            New Project
          </Button>
        </Box>
      }
    >
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard title="Total Projects" value={dash?.total ?? 0} icon={<FolderOpen />} loading={!dash} />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard title="Active" value={dash?.active ?? 0} icon={<TrendingUp />} color="#2563eb" loading={!dash} />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard title="In Planning" value={dash?.planningStage ?? 0} icon={<Schedule />} color="#3b82f6" loading={!dash} />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard title="Overall Progress" value={`${dash?.overallProgress ?? 0}%`} color="white" loading={!dash} />
        </Grid>
      </Grid>

      <FilterBar>
        <SearchField value={search} onChange={setSearch} placeholder="Search by name, ID, client..." />
        <FilterSelect
          label="Status"
          value={status}
          onChange={setStatus}
          options={PROJECT_STATUSES.map((s) => ({ value: s, label: s }))}
        />
        <SearchField value={client} onChange={setClient} placeholder="Client..." />

        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {selectMode && selected.length > 0 && (
            <>
              <Chip
                size="small"
                label={`${selected.length} selected`}
                onDelete={exitSelectMode}
                deleteIcon={<Close sx={{ fontSize: 16 }} />}
                sx={{ fontWeight: 600 }}
              />
              <Button
                size="small"
                variant="outlined"
                startIcon={<Archive />}
                onClick={() => bulkMutation.mutate({ ids: selected, action: 'archive' })}
              >
                Archive
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={() => bulkMutation.mutate({ ids: selected, action: 'delete' })}
              >
                Delete
              </Button>
            </>
          )}
          <Tooltip title={selectMode ? 'Exit selection mode' : 'Select multiple projects'}>
            <Button
              size="small"
              variant={selectMode ? 'contained' : 'outlined'}
              startIcon={selectMode ? <Close /> : <Checklist />}
              onClick={() => (selectMode ? exitSelectMode() : setSelectMode(true))}
              sx={{ whiteSpace: 'nowrap' }}
            >
              {selectMode ? 'Done' : 'Select'}
            </Button>
          </Tooltip>
        </Box>
      </FilterBar>

      <DataTable
        columns={columns}
        data={projects}
        pagination={pagination}
        onPageChange={setPage}
        onRowsPerPageChange={setLimit}
        loading={isLoading}
        onRowClick={selectMode ? undefined : (row) => navigate(`/projects/${row._id}`)}
        emptyMessage="No projects found. Create your first project to get started."
        getRowId={(row) => row._id}
      />

      <ProjectFormDialog
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditProject(null); }}
        project={editProject}
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
        loading={deleteMutation.isPending}
      />
    </PageContainer>
  );
}
