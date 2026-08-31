import React, { useEffect, useState, Profiler } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Paper,
  Stack,
  TextField,
  Button,
  Autocomplete,
  InputAdornment,
  Box,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../../config';

export interface SearchOption {
  category: string;
  label: string;
  id?: number;
}

interface SearchFormProps {
  onSearchSubmit?: (filters: { search?: string; location?: string }) => void;
  variant?: 'hero' | 'compact';
}

// -------------------------------------------------------------
// MECHANIZM ZBIERANIA METRYK (LICZBY I MILISEKUNDY)
// -------------------------------------------------------------
const metrics = {
  mountCount: 0,
  updateCount: 0,
  totalRenderTimeMs: 0,
  maxSingleRenderMs: 0,
};

let printTimeout: NodeJS.Timeout | null = null;

const onRenderCallback = (
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
) => {
  if (phase === 'mount') {
    metrics.mountCount++;
  } else {
    metrics.updateCount++;
  }

  metrics.totalRenderTimeMs += actualDuration;
  metrics.maxSingleRenderMs = Math.max(
    metrics.maxSingleRenderMs,
    actualDuration,
  );

  if (printTimeout) clearTimeout(printTimeout);
  printTimeout = setTimeout(() => {
    console.group(`📊 RAPORT WYDAJNOŚCI DLA: <${id} />`);
    console.table({
      'Liczba pierwszych wyrenderowań (Mount)': metrics.mountCount,
      'Liczba przeliczeń/re-renderów (Update)': metrics.updateCount,
      'Łączny czas spędzony w JS (ms)':
        metrics.totalRenderTimeMs.toFixed(3) + ' ms',
      'Średni czas 1 renderu (ms)':
        (
          metrics.totalRenderTimeMs /
          (metrics.mountCount + metrics.updateCount)
        ).toFixed(3) + ' ms',
      'Najwolniejszy pojedynczy render (ms)':
        metrics.maxSingleRenderMs.toFixed(3) + ' ms',
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

  const normalizeSearchValue = (value: string) =>
    value.trim().replace(/\s+/g, ' ');

  const initialSearch = searchParams.get('location') || searchParams.get('search') || '';

  const [inputValue, setInputValue] = useState(initialSearch);
  const [debouncedInput, setDebouncedInput] = useState(initialSearch);
  const [selectedOption, setSelectedOption] = useState<SearchOption | string | null>(
    initialSearch || null
  );

  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (isLocked) return;

    const timer = window.setTimeout(() => {
      setDebouncedInput(normalizeSearchValue(inputValue));
    }, 300);

    return () => window.clearTimeout(timer);
  }, [inputValue, isLocked]);

  const { data: suggestions = [] } = useQuery<SearchOption[]>({
    queryKey: ['search-suggestions', debouncedInput],
    queryFn: async () => {
      if (debouncedInput.length < 3) return [];

      const response = await axios.get<SearchOption[]>(
        `${API_URL}/products/suggestions`,
        { params: { q: debouncedInput } },
      );
      return response.data;
    },
    enabled: !isLocked && debouncedInput.length >= 3,
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();

    const latestInput = normalizeSearchValue(inputValue);
    let searchValue = '';

    if (typeof selectedOption === 'string') {
      searchValue = normalizeSearchValue(selectedOption);
    } else if (selectedOption) {
      searchValue = normalizeSearchValue(selectedOption.label);
    } else if (latestInput) {
      searchValue = latestInput;
    }

    const params = new URLSearchParams();
    if (searchValue) params.set('search', searchValue);

    setIsLocked(false);

    if (onSearchSubmit) {
      onSearchSubmit({
        search: searchValue || undefined,
      });
    } else {
      navigate(`/explore?${params.toString()}`);
    }
  };

  return (
    <Profiler id="SearchForm" onRender={onRenderCallback}>
      <form onSubmit={handleSearch}>
        <Paper
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
            alignItems="center"
          >
            <Autocomplete
              fullWidth
              freeSolo
              disableClearable={false}
              options={suggestions}
              inputValue={inputValue}
              value={selectedOption}
              groupBy={(option) =>
                typeof option === 'string' ? 'Ogólne' : option.category
              }
              getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.label
              }
              onChange={(_event, newValue) => {
                setSelectedOption(newValue);

                if (newValue) {
                  const textLabel =
                    typeof newValue === 'string' ? newValue : newValue.label;
                  setInputValue(textLabel);
                  setIsLocked(true);
                } else {
                  // Wyczyszczenie pola (kliknięcie przycisku X)
                  setInputValue('');
                  setDebouncedInput('');
                  setSelectedOption(null);
                  setIsLocked(false);
                }
              }}
              onInputChange={(_event, newInputValue, reason) => {
                // Reagujemy tylko na wpisywanie z klawiatury
                if (reason === 'input') {
                  setIsLocked(false);
                  setInputValue(newInputValue);
                  if (!newInputValue.trim()) {
                    setSelectedOption(null);
                    setDebouncedInput('');
                  }
                }
              }}
              isOptionEqualToValue={(option, value) => {
                if (typeof option === 'string' && typeof value === 'string') {
                  return option === value;
                }
                if (typeof option === 'string' || typeof value === 'string') {
                  return false;
                }
                return option.label === value.label;
              }}
              noOptionsText={
                debouncedInput.length < 3
                  ? 'Wpisz co najmniej 3 znaki...'
                  : 'Brak pasujących kierunków'
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Gdzie chcesz pojechać? (np. Nowy Jork, Luizjana...)"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <LocationOnIcon color="action" />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                if (typeof option === 'string') {
                  return (
                    <Box component="li" key={key} {...optionProps}>
                      {option}
                    </Box>
                  );
                }
                return (
                  <Box
                    component="li"
                    key={key || option.id}
                    {...optionProps}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {option.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Region: {option.category}
                    </Typography>
                  </Box>
                );
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
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
      </form>
    </Profiler>
  );
};