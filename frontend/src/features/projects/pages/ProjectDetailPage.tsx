import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  LinearProgress,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ArrowBack, Add, Delete, Download } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import {
  projectApi,
  authApi,
  vehicleApi,
  downloadBlob,
} from '../../../services';
import PageContainer from '../../../components/layout/PageContainer';
import StatusChip from '../../../components/common/StatusChip';
import DataTable from '../../../components/common/DataTable';
import {
  formatDate,
  formatCurrency,
  PROJECT_DOCUMENT_CATEGORIES,
  PROJECT_STATUSES,
} from '../../../utils/constants';
import { Milestone, ProjectPlanningItem, ProjectAssignment } from '../../../types';

function DetailField({ label, value }: { label: string; value?: string | number }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="body1" fontWeight={500}>{value ?? '-'}</Typography>
    </Box>
  );
}

export default function ProjectDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [tab, setTab] = useState(0);
  const [milestoneOpen, setMilestoneOpen] = useState(false);
  const [assignmentOpen, setAssignmentOpen] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const [docOpen, setDocOpen] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({ name: '', description: '', plannedDate: '', progressPercent: 0, status: 'Pending' });
  const [assignmentForm, setAssignmentForm] = useState({
    resourceType: 'employee',
    employee: '',
    vehicle: '',
    equipment: '',
    employeeRole: 'engineer',
    workPackage: '',
    assignmentDate: new Date().toISOString().slice(0, 10),
    remarks: '',
  });
  const [progressForm, setProgressForm] = useState({ updateType: 'weekly', date: new Date().toISOString().slice(0, 10), progressPercent: 0, summary: '', issues: '' });
  const [financialForm, setFinancialForm] = useState({ budget: 0, actualCost: 0, outstandingPayments: 0 });
  const [planningForm, setPlanningForm] = useState<{ type: 'wbs' | 'deliverable' | 'schedule'; name: string; description: string; plannedDate: string }>({ type: 'wbs', name: '', description: '', plannedDate: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['project-detail', id],
    queryFn: () => projectApi.getDetail(id),
    enabled: !!id,
  });

  const { data: usersData } = useQuery({ queryKey: ['users'], queryFn: () => authApi.getUsers() });
  const { data: vehiclesData } = useQuery({ queryKey: ['vehicles-all'], queryFn: () => vehicleApi.getAll({ limit: 100 }) });

  const detail = data?.data.data;
  const project = detail?.project;

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['project-detail', id] });

  const milestoneMutation = useMutation({
    mutationFn: () => projectApi.createMilestone(id, milestoneForm),
    onSuccess: () => { invalidate(); setMilestoneOpen(false); enqueueSnackbar('Milestone added', { variant: 'success' }); },
  });

  const planningMutation = useMutation({
    mutationFn: () => projectApi.createPlanningItem(id, planningForm),
    onSuccess: () => { invalidate(); enqueueSnackbar('Planning item added', { variant: 'success' }); setPlanningForm({ type: 'wbs', name: '', description: '', plannedDate: '' }); },
  });

  const assignmentMutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, unknown> = {
        resourceType: assignmentForm.resourceType,
        workPackage: assignmentForm.workPackage,
        assignmentDate: assignmentForm.assignmentDate,
        remarks: assignmentForm.remarks,
      };
      if (assignmentForm.resourceType === 'employee') {
        payload.employee = assignmentForm.employee;
        payload.employeeRole = assignmentForm.employeeRole;
      } else if (assignmentForm.resourceType === 'vehicle') {
        payload.vehicle = assignmentForm.vehicle;
      }
      const check = await projectApi.checkResourceConflict(
        assignmentForm.resourceType,
        assignmentForm.resourceType === 'employee' ? assignmentForm.employee : assignmentForm.vehicle,
      );
      if (check.data.data?.hasConflict) {
        enqueueSnackbar('Resource is already assigned to another project', { variant: 'warning' });
      }
      return projectApi.createAssignment(id, payload);
    },
    onSuccess: () => { invalidate(); setAssignmentOpen(false); enqueueSnackbar('Resource assigned', { variant: 'success' }); },
    onError: (err: unknown) => {
      enqueueSnackbar((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Assignment failed', { variant: 'error' });
    },
  });

  const progressMutation = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      Object.entries(progressForm).forEach(([k, v]) => fd.append(k, String(v)));
      return projectApi.createProgress(id, fd);
    },
    onSuccess: () => { invalidate(); setProgressOpen(false); enqueueSnackbar('Progress updated', { variant: 'success' }); },
  });

  const financialMutation = useMutation({
    mutationFn: () => projectApi.updateFinancials(id, financialForm),
    onSuccess: () => { invalidate(); enqueueSnackbar('Financials updated', { variant: 'success' }); },
  });

  const releaseMutation = useMutation({
    mutationFn: (assignmentId: string) => projectApi.releaseAssignment(id, assignmentId),
    onSuccess: () => { invalidate(); enqueueSnackbar('Resource released', { variant: 'success' }); },
  });

  if (isLoading || !project) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  const fin = detail?.financialSummary;

  return (
    <PageContainer
      title={project.name}
      subtitle={`${project.code} • ${project.client || 'No client'}`}
      action={
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/projects')}>Back to Projects</Button>
      }
    >
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
          <Box flex={1}>
            <StatusChip status={project.status} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Progress: {project.progressPercent}% • Delay: {project.delayStatus || 'On Track'}
            </Typography>
            <LinearProgress variant="determinate" value={project.progressPercent} sx={{ mt: 1, borderRadius: 1, maxWidth: 400 }} />
          </Box>
          <Box>
            <Typography variant="h6">{formatCurrency(project.budget)}</Typography>
            <Typography variant="caption" color="text.secondary">Budget</Typography>
          </Box>
        </CardContent>
      </Card>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="General" />
        <Tab label="Planning" />
        <Tab label="Resources" />
        <Tab label="Progress" />
        <Tab label="Documents" />
        <Tab label="Financial" />
      </Tabs>

      {tab === 0 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card><CardContent>
              <DetailField label="Project ID" value={project.code} />
              <DetailField label="Client" value={project.client} />
              <DetailField label="Contract Number" value={project.contractNumber} />
              <DetailField label="Contract Value" value={formatCurrency(project.contractValue)} />
              <DetailField label="SLA" value={project.sla} />
              <DetailField label="Location" value={project.location} />
            </CardContent></Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card><CardContent>
              <DetailField label="Start Date" value={formatDate(project.startDate)} />
              <DetailField label="End Date" value={formatDate(project.endDate)} />
              <DetailField label="Status" value={project.status} />
              <DetailField label="Project Manager" value={project.projectManager ? `${project.projectManager.firstName} ${project.projectManager.lastName}` : '-'} />
              <DetailField label="Description" value={project.description} />
              <DetailField label="Remarks" value={project.remarks} />
            </CardContent></Card>
          </Grid>
        </Grid>
      )}

      {tab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button startIcon={<Add />} variant="contained" onClick={() => setMilestoneOpen(true)}>Add Milestone</Button>
          </Box>
          <DataTable
            columns={[
              { id: 'name', label: 'Milestone' },
              { id: 'plannedDate', label: 'Planned', render: (r: Milestone) => formatDate(r.plannedDate) },
              { id: 'actualDate', label: 'Actual', render: (r: Milestone) => formatDate(r.actualDate) },
              { id: 'status', label: 'Status', render: (r: Milestone) => <StatusChip status={r.status} /> },
              { id: 'progress', label: 'Progress', render: (r: Milestone) => `${r.progressPercent}%` },
            ]}
            data={detail?.milestones || []}
            getRowId={(r) => r._id}
          />
          <Box sx={{ mt: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Add WBS / Deliverable / Schedule</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField fullWidth select label="Type" value={planningForm.type}
                  onChange={(e) => setPlanningForm({ ...planningForm, type: e.target.value as 'wbs' | 'deliverable' | 'schedule' })}>
                  <MenuItem value="wbs">WBS</MenuItem>
                  <MenuItem value="deliverable">Deliverable</MenuItem>
                  <MenuItem value="schedule">Schedule</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth label="Name" value={planningForm.name} onChange={(e) => setPlanningForm({ ...planningForm, name: e.target.value })} />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField fullWidth type="date" label="Planned Date" InputLabelProps={{ shrink: true }}
                  value={planningForm.plannedDate} onChange={(e) => setPlanningForm({ ...planningForm, plannedDate: e.target.value })} />
              </Grid>
              <Grid size={{ xs: 12, sm: 2 }}>
                <Button fullWidth variant="outlined" sx={{ height: '100%' }} onClick={() => planningMutation.mutate()} disabled={!planningForm.name}>Add</Button>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ mt: 2 }}>
            <DataTable
              columns={[
                { id: 'type', label: 'Type' },
                { id: 'name', label: 'Name' },
                { id: 'plannedDate', label: 'Planned', render: (r: ProjectPlanningItem) => formatDate(r.plannedDate) },
                { id: 'status', label: 'Status' },
              ]}
              data={detail?.planning || []}
              getRowId={(r) => r._id}
            />
          </Box>
        </Box>
      )}

      {tab === 2 && (
        <Box>
          <Button startIcon={<Add />} variant="contained" sx={{ mb: 2 }} onClick={() => setAssignmentOpen(true)}>Assign Resource</Button>
          <DataTable
            columns={[
              { id: 'assignmentId', label: 'Assignment ID' },
              { id: 'resourceType', label: 'Type' },
              {
                id: 'resource',
                label: 'Resource',
                render: (r: ProjectAssignment) => {
                  if (r.resourceType === 'employee' && r.employee) return `${r.employee.firstName} ${r.employee.lastName}`;
                  if (r.resourceType === 'vehicle' && r.vehicle) return r.vehicle.vehicleName;
                  if (r.resourceType === 'equipment' && r.equipment) return r.equipment.name;
                  return '-';
                },
              },
              { id: 'workPackage', label: 'Work Package' },
              { id: 'assignmentDate', label: 'Assigned', render: (r: ProjectAssignment) => formatDate(r.assignmentDate) },
              { id: 'status', label: 'Status', render: (r: ProjectAssignment) => <StatusChip status={r.status} /> },
              {
                id: 'actions',
                label: 'Actions',
                render: (r: ProjectAssignment) =>
                  r.status === 'Active' ? (
                    <Button size="small" onClick={() => releaseMutation.mutate(r._id)}>Release</Button>
                  ) : null,
              },
            ]}
            data={detail?.assignments || []}
            getRowId={(r) => r._id}
          />
        </Box>
      )}

      {tab === 3 && (
        <Box>
          <Button startIcon={<Add />} variant="contained" sx={{ mb: 2 }} onClick={() => setProgressOpen(true)}>Add Progress Update</Button>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 4 }}><Card><CardContent><Typography color="text.secondary">Planned</Typography><Typography variant="h5">{project.plannedProgressPercent || 0}%</Typography></CardContent></Card></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><Card><CardContent><Typography color="text.secondary">Actual</Typography><Typography variant="h5">{project.actualProgressPercent || 0}%</Typography></CardContent></Card></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><Card><CardContent><Typography color="text.secondary">Delay Status</Typography><StatusChip status={project.delayStatus || 'On Track'} /></CardContent></Card></Grid>
          </Grid>
          <DataTable
            columns={[
              { id: 'date', label: 'Date', render: (r) => formatDate(r.date) },
              { id: 'updateType', label: 'Type' },
              { id: 'progressPercent', label: 'Progress %' },
              { id: 'summary', label: 'Summary' },
              { id: 'issues', label: 'Issues' },
            ]}
            data={detail?.progress || []}
            getRowId={(r) => r._id}
          />
        </Box>
      )}

      {tab === 4 && (
        <Box>
          <Button startIcon={<Add />} variant="contained" sx={{ mb: 2 }} onClick={() => setDocOpen(true)}>Upload Document</Button>
          <DataTable
            columns={[
              { id: 'category', label: 'Category' },
              { id: 'fileName', label: 'File Name' },
              { id: 'version', label: 'Version' },
              { id: 'uploaded', label: 'Uploaded', render: (r) => formatDate(r.createdAt) },
              {
                id: 'actions',
                label: 'Actions',
                render: (r) => (
                  <Tooltip title="Download">
                    <IconButton size="small" onClick={async () => {
                      const res = await projectApi.downloadDocument(id, r._id);
                      downloadBlob(res.data as Blob, r.fileName);
                    }}><Download fontSize="small" /></IconButton>
                  </Tooltip>
                ),
              },
            ]}
            data={detail?.documents || []}
            getRowId={(r) => r._id}
          />
        </Box>
      )}

      {tab === 5 && fin && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><Card><CardContent><Typography color="text.secondary">Budget</Typography><Typography variant="h5">{formatCurrency(fin.budget)}</Typography></CardContent></Card></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><Card><CardContent><Typography color="text.secondary">Actual Cost</Typography><Typography variant="h5">{formatCurrency(fin.actualCost)}</Typography></CardContent></Card></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><Card><CardContent><Typography color="text.secondary">Budget Used</Typography><Typography variant="h5">{fin.budgetUsedPercent}%</Typography></CardContent></Card></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><Card><CardContent><Typography color="text.secondary">Remaining</Typography><Typography variant="h5">{formatCurrency(fin.remainingBudget)}</Typography></CardContent></Card></Grid>
          <Grid size={{ xs: 12 }}>
            <Card><CardContent>
              <Typography variant="h6" gutterBottom>Update Financials</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth type="number" label="Budget" value={financialForm.budget || fin.budget} onChange={(e) => setFinancialForm({ ...financialForm, budget: +e.target.value })} /></Grid>
                <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth type="number" label="Actual Cost" value={financialForm.actualCost || fin.actualCost} onChange={(e) => setFinancialForm({ ...financialForm, actualCost: +e.target.value })} /></Grid>
                <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth type="number" label="Outstanding" value={financialForm.outstandingPayments || fin.outstandingPayments} onChange={(e) => setFinancialForm({ ...financialForm, outstandingPayments: +e.target.value })} /></Grid>
              </Grid>
              <Button variant="contained" sx={{ mt: 2 }} onClick={() => financialMutation.mutate()}>Save Financials</Button>
            </CardContent></Card>
          </Grid>
        </Grid>
      )}

      {/* Milestone Dialog */}
      <Dialog open={milestoneOpen} onClose={() => setMilestoneOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Milestone</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" margin="normal" value={milestoneForm.name} onChange={(e) => setMilestoneForm({ ...milestoneForm, name: e.target.value })} />
          <TextField fullWidth label="Description" margin="normal" value={milestoneForm.description} onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })} />
          <TextField fullWidth type="date" label="Planned Date" margin="normal" InputLabelProps={{ shrink: true }} value={milestoneForm.plannedDate} onChange={(e) => setMilestoneForm({ ...milestoneForm, plannedDate: e.target.value })} />
          <TextField fullWidth type="number" label="Progress %" margin="normal" value={milestoneForm.progressPercent} onChange={(e) => setMilestoneForm({ ...milestoneForm, progressPercent: +e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMilestoneOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => milestoneMutation.mutate()} disabled={!milestoneForm.name}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Assignment Dialog */}
      <Dialog open={assignmentOpen} onClose={() => setAssignmentOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Resource</DialogTitle>
        <DialogContent>
          <TextField fullWidth select label="Resource Type" margin="normal" value={assignmentForm.resourceType}
            onChange={(e) => setAssignmentForm({ ...assignmentForm, resourceType: e.target.value })}>
            <MenuItem value="employee">Employee</MenuItem>
            <MenuItem value="vehicle">Vehicle</MenuItem>
          </TextField>
          {assignmentForm.resourceType === 'employee' && (
            <>
              <TextField fullWidth select label="Employee" margin="normal" value={assignmentForm.employee}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, employee: e.target.value })}>
                {(usersData?.data.data || []).map((u) => <MenuItem key={u._id} value={u._id}>{u.firstName} {u.lastName}</MenuItem>)}
              </TextField>
              <TextField fullWidth select label="Role" margin="normal" value={assignmentForm.employeeRole}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, employeeRole: e.target.value })}>
                <MenuItem value="engineer">Engineer</MenuItem>
                <MenuItem value="supervisor">Supervisor</MenuItem>
                <MenuItem value="technician">Technician</MenuItem>
              </TextField>
            </>
          )}
          {assignmentForm.resourceType === 'vehicle' && (
            <TextField fullWidth select label="Vehicle" margin="normal" value={assignmentForm.vehicle}
              onChange={(e) => setAssignmentForm({ ...assignmentForm, vehicle: e.target.value })}>
              {(vehiclesData?.data.data || []).map((v) => <MenuItem key={v._id} value={v._id}>{v.vehicleName}</MenuItem>)}
            </TextField>
          )}
          <TextField fullWidth label="Work Package" margin="normal" value={assignmentForm.workPackage} onChange={(e) => setAssignmentForm({ ...assignmentForm, workPackage: e.target.value })} />
          <TextField fullWidth type="date" label="Assignment Date" margin="normal" InputLabelProps={{ shrink: true }} value={assignmentForm.assignmentDate} onChange={(e) => setAssignmentForm({ ...assignmentForm, assignmentDate: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignmentOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => assignmentMutation.mutate()}>Assign</Button>
        </DialogActions>
      </Dialog>

      {/* Progress Dialog */}
      <Dialog open={progressOpen} onClose={() => setProgressOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Progress Update</DialogTitle>
        <DialogContent>
          <TextField fullWidth select label="Type" margin="normal" value={progressForm.updateType} onChange={(e) => setProgressForm({ ...progressForm, updateType: e.target.value })}>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </TextField>
          <TextField fullWidth type="date" label="Date" margin="normal" InputLabelProps={{ shrink: true }} value={progressForm.date} onChange={(e) => setProgressForm({ ...progressForm, date: e.target.value })} />
          <TextField fullWidth type="number" label="Progress %" margin="normal" value={progressForm.progressPercent} onChange={(e) => setProgressForm({ ...progressForm, progressPercent: +e.target.value })} />
          <TextField fullWidth label="Summary" margin="normal" multiline rows={2} value={progressForm.summary} onChange={(e) => setProgressForm({ ...progressForm, summary: e.target.value })} />
          <TextField fullWidth label="Issues" margin="normal" multiline rows={2} value={progressForm.issues} onChange={(e) => setProgressForm({ ...progressForm, issues: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProgressOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => progressMutation.mutate()}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Document Dialog */}
      <Dialog open={docOpen} onClose={() => setDocOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <form id="doc-form" onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const fd = new FormData(form);
            await projectApi.uploadDocument(id, fd);
            invalidate();
            setDocOpen(false);
            enqueueSnackbar('Document uploaded', { variant: 'success' });
          }}>
            <TextField fullWidth select name="category" label="Category" margin="normal" defaultValue="Reports">
              {PROJECT_DOCUMENT_CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
            <TextField fullWidth name="fileName" label="File Name" margin="normal" />
            <TextField fullWidth name="version" label="Version" margin="normal" defaultValue="1.0" />
            <Button component="label" variant="outlined" sx={{ mt: 2 }}>
              Select File
              <input type="file" name="documentFile" hidden required />
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDocOpen(false)}>Cancel</Button>
          <Button variant="contained" type="submit" form="doc-form">Upload</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}
