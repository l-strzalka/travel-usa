import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useMemo, useCallback, memo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInfiniteExploreTours } from '@/features/hooks/useInfiniteExploreTours';
import { ExploreProductCard } from './ExploreProductCard';
import { ExploreArchiveSkeleton } from './ExploreArchiveSkeleton';
import { CatalogFilterBar } from './CatalogFilterBar';
import { ExploreFilters } from '../types/explore.types';
import { SearchForm } from '../../SearchForm/SearchForm';

// -------------------------------------------------------------------------
// 1. ZAMROŻONY BANNER GŁÓWNY (Brak re-renderów przy stabilnym propie)
// -------------------------------------------------------------------------
interface ExploreHeroBannerProps {
  onSearchSubmit: (newFilters: { search?: string; location?: string }) => void;
}

const ExploreHeroBanner = memo(({ onSearchSubmit }: ExploreHeroBannerProps) => {
  return (
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

        <SearchForm
          variant="hero"
          onSearchSubmit={onSearchSubmit}
        />
      </Container>
    </Box>
  );
});

ExploreHeroBanner.displayName = 'ExploreHeroBanner';

// -------------------------------------------------------------------------
// 2. GŁÓWNY KOMPONENT ARCHIWUM
// -------------------------------------------------------------------------
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

  const {
    data,
    isLoading,
    isPlaceholderData,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteExploreTours({ limit: 8, filters });

  // 3. STAŁA REFERENCJA FUNKCJI (Zapobiega re-renderowaniu ExploreHeroBanner)
  const handleFilterChange = useCallback((newFilters: Partial<ExploreFilters>) => {
    setSearchParams(
      (prevParams) => {
        const updatedParams = new URLSearchParams(prevParams);

        Object.entries(newFilters).forEach(([key, value]) => {
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
  }, [setSearchParams]);

  const handleResetFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const allProducts = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <Box component="section" sx={{ pb: 8, bgcolor: 'background.default' }}>
      {/* Baner dostaje idealnie zachowaną referencję funkcji -> zero re-renderów w Profilerze */}
      <ExploreHeroBanner onSearchSubmit={handleFilterChange} />

      <Container maxWidth="xl">
        <CatalogFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {isLoading && <ExploreArchiveSkeleton count={8} />}

        {isError && (
          <Alert severity="error" sx={{ my: 4 }}>
            Nie udało się załadować ofert:{' '}
            {error?.message || 'Błąd połączenia z serwerem.'}
          </Alert>
        )}

        {!isLoading && !isError && allProducts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Brak dostępnych ofert spełniających kryteria wyszukiwania.
            </Typography>
          </Box>
        )}

        {!isLoading && allProducts.length > 0 && (
          <>
            <Grid
              container
              spacing={3}
              sx={{
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