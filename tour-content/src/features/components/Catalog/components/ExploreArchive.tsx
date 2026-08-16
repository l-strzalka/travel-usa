import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  LinearProgress,
} from '@mui/material';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInfiniteExploreTours } from '@/features/hooks/useInfiniteExploreTours';
import { ExploreProductCard } from './ExploreProductCard';
import { ExploreArchiveSkeleton } from './ExploreArchiveSkeleton';
import { CatalogFilterBar } from './CatalogFilterBar';
import { ExploreFilters } from '../types/explore.types';

export const ExploreArchive = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Odczyt filtrów z adresu URL
  const filters: ExploreFilters = useMemo(() => {
    const search = searchParams.get('search') || undefined;
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || undefined;
    const sortOrderParam = searchParams.get('sortOrder');
    const location = searchParams.get('location') || undefined;

    return {
      search,
      minPrice: minPriceParam !== null ? Number(minPriceParam) : undefined,
      maxPrice: maxPriceParam !== null ? Number(maxPriceParam) : undefined,
      sortBy,
      sortOrder: (sortOrderParam as 'asc' | 'desc') || undefined,
      location,
    };
  }, [searchParams]);

  // 2. Pobieranie danych
  // - isLoading: PRAWDA tylko przy pierwszym ładowaniu (brak jakichkolwiek danych)
  // - isFetching: PRAWDA przy każdym zapytaniu w tle (np.zmiana filtrów, kolejna strona)
  // - isPlaceholderData: PRAWDA, gdy na ekranie widzimy stare wyniki podczas ładowania nowych
  const {
    data,
    isLoading,
    isFetching,
    isPlaceholderData,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteExploreTours({ limit: 8, filters });

  // 3. Obsługa URL i filtrów
  const handleFilterChange = (newFilters: Partial<ExploreFilters>) => {
    setSearchParams(
      (prevParams) => {
        const updatedParams = new URLSearchParams(prevParams);
        const mergedFilters = { ...filters, ...newFilters };

        Object.entries(mergedFilters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            updatedParams.set(key, String(value));
          } else {
            updatedParams.delete(key);
          }
        });

        return updatedParams;
      },
      { replace: true }
    );
  };

  const handleResetFilters = () => {
    setSearchParams({}, { replace: true });
  };

  const allProducts = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <Box component="section" sx={{ pb: 8, bgcolor: 'background.default' }}>
      {/* BANNER GŁÓWNY */}
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
            <Typography
              variant="body2"
              sx={{ fontStyle: 'italic', opacity: 0.8 }}
            >
              Formularz wyszukiwania (wkrótce)
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* SEKCJA KATALOGU I FILTRÓW */}
      <Container maxWidth="xl">
        <CatalogFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* SUBTELNY PASEK ŁADOWANIA NAD KARTAMI PODCZAS ZMIANY FILTRÓW */}
        <Box sx={{ height: 4, mb: 2, mt: 1, borderRadius: 2, overflow: 'hidden' }}>
          {isFetching && !isFetchingNextPage && <LinearProgress />}
        </Box>

        {/* 1. SKELETON: Pokazuje się TYLKO przy pierwszym ładowaniu aplikacji */}
        {isLoading && <ExploreArchiveSkeleton count={8} />}

        {/* 2. BŁĄD */}
        {isError && (
          <Alert severity="error" sx={{ my: 4 }}>
            Nie udało się załadować ofert:{' '}
            {error?.message || 'Błąd połączenia z serwerem.'}
          </Alert>
        )}

        {/* 3. BRAK WYNIKÓW */}
        {!isLoading && !isError && allProducts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Brak dostępnych ofert spełniających kryteria wyszukiwania.
            </Typography>
          </Box>
        )}

        {/* 4. LISTA PRODUKTÓW Z EFEKTEM PRZYCIEMNIENIA */}
        {!isLoading && allProducts.length > 0 && (
          <>
            <Grid
              container
              spacing={3}
              sx={{
                // Przyciemnia karty i dodaje łagodne przejście przy pobieraniu nowych filtrów
                opacity: isPlaceholderData ? 0.5 : 1,
                transition: 'opacity 0.25s ease-in-out',
                pointerEvents: isPlaceholderData ? 'none' : 'auto',
              }}
            >
              {allProducts.map((product, idx) => (
                <Grid item xs={12} sm={6} lg={3} key={`${product.id}-${idx}`}>
                  <ExploreProductCard product={product} />
                </Grid>
              ))}
            </Grid>

            {/* PRZYCISK "ZAŁADUJ WIĘCEJ" */}
            {hasNextPage && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage || isPlaceholderData}
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
                      <CircularProgress
                        size={20}
                        color="inherit"
                        sx={{ mr: 1.5 }}
                      />
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