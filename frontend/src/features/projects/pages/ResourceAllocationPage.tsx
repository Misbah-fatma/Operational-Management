import { useState } from 'react';
import { Box, Alert } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { projectApi } from '../../../services';
import DataTable from '../../../components/common/DataTable';
import StatusChip from '../../../components/common/StatusChip';
import { FilterBar, SearchField } from '../../../components/common/FilterBar';
import PageContainer from '../../../components/layout/PageContainer';
import { formatDate } from '../../../utils/constants';
import { ProjectAssignment } from '../../../types';

export default function ResourceAllocationPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['resource-allocations', page, search],
    queryFn: () =>
      projectApi.getResourceAllocations({ page, limit: 10, search: search || undefined }),
  });

  const allocations = data?.data.data || [];

  return (
    <PageContainer title="Resource Allocation" subtitle="Manage employee and asset assignments across projects">
      <Alert severity="info" sx={{ mb: 2 }}>
        Double-booking is prevented — assigning an already-active resource will show a warning.
      </Alert>
      <FilterBar>
        <SearchField value={search} onChange={setSearch} placeholder="Search allocations..." />
      </FilterBar>
      <DataTable
        columns={[
          { id: 'assignmentId', label: 'Assignment ID', minWidth: 130 },
          {
            id: 'project',
            label: 'Project',
            render: (r: ProjectAssignment) =>
              typeof r.project === 'object' ? `${r.project.name} (${r.project.code})` : '-',
          },
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
          { id: 'releaseDate', label: 'Released', render: (r: ProjectAssignment) => formatDate(r.releaseDate) },
          { id: 'status', label: 'Status', render: (r: ProjectAssignment) => <StatusChip status={r.status} /> },
          { id: 'remarks', label: 'Remarks' },
        ]}
        data={allocations}
        pagination={data?.data.meta?.pagination}
        onPageChange={setPage}
        onRowsPerPageChange={() => {}}
        loading={isLoading}
        getRowId={(r) => r._id}
      />
    </PageContainer>
  );
}
