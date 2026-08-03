// tour-content/src/pages/ExplorePage.tsx
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ExploreMap } from '@/features/components/ExploreMap/ExploreMap';
import {
  TourOfferMapItem,
  TourRoute,
} from '@/features/components/ExploreMap/types';
import { Stack } from '@mui/material';

// Mockowane dane dla ofert
const MOCK_OFFERS: TourOfferMapItem[] = [
  {
    id: '1',
    title: 'Route 66 Adventure',
    price: 2999,
    coordinates: { lat: 41.8781, lng: -87.6298 },
  },
  {
    id: '2',
    title: 'Grand Canyon Explorer',
    price: 1599,
    coordinates: { lat: 36.1699, lng: -115.1398 },
  },
  {
    id: '3',
    title: 'California Dreamin',
    price: 3499,
    coordinates: { lat: 34.0522, lng: -118.2437 },
  },
];

// Mockowane dane dla tras pomiędzy punktami
const MOCK_ROUTES: TourRoute[] = [
  {
    id: 'route-1',
    path: [
      [41.8781, -87.6298], // Chicago
      [36.1699, -115.1398], // Las Vegas
      [34.0522, -118.2437], // Los Angeles
    ],
    color: '#d49800',
  },
];

export const ExplorePage = () => {
  return (
    <Container maxWidth='xl' sx={{ p: 8 }}>
      <Typography
        variant='h4'
        component='h1'
        fontWeight='bold'
        sx={{ mb: 3, color: '#d49800' }}
      >
        Eksploruj Amerykę
      </Typography>
      <Stack direction={'row'} spacing={2}>
        <Box sx={{ flex: 1, flexDirection: 'column', gap: 4 }}>
          <ExploreMap offers={MOCK_OFFERS} routes={MOCK_ROUTES} />
        </Box>
        <Box sx={{ flex: 1, flexDirection: 'column', gap: 4 }}>
           
        </Box>
      </Stack>
    </Container>
  );
};
