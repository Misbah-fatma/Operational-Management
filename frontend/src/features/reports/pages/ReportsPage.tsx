import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { FileDownload, PictureAsPdf, Assessment } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { reportApi, projectApi, authApi, vehicleApi, downloadBlob } from '../../../services';
import PageContainer from '../../../components/layout/PageContainer';
import { REPORT_TYPES, CERTIFICATE_CATEGORIES } from '../../../utils/constants';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('project');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [project, setProject] = useState('');
  const [employee, setEmployee] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [client, setClient] = useState('');
  const [enabled, setEnabled] = useState(false);

  const filters = {
    reportType,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    project: project || undefined,
    employee: employee || undefined,
    vehicle: vehicle || undefined,
    category: category || undefined,
    status: status || undefined,
    client: client || undefined,
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['report', filters],
    queryFn: () => reportApi.generate(filters),
    enabled,
  });

  const { data: projectsData } = useQuery({ queryKey: ['projects-list'], queryFn: () => projectApi.getAll({ limit: 100 }) });
  const { data: usersData } = useQuery({ queryKey: ['users'], queryFn: () => authApi.getUsers() });
  const { data: vehiclesData } = useQuery({ queryKey: ['vehicles-all'], queryFn: () => vehicleApi.getAll({ limit: 100 }) });

  const report = data?.data.data;

  const handleGenerate = () => {
    setEnabled(true);
    refetch();
  };

  const handleExportExcel = async () => {
    const res = await reportApi.exportExcel(filters);
    downloadBlob(res.data as Blob, `${reportType}-report.xlsx`);
  };

  const handleExportPdf = async () => {
    const res = await reportApi.exportPdf(filters);
    downloadBlob(res.data as Blob, `${reportType}-report.pdf`);
  };

  return (
    <PageContainer
      title="Reporting Center"
      subtitle="Generate and export operational reports"
      action={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button startIcon={<FileDownload />} onClick={handleExportExcel} disabled={!report}>Excel</Button>
          <Button startIcon={<PictureAsPdf />} onClick={handleExportPdf} disabled={!report}>PDF</Button>
          <Button variant="contained" startIcon={<Assessment />} onClick={handleGenerate}>Generate Report</Button>
        </Box>
      }
    >
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Filters</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField fullWidth select label="Report Type" value={reportType} onChange={(e) => setReportType(e.target.value)}>
                {REPORT_TYPES.map((r) => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField fullWidth type="date" label="Date From" InputLabelProps={{ shrink: true }} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField fullWidth type="date" label="Date To" InputLabelProps={{ shrink: true }} value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField fullWidth select label="Project" value={project} onChange={(e) => setProject(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                {(projectsData?.data.data || []).map((p) => <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField fullWidth select label="Employee" value={employee} onChange={(e) => setEmployee(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                {(usersData?.data.data || []).map((u) => <MenuItem key={u._id} value={u._id}>{u.firstName} {u.lastName}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField fullWidth select label="Vehicle" value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                {(vehiclesData?.data.data || []).map((v) => <MenuItem key={v._id} value={v._id}>{v.vehicleName}</MenuItem>)}
              </TextField>
            </Grid>
            {(reportType === 'certificate') && (
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField fullWidth select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <MenuItem value="">All</MenuItem>
                  {CERTIFICATE_CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
              </Grid>
            )}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField fullWidth label="Status" value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Filter by status" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField fullWidth label="Client" value={client} onChange={(e) => setClient(e.target.value)} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
      ) : report ? (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>{report.title}</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>{report.rows.length} records</Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {report.columns.map((col) => <TableCell key={col} sx={{ fontWeight: 600 }}>{col}</TableCell>)}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report.rows.slice(0, 100).map((row, i) => (
                    <TableRow key={i}>
                      {row.map((cell, j) => <TableCell key={j}>{cell}</TableCell>)}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Typography color="text.secondary" textAlign="center" py={4}>
          Select filters and click Generate Report
        </Typography>
      )}
    </PageContainer>
  );
}
