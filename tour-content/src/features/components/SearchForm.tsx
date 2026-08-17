import React, { useState, useMemo } from 'react';
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

// Dedykowany typ dla sugerowanych propozycji
export interface SearchOption {
  category: string; // np. "Luizjana", "New York"
  label: string;    // np. "Nowy Orlean", "Nowy Jork"
  id?: number;
}

interface SearchFormProps {
  /** Opcjonalna funkcja wywoływana przy zatwierdzeniu (np. do zamknij modal lub zaktualizuj parenta) */
  onSearchSubmit?: (filters: { search?: string; location?: string }) => void;
  /** Czy pokazywać kompaktową wersję (np. do nagłówka) */
  variant?: 'hero' | 'compact';
}

export const SearchForm = ({
  onSearchSubmit,
  variant = 'hero',
}: SearchFormProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Lokalny stan wpisywanej wartości w polu podpowiedzi
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState<SearchOption | string | null>(
    searchParams.get('location') || searchParams.get('search') || null
  );

  // Pobieranie propozycji z API dopiero gdy użytkownik wpisze co najmniej 3 znaki
  const { data: suggestions = [], isLoading } = useQuery<SearchOption[]>({
    queryKey: ['search-suggestions', inputValue],
    queryFn: async () => {
      if (inputValue.trim().length < 3) return [];
      
      // Zgodnie z Twoim setupem Axios z App.tsx komunikujemy się z backendem NestJS
      const response = await axios.get<SearchOption[]>(
        `${API_URL}/products/suggestions`,
        { params: { q: inputValue } }
      );
      return response.data;
    },
    enabled: inputValue.trim().length >= 3,
    staleTime: 1000 * 60 * 5, // Cache'ujemy sugestie na 5 minut
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    let searchValue = '';
    let locationValue = '';

    if (typeof selectedOption === 'string') {
      searchValue = selectedOption;
    } else if (selectedOption) {
      locationValue = selectedOption.label;
    } else if (inputValue) {
      searchValue = inputValue;
    }

    const params = new URLSearchParams();
    if (searchValue) params.set('search', searchValue);
    if (locationValue) params.set('location', locationValue);

    // Jeśli rodzic przekazał funkcję callback (np. w ExploreArchive do płynnego przeładowania)
    if (onSearchSubmit) {
      onSearchSubmit({
        search: searchValue || undefined,
        location: locationValue || undefined,
      });
    } else {
      // Domyślne zachowanie na Stronie Głównej / w Headerze: Przekierowanie do /explore z parametrami w URL
      navigate(`/explore?${params.toString()}`);
    }
  };

  return (
    <Paper
      component="form"
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
        alignItems="center"
      >
        <Autocomplete
          fullWidth
          freeSolo
          options={suggestions}
          loading={isLoading}
          // Kluczowe wymaganie: Grupowanie podpowiedzi wg Stanu/Kategorii (np. Luizjana -> Nowy Orlean)
          groupBy={(option) =>
            typeof option === 'string' ? 'Ogólne' : option.category
          }
          getOptionLabel={(option) =>
            typeof option === 'string' ? option : option.label
          }
          value={selectedOption}
          onChange={(_event, newValue) => {
            setSelectedOption(newValue);
          }}
          onInputChange={(_event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          noOptionsText={
            inputValue.length < 3
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
                  <InputAdornment position="start">
                    <LocationOnIcon color="action" />
                  </InputAdornment>
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
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
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
  );
};