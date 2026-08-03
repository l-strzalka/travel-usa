// tour-content/src/components/ui/PlacePageSkeleton.tsx

import {
  Box,
  Container,
  Grid,
  Paper,
  Skeleton,
  Divider,
  Stack,
} from '@mui/material';

export const PlacePageSkeleton = () => {
  return (
    <Box component="main" sx={{ bgcolor: 'background.default', pb: 8 }}>
      {/* 1. HERO SECTION SKELETON */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: 'grey.300',
          pt: 3,
          pb: 8,
          minHeight: 500,
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
        }}
      >
        <Container maxWidth="lg">
          {/* Breadcrumbs */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 4 }}>
            <Skeleton variant="text" width={90} height={24} />
            <Skeleton variant="text" width={10} height={24} />
            <Skeleton variant="text" width={70} height={24} />
            <Skeleton variant="text" width={10} height={24} />
            <Skeleton variant="text" width={150} height={24} />
          </Stack>

          {/* Treść w Hero */}
          <Box sx={{ maxWidth: 700, mt: 4 }}>
            {/* Kategoria */}
            <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
            
            {/* Nagłówek / Tytuł wycieczki */}
            <Skeleton variant="rectangular" width="90%" height={56} sx={{ borderRadius: 1, mb: 1 }} />
            <Skeleton variant="rectangular" width="60%" height={56} sx={{ borderRadius: 1, mb: 2 }} />

            {/* Lokalizacja */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="text" width={180} height={28} />
            </Stack>

            {/* Cena i Czas trwania */}
            <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 4 }}>
              <Skeleton variant="text" width={220} height={48} />
              <Skeleton variant="text" width={100} height={32} />
            </Stack>

            {/* Przycisk rezerwacji */}
            <Skeleton
              variant="rounded"
              width={240}
              height={52}
              sx={{ borderRadius: 2 }}
            />
          </Box>
        </Container>
      </Box>

      {/* 2. STICKY TABS SKELETON */}
      <Paper
        elevation={1}
        sx={{
          borderRadius: 0,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          py: 1.5,
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" spacing={4}>
            <Skeleton variant="text" width={120} height={36} />
            <Skeleton variant="text" width={100} height={36} />
            <Skeleton variant="text" width={110} height={36} />
            <Skeleton variant="text" width={80} height={36} />
          </Stack>
        </Container>
      </Paper>

      {/* 3. GŁÓWNA ZAWARTOŚĆ */}
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        {/* OPIS I HIGHLIGHTS */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {/* Lewa kolumna: Opis i ikony */}
          <Grid item xs={12} md={7}>
            <Skeleton variant="text" width="60%" height={40} sx={{ mb: 3 }} />
            
            {/* Akapity tekstu opisowego */}
            <Box sx={{ mb: 4 }}>
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="98%" height={20} />
              <Skeleton variant="text" width="95%" height={20} />
              <Skeleton variant="text" width="88%" height={20} />
              <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />

              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="92%" height={20} />
              <Skeleton variant="text" width="75%" height={20} />
            </Box>

            {/* Atrakcje (List z ikonami) */}
            <Skeleton variant="text" width="50%" height={32} sx={{ mb: 2 }} />
            <Stack spacing={2}>
              {[1, 2, 3, 4].map((item) => (
                <Stack key={item} direction="row" spacing={2} alignItems="center">
                  <Skeleton variant="circular" width={24} height={24} />
                  <Skeleton variant="text" width="80%" height={24} />
                </Stack>
              ))}
            </Stack>
          </Grid>

          {/* Prawa kolumna: Karta Szyta na miarę */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                bgcolor: 'action.hover',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Skeleton variant="text" width="70%" height={32} sx={{ mb: 2 }} />
              <Stack spacing={1.5}>
                {[1, 2, 3, 4, 5].map((feat) => (
                  <Stack key={feat} direction="row" spacing={2} alignItems="center">
                    <Skeleton variant="circular" width={20} height={20} />
                    <Skeleton variant="text" width="85%" height={20} />
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6 }} />

        {/* PLAN PODRÓŻY SKELETON */}
        <Box sx={{ mb: 8 }}>
          <Skeleton variant="text" width="30%" height={40} sx={{ mb: 4 }} />

          <Stack spacing={3}>
            {[1, 2, 3].map((step) => (
              <Paper
                key={step}
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 3,
                }}
              >
                {/* Dzień */}
                <Skeleton variant="text" width={80} height={30} />
                
                {/* Zawartość etapu */}
                <Box sx={{ flexGrow: 1 }}>
                  <Skeleton variant="text" width="50%" height={28} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="90%" height={20} />
                  <Skeleton variant="text" width="70%" height={20} />
                </Box>
              </Paper>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default PlacePageSkeleton;