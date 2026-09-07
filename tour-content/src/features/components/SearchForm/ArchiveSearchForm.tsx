import React, { useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Paper, Stack, Button } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { SearchAutocomplete, SearchOption } from './SearchAutocomplete';

interface ArchiveSearchFormProps {
  onFilterChange?: (filters: { search?: string }) => void;
}

export const ArchiveSearchForm: React.FC<ArchiveSearchFormProps> = ({
  onFilterChange,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentSearchParam = searchParams.get('search') || null;

  const selectedOptionRef = useRef<SearchOption | string | null>(currentSearchParam);
  const rawInputTextRef = useRef<string>(
    typeof currentSearchParam === 'string' ? currentSearchParam : ''
  );

  const normalizeSearchValue = (value: string) =>
    value.trim().replace(/\s+/g, ' ');

  const handleApplyFilters = (e?: React.FormEvent) => {
    e?.preventDefault();

    const selectedOption = selectedOptionRef.current;
    const rawText = rawInputTextRef.current;
    let searchValue = '';

    if (typeof selectedOption === 'string') {
      searchValue = normalizeSearchValue(selectedOption);
    } else if (selectedOption) {
      searchValue = normalizeSearchValue(selectedOption.label);
    } else if (rawText) {
      searchValue = normalizeSearchValue(rawText);
    }

    // Aktualizacja URL Params w obrębie tej samej strony
    const newParams = new URLSearchParams(searchParams);
    if (searchValue) {
      newParams.set('search', searchValue);
    } else {
      newParams.delete('search');
    }

    setSearchParams(newParams);

    if (onFilterChange) {
      onFilterChange({ search: searchValue || undefined });
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleApplyFilters}
      elevation={1}
      sx={{
        p: 2,
        width: '100%',
        borderRadius: 0,
        bgcolor: 'background.paper',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="center"
      >
        <SearchAutocomplete
          key={currentSearchParam ?? 'empty'}
          initialValue={currentSearchParam}
          onSelectOption={(option) => {
            selectedOptionRef.current = option;
          }}
          onTextChange={(text) => {
            rawInputTextRef.current = text;
          }}
        />

        <Button
          type="submit"
          variant="contained"
          size="medium"
          startIcon={<FilterListIcon />}
          sx={{
            px: 3,
            py: 1.5,
            width: { xs: '100%', sm: 'auto' },
            whiteSpace: 'nowrap',
            fontWeight: 'bold',
            borderRadius: 0,
            textTransform: 'none',
          }}
        >
          Filtruj
        </Button>
      </Stack>
    </Paper>
  );
};