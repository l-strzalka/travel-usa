import React, { useEffect, useState, Profiler, useMemo, memo } from 'react';
import { Autocomplete, TextField, InputAdornment, Box, Typography, TextFieldProps } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../../../config';

export interface SearchOption {
  category: string;
  label: string;
  id?: number;
}

interface SearchAutocompleteProps {
  initialValue: SearchOption | string | null;
  onSelectOption: (option: SearchOption | string | null) => void;
  onTextChange: (text: string) => void;
}

// -------------------------------------------------------------
// OPTYMALIZACJA POZIOM 3: Wydzielony i zamrożony TextField
// -------------------------------------------------------------
const MemoizedSearchInput = memo((props: TextFieldProps) => {
  return (
    <TextField
      {...props}
      placeholder="Gdzie chcesz pojechać? (np. Nowy Jork, Luizjana...)"
      variant="outlined"
    />
  );
});

// -------------------------------------------------------------
// METRYKI DLA DZIECKA (SearchAutocomplete)
// -------------------------------------------------------------
const childMetrics = {
  mountCount: 0,
  updateCount: 0,
  totalRenderTimeMs: 0,
  maxSingleRenderMs: 0,
};

let childPrintTimeout: NodeJS.Timeout | null = null;

const onChildRenderCallback = (
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number
) => {
  if (phase === 'mount') childMetrics.mountCount++;
  else childMetrics.updateCount++;

  childMetrics.totalRenderTimeMs += actualDuration;
  childMetrics.maxSingleRenderMs = Math.max(childMetrics.maxSingleRenderMs, actualDuration);

  if (childPrintTimeout) clearTimeout(childPrintTimeout);
  childPrintTimeout = setTimeout(() => {
    console.group(`👶 RAPORT DZIECKA: <${id} />`);
    console.table({
      'Liczba pierwszych wyrenderowań (Mount)': childMetrics.mountCount,
      'Liczba przeliczeń/re-renderów (Update)': childMetrics.updateCount,
      'Łączny czas spędzony w JS (ms)': childMetrics.totalRenderTimeMs.toFixed(3) + ' ms',
      'Średni czas 1 renderu (ms)': (childMetrics.totalRenderTimeMs / (childMetrics.mountCount + childMetrics.updateCount)).toFixed(3) + ' ms',
      'Najwolniejszy pojedynczy render (ms)': childMetrics.maxSingleRenderMs.toFixed(3) + ' ms',
    });
    console.groupEnd();
  }, 2000);
};
// -------------------------------------------------------------

const normalizeSearchValue = (value: string) => value.trim().replace(/\s+/g, ' ');

export const SearchAutocomplete = ({
  initialValue,
  onSelectOption,
  onTextChange,
}: SearchAutocompleteProps) => {
  const [inputValue, setInputValue] = useState(
    typeof initialValue === 'string' ? initialValue : initialValue?.label ?? ''
  );
  const [debouncedInput, setDebouncedInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<SearchOption | string | null>(initialValue);
  const [isLocked, setIsLocked] = useState(Boolean(initialValue));

  // Zapamiętanie ikony (Poziom 2)
  const startAdornmentMemo = useMemo(
    () => (
      <InputAdornment position="start">
        <LocationOnIcon color="action" />
      </InputAdornment>
    ),
    []
  );

  // Debounce wpisywanego tekstu (lokalny w dziecku)
  useEffect(() => {
    if (isLocked) return;

    const timer = window.setTimeout(() => {
      setDebouncedInput(normalizeSearchValue(inputValue));
    }, 300);

    return () => window.clearTimeout(timer);
  }, [inputValue, isLocked]);

  // Pobieranie wyłącza się, gdy tekst jest zablokowany lub ma mniej niż 3 znaki
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

  return (
    <Profiler id="SearchAutocomplete_Child" onRender={onChildRenderCallback}>
      <Autocomplete
        fullWidth
        freeSolo
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
          onSelectOption(newValue);

          if (newValue) {
            const textLabel = typeof newValue === 'string' ? newValue : newValue.label;
            setInputValue(textLabel);
            onTextChange(textLabel);
            setIsLocked(true);
          } else {
            setIsLocked(false);
          }
        }}
        onInputChange={(_event, newInputValue, reason) => {
          if (reason === 'reset') return;

          if (reason === 'input') {
            setIsLocked(false);
            setInputValue(newInputValue);
            onTextChange(newInputValue);

            if (!newInputValue.trim()) {
              setSelectedOption(null);
              onSelectOption(null);
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
          <MemoizedSearchInput
            {...params}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  {startAdornmentMemo}
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
              <Box component='li' key={key} {...optionProps}>
                {option}
              </Box>
            );
          }
          return (
            <Box
              component='li'
              key={key || option.id}
              {...optionProps}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <Typography variant='body1' sx={{ fontWeight: 600 }}>
                {option.label}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                Region: {option.category}
              </Typography>
            </Box>
          );
        }}
      />
    </Profiler>
  );
};