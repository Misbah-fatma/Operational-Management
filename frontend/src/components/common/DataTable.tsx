import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  CircularProgress,
  Typography,
  Box,
} from '@mui/material';
import { ReactNode } from 'react';
import { PaginationMeta } from '../../types';

interface Column<T> {
  id: string;
  label: ReactNode;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  sticky?: 'right' | 'left';
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (limit: number) => void;
  loading?: boolean;
  emptyMessage?: string;
  getRowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  dense?: boolean;
}

export default function DataTable<T>({
  columns,
  data,
  pagination,
  onPageChange,
  onRowsPerPageChange,
  loading,
  emptyMessage = 'No data found',
  getRowId,
  onRowClick,
  dense = false,
}: DataTableProps<T>) {
  const stickyStyles = (sticky?: 'right' | 'left') => {
    if (!sticky) return {};
    return {
      position: 'sticky' as const,
      [sticky]: 0,
      zIndex: 2,
      bgcolor: '#fff',
      boxShadow: sticky === 'right' ? '-4px 0 12px rgba(30, 94, 255, 0.06)' : '4px 0 12px rgba(30, 94, 255, 0.06)',
    };
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        overflow: 'hidden',
        borderRadius: 3,
        border: '1px solid rgba(30, 94, 255, 0.08)',
        boxShadow: '0 1px 3px rgba(30, 94, 255, 0.04)',
        marginTop: 2,
      }}
    >
      <TableContainer sx={{ maxHeight: dense ? undefined : 'calc(100vh - 320px)' }}>
        <Table stickyHeader size={dense ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || 'left'}
                  sx={{
                    minWidth: col.minWidth,
                    fontWeight: col.id === 'actions' || col.id === 'select' ? 500 : 700,
                    fontSize: col.id === 'actions' || col.id === 'select' ? 'inherit' : '0.75rem',
                    textTransform: col.id === 'actions' || col.id === 'select' ? 'none' : 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#64748b',
                    bgcolor: '#f8fafc',
                    borderBottom: '1px solid rgba(30, 94, 255, 0.1)',
                    py: 1.75,
                    ...stickyStyles(col.sticky),
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                  <CircularProgress size={36} sx={{ color: 'primary.main' }} />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                  <Typography color="text.secondary">{emptyMessage}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow
                  hover
                  key={getRowId(row)}
                  onClick={() => onRowClick?.(row)}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    bgcolor: rowIndex % 2 === 0 ? '#fff' : 'rgba(248, 250, 252, 0.6)',
                    '&:hover': { bgcolor: 'rgba(30, 94, 255, 0.04) !important' },
                    transition: 'background-color 0.15s ease',
                    '& .MuiTableCell-root': {
                      borderBottom: '1px solid rgba(30, 94, 255, 0.05)',
                      py: dense ? 1.25 : 1.75,
                    },
                  }}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.id}
                      align={col.align || 'left'}
                      sx={stickyStyles(col.sticky)}
                      onClick={col.id === 'actions' ? (e) => e.stopPropagation() : undefined}
                    >
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.id] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && onPageChange && onRowsPerPageChange && (
        <Box sx={{ borderTop: '1px solid rgba(30, 94, 255, 0.06)' }}>
          <TablePagination
            component="div"
            count={pagination.total}
            page={pagination.page - 1}
            rowsPerPage={pagination.limit}
            onPageChange={(_, page) => onPageChange(page + 1)}
            onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontSize: '0.85rem',
                color: 'text.secondary',
              },
            }}
          />
        </Box>
      )}
    </Paper>
  );
}
