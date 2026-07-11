import { TextField, MenuItem, Box } from '@mui/material';
import { ReactNode } from 'react';

interface FilterBarProps {
  children: ReactNode;
}

export function FilterBar({ children }: FilterBarProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        mb: 3,
        p: 2.5,
        bgcolor: 'background.paper',
        borderRadius: 3,
        border: '1px solid rgba(30, 94, 255, 0.08)',
        boxShadow: '0 1px 3px rgba(30, 94, 255, 0.04)',
      }}
    >
      {children}
    </Box>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  minWidth?: number;
}

export function FilterSelect({
  label,
  value,
  onChange,
  options,
  minWidth = 160,
}: FilterSelectProps) {
  return (
    <TextField
      select
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      size="small"
      sx={{ minWidth }}
    >
      <MenuItem value="">All</MenuItem>
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </TextField>
  );
}

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchField({ value, onChange, placeholder = 'Search...' }: SearchFieldProps) {
  return (
    <TextField
      label="Search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      size="small"
      placeholder={placeholder}
      sx={{ minWidth: 240, flexGrow: 1 }}
    />
  );
}
