import React, { useRef, Profiler } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Paper, Stack, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { SearchAutocomplete, SearchOption } from './SearchAutocomplete';

interface SearchFormProps {
  onSearchSubmit?: (filters: { search?: string; location?: string }) => void;
  variant?: 'hero' | 'compact';
}

// -------------------------------------------------------------
// METRYKI DLA RODZICA (SearchForm)
// -------------------------------------------------------------
const parentMetrics = {
  mountCount: 0,
  updateCount: 0,
  totalRenderTimeMs: 0,
  maxSingleRenderMs: 0,
};

let parentPrintTimeout: NodeJS.Timeout | null = null;

const onParentRenderCallback = (
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
) => {
  if (phase === 'mount') parentMetrics.mountCount++;
  else parentMetrics.updateCount++;

  parentMetrics.totalRenderTimeMs += actualDuration;
  parentMetrics.maxSingleRenderMs = Math.max(
    parentMetrics.maxSingleRenderMs,
    actualDuration,
  );

  if (parentPrintTimeout) clearTimeout(parentPrintTimeout);
  parentPrintTimeout = setTimeout(() => {
    console.group(`📊 RAPORT RODZICA: <${id} />`);
    console.table({
      'Liczba pierwszych wyrenderowań (Mount)': parentMetrics.mountCount,
      'Liczba przeliczeń/re-renderów (Update)': parentMetrics.updateCount,
      'Łączny czas spędzony w JS (ms)':
        parentMetrics.totalRenderTimeMs.toFixed(3) + ' ms',
      'Średni czas 1 renderu (ms)':
        (
          parentMetrics.totalRenderTimeMs /
          (parentMetrics.mountCount + parentMetrics.updateCount)
        ).toFixed(3) + ' ms',
      'Najwolniejszy pojedynczy render (ms)':
        parentMetrics.maxSingleRenderMs.toFixed(3) + ' ms',
    });
    console.groupEnd();
  }, 2000);
};
// -------------------------------------------------------------

export const SearchForm = ({
  onSearchSubmit,
  variant = 'hero',
}: SearchFormProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialSearchParam =
    searchParams.get('location') || searchParams.get('search') || null;

  // Używamy useRef, aby aktualizacja wartości z inputa NIE powodowała re-renderu SearchForm!
  const selectedOptionRef = useRef<SearchOption | string | null>(
    initialSearchParam,
  );
  const rawInputTextRef = useRef<string>(
    typeof initialSearchParam === 'string' ? initialSearchParam : '',
  );

  const normalizeSearchValue = (value: string) =>
    value.trim().replace(/\s+/g, ' ');

  const handleSearch = (e?: React.FormEvent) => {
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

    const params = new URLSearchParams();
    if (searchValue) params.set('search', searchValue);

    if (onSearchSubmit) {
      onSearchSubmit({
        search: searchValue || undefined,
      });
    } else {
      navigate(`/explore?${params.toString()}`);
    }
  };

  return (
    <Profiler id='SearchForm_Parent' onRender={onParentRenderCallback}>
      <Paper
        component='form'
        onSubmit={handleSearch}
        elevation={variant === 'hero' ? 4 : 1}
        sx={{
          p: variant === 'hero' ? { xs: 2, md: 2.5 } : 1,
          width: '100%',
          maxWidth: variant === 'hero' ? 800 : '100%',
          mx: 'auto',
          borderRadius: variant === 'hero' ? 3 : 1,
          bgcolor: 'background.paper',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems='center'
        >
          <SearchAutocomplete
            initialValue={initialSearchParam}
            onSelectOption={(option) => {
              selectedOptionRef.current = option;
            }}
            onTextChange={(text) => {
              rawInputTextRef.current = text;
            }}
          />

          <Button
            type='submit'
            variant='contained'
            size='large'
            startIcon={<SearchIcon />}
            sx={{
              px: 4,
              py: 1.8,
              width: { xs: '100%', sm: 'auto' },
              whiteSpace: 'nowrap',
              fontWeight: 'bold',
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            Szukaj
          </Button>
        </Stack>
      </Paper>
    </Profiler>
  );
};
