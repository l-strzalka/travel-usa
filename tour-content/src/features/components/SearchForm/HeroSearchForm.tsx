import React, { useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Paper, Box } from '@mui/material';
import { SearchAutocomplete, SearchOption } from './SearchAutocomplete';

export const HeroSearchForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialSearchParam =
    searchParams.get('location') || searchParams.get('search') || null;

  const rawInputTextRef = useRef<string>(
    typeof initialSearchParam === 'string' ? initialSearchParam : ''
  );

  const normalizeSearchValue = (value: string) =>
    value.trim().replace(/\s+/g, ' ');

  const executeSearch = (value: string) => {
    const normalized = normalizeSearchValue(value);
    const params = new URLSearchParams();
    
    if (normalized) {
      params.set('search', normalized);
    }

    navigate(`/explore?${params.toString()}`);
  };

  const handleSelectOption = (option: SearchOption | string | null) => {
    if (!option) return;

    if (typeof option === 'string') {
      executeSearch(option);
    } else {
      executeSearch(option.label);
    }
  };

  const handleTextChange = (text: string) => {
    rawInputTextRef.current = text;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rawInputTextRef.current) {
      executeSearch(rawInputTextRef.current);
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={4}
      sx={{
        p: { xs: 2, md: 2.5 },
        width: '100%',
        maxWidth: 430,
        position: 'relative',
        top: '4.2cap',
        mx: 'auto',
        borderRadius: 0,
        bgcolor: 'red',

      }}
    >
      <Box sx={{ width: '100%', }}>
        <SearchAutocomplete
          initialValue={initialSearchParam}
          onSelectOption={handleSelectOption}
          onTextChange={handleTextChange}
        />
      </Box>
    </Paper>
  );
};