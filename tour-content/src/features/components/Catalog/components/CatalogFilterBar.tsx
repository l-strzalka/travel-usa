import {
  Box,
  TextField,
  Slider,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { ExploreFilters } from '../types/explore.types';
import { useState, useEffect } from 'react';

interface CatalogFilterBarProps {
  filters: ExploreFilters;
  onFilterChange: (newFilters: Partial<ExploreFilters>) => void;
  onReset: () => void;
}

export const CatalogFilterBar = ({
  filters,
  onFilterChange,
  onReset,
}: CatalogFilterBarProps) => {
  // 1. Lokalne stany
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const [priceRange, setPriceRange] = useState<number[]>([
    filters.minPrice ?? 0,
    filters.maxPrice ?? 20000,
  ]);

  // Synchronizacja przy zmianie propsów (np. Reset / Wstecz w przeglądarce)
  useEffect(() => {
    setSearchValue(filters.search || '');
    setPriceRange([filters.minPrice ?? 0, filters.maxPrice ?? 20000]);
  }, [filters.search, filters.minPrice, filters.maxPrice]);

  // Debounce tylko dla pola wyszukiwania
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== (filters.search || '')) {
        onFilterChange({ search: searchValue || undefined });
      }
    }, 1400);
    return () => clearTimeout(timer);
  }, [searchValue, filters.search, onFilterChange]);

  return (
    <Box
      sx={{
        p: 3,
        mb: 4,
        bgcolor: 'background.paper',       
        border: '1px solid',
        borderColor: 'grey.200',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <Stack spacing={3} direction={{ xs: 'column', md: 'row' }} alignItems="center">
        {/* Szukajka - podłączona do searchValue */}
        <TextField
          fullWidth
          size="small"
          label="Szukaj wycieczki..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
          }}
        />

        {/* Zakres cenowy - podłączony do priceRange */}
        <Box sx={{ width: '100%', minWidth: 200, px: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Zakres ceny: {priceRange[0]} PLN - {priceRange[1]} PLN
          </Typography>
          <Slider
            value={priceRange}
            onChange={(_, newValue) => setPriceRange(newValue as number[])}
            onChangeCommitted={(_, newValue) => {
              const [min, max] = newValue as number[];
              onFilterChange({ minPrice: min, maxPrice: max });
            }}
            valueLabelDisplay="auto"
            min={0}
            max={20000}
            step={500}
            size="small"
          />
        </Box>

        {/* Sortowanie */}
        <FormControl size="small" sx={{ minWidth: 180, width: '100%' }}>
          <InputLabel>Sortuj według</InputLabel>
          <Select
            value={filters.sortBy ? `${filters.sortBy}-${filters.sortOrder || 'asc'}` : ''}
            label="Sortuj według"
            onChange={(e) => {
              const val = e.target.value;
              if (!val) {
                onFilterChange({ sortBy: undefined, sortOrder: undefined });
              } else {
                const [sortBy, sortOrder] = val.split('-');
                onFilterChange({ sortBy, sortOrder: sortOrder as 'asc' | 'desc' });
              }
            }}
          >
            <MenuItem value="">Domyślnie</MenuItem>
            <MenuItem value="price-asc">Cena: od najniższej</MenuItem>
            <MenuItem value="price-desc">Cena: od najwyższej</MenuItem>
            <MenuItem value="name-asc">Nazwa: A-Z</MenuItem>
          </Select>
        </FormControl>

        {/* Przycisk Reset */}
        <Button
          variant="outlined"
          color="inherit"
          onClick={onReset}
          startIcon={<RestartAltIcon />}
          sx={{ whiteSpace: 'nowrap', minWidth: 120, height: 40 }}
        >
          Reset
        </Button>
      </Stack>
    </Box>
  );
};