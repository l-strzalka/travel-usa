import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useInfiniteExploreTours } from '@/features/hooks/useInfiniteExploreTours';
import { ExploreProductCard } from './ExploreProductCard';
import { ExploreArchiveSkeleton } from './ExploreArchiveSkeleton';

export const ExploreArchive = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteExploreTours({ limit: 4 });

  // Spłaszczenie stron z TanStack Query w jedną listę wycieczek
  const allProducts = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <Box component="section" sx={{ pb: 8, bgcolor: 'background.default' }}>
      {/* 1. BANNER NA GÓRZE - Szerokie zdjęcie z sekcją pod przyszły szukaj */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 260, md: 380 },
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 6,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center', color: '#ffffff' }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: 28, md: 44 },
              mb: 2,
              letterSpacing: '-0.02em',
            }}
          >
            Odkryj Wyjątkowe Wyprawy
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              fontSize: { xs: 15, md: 18 },
              opacity: 0.9,
              mb: 3,
            }}
          >
            Przeglądaj najnowsze oferty i znajdź podróż swoich marzeń
          </Typography>

          {/* MIEJSCE NA FORMULARZ WYSZUKIWARKI (Zostanie zaimplementowane w przyszłości) */}
          <Box
            id="search-form-placeholder"
            sx={{
              p: 2,
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              display: 'inline-block',
              width: '100%',
              maxWidth: 600,
            }}
          >
            <Typography variant="body2" sx={{ fontStyle: 'italic', opacity: 0.8 }}>
              Formularz wyszukiwania (wkrótce)
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* 2. SIATKA Z PRODUKTAMI */}
      <Container maxWidth="xl">
        {/* Stan Ładowania Początkowego */}
        {isLoading && <ExploreArchiveSkeleton count={8} />}

        {/* Stan Błędu */}
        {isError && (
          <Alert severity="error" sx={{ my: 4 }}>
            Nie udało się załadować ofert: {error?.message || 'Błąd połączenia z serwerem.'}
          </Alert>
        )}

        {/* Stan Pusty (Brak wycieczek) */}
        {!isLoading && !isError && allProducts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Brak dostępnych ofert do wyświetlenia.
            </Typography>
          </Box>
        )}

        {/* Renderowanie Siatki: 4 kolumny (lg=3), 2 kolumny (sm=6), 1 kolumna (xs=12) */}
        {!isLoading && allProducts.length > 0 && (
          <>
            <Grid container spacing={3}>
              {allProducts.map((product, idx) => (
                <Grid item xs={12} sm={6} lg={3} key={`${product.id}-${idx}`}>
                  <ExploreProductCard product={product} />
                </Grid>
              ))}
            </Grid>

            {/* 3. PRZYCISK ZAŁADUJ WIĘCEJ */}
            {hasNextPage && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  sx={{
                    px: 5,
                    py: 1.5,
                    fontWeight: 700,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                  }}
                >
                  {isFetchingNextPage ? (
                    <>
                      <CircularProgress size={20} color="inherit" sx={{ mr: 1.5 }} />
                      Ładowanie...
                    </>
                  ) : (
                    'Załaduj więcej'
                  )}
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};