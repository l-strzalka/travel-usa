import React from 'react';
import { Grid2, Box, Skeleton, Container } from '@mui/material';

export const FeaturedToursSkeleton: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Skeleton variant="text" width="40%" height={50} sx={{ mb: 4 }} />
      <Grid2 container spacing={4}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid2 item xs={12} md={6} key={index}>
            <Box sx={{ border: '1px solid #f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
              <Skeleton variant="rectangular" width="100%" height={240} />
              <Box sx={{ p: 3 }}>
                <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="80%" height={32} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="40%" height={28} />
              </Box>
            </Box>
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
};