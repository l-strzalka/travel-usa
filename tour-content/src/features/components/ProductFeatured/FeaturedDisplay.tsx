import React, { memo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
} from '@mui/material';
import MapPinIcon from '@mui/icons-material/LocationOn';
import { useFeaturedTours } from '../../hooks/useFeaturedTours';
import { FeaturedToursSkeleton } from './ui/FeaturedToursSkeleton';
import { resolveImageUrl } from '../../../utils/imageUrl';

export const FeaturedTours: React.FC = memo(() => {
  const navigate = useNavigate();
  const { data: tours, isLoading, isError } = useFeaturedTours({ limit: 4 });

  if (isLoading) {
    return <FeaturedToursSkeleton />;
  }

  if (isError || !tours || tours.length === 0) {
    return null; // Wersja produkcyjna: po prostu nie renderuje pustej sekcji lub pokazuje delikatny Empty State
  }

  return (
    <Box component='section' sx={{ padding: '0 50px', bgcolor: '#ffffff' }}>
      <Container maxWidth='xl'>
        {/* Nagłówek H2 zgodnie z wymaganiami */}
        <Typography
          variant='h4'
          component='h2'
          sx={{
            fontWeight: 600,
            fontSize: 40,
            color: 'text.primary',
            mt: 5,
            mb: 2,
            letterSpacing: '-0.02em',
            position: 'relative',
          }}
        >
          Polecane Kierunki Wypraw
        </Typography>
        <Typography
          variant='h6'
          component='h3'
          sx={{ mb: 5, fontSize: 17.6, color: '#666' }}
        >
          Perfekcyjne dopracowane kierunki wypraw
        </Typography>

        {/* Siatka 1 kolumny x 1 wiersze */}
        <Grid container spacing={4} sx={{ py: 4 }}>
          {tours.map((tour) => (
            <Grid
              item
              xs={12}
              key={tour.id}
              sx={{ px: '0 !important', py: '2px!important' }}
            >
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 0,
                  border: '1px solid',
                  borderColor: 'grey.100',
                  position: 'relative', // Kluczowe dla pozycjonowania nakładki
                  overflow: 'hidden', // Zapobiega wystawaniu nakładki poza krawędzie
                  // Gdy najedziemy na kartę, aktywujemy nakładkę po jej klasie
                  '&:hover .card-overlay': {
                    opacity: 1,
                  },
                }}
              >
                <CardActionArea
                  component={Link}
                  to={tour.slug}
                  sx={{
                    display: 'flex',
                    /* Pionowo na telefonach, poziomo od ekranów sm/md */
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'stretch',
                    height: '100%',
                    position: 'relative',
                  }}
                >
                  {/* Kontener na zdjęcie - responsywny i stały w rzędzie */}
                  <Box
                    sx={{
                      position: 'relative',
                      height: { xs: 220, sm: 'auto', lg: 340 },
                      width: {
                        xs: '100%',
                        sm: '500px',
                        lg: '840px',
                      } /* Stała, elegancka szerokość na desktopie */,
                      flexShrink: 0 /* Zapobiega ściskaniu zdjęcia przez długi tekst */,
                    }}
                  >
                    {tour.imageUrl ? (
                      <CardMedia
                        component='img'
                        image={resolveImageUrl(tour.imageUrl)}
                        alt={tour.name}
                        loading='lazy'
                        sx={{
                          height: '100%',
                          width: '100%',
                          objectFit:
                            'cover' /* Idealne docięcie bez rozciągania */,
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                          bgcolor: 'grey.50',
                          color: 'text.disabled',
                        }}
                      >
                        <Typography variant='body2'>
                          Brak zdjęcia oferty
                        </Typography>
                      </Box>
                    )}

                    {/* NAKŁADKA PRZYCIEMNIAJĄCA - PRZENIESIONA DO ŚRODKA BOXA ZDJĘCIA */}
                    <Box
                      className='card-overlay'
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        bgcolor: 'rgba(0, 0, 0, 0.45)', // Stopień przyciemnienia
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0, // Domyślnie ukryta
                        transition: 'opacity 0.3s ease',
                        zIndex: 2,
                      }}
                    >
                      {/* RAMKA "ZOBACZ" */}
                      <Box
                        component='span'
                        sx={{
                          px: 4,
                          py: 2,
                          border: '1px solid',
                          borderColor: '#ffffff',
                          color: '#ffffff',
                          fontWeight: 200,
                          fontSize: '0.775rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          bgcolor: 'transparent',
                          transition:
                            'background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease',
                          '&:hover': {
                            bgcolor: 'primary.main', // Zmiana tła przy najechaniu bezpośrednio na "Zobacz"
                            borderColor: 'primary.main',
                            color: '#ffffff',
                          },
                        }}
                      >
                        Zobacz
                      </Box>
                    </Box>
                  </Box>

                  {/* Treść karty */}
                  <CardContent
                    sx={{
                      p: 3,
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      {/* Tytuł */}
                      <Typography
                        variant='h5'
                        component='h3'
                        sx={{
                          fontWeight: 700,
                          mb: 2,
                          lineHeight: 1.3,
                          color: 'text.primary',
                        }}
                      >
                        {tour.name}
                      </Typography>

                      {/* Cel podróży */}
                      {tour.location && (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 0.5,
                            mb: 1.5,
                          }}
                        >
                          <MapPinIcon
                            sx={{ color: 'primary.main', fontSize: 18 }}
                          />
                          <Typography
                            variant='subtitle2'
                            sx={{ color: 'text.secondary', fontWeight: 600 }}
                          >
                            {tour.location}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Cena */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'baseline',
                        justifyContent: 'space-between',
                        mt: 2,
                      }}
                    >
                      <Typography
                        variant='caption'
                        sx={{
                          color: 'text.disabled',
                          textTransform: 'uppercase',
                          fontWeight: 'bold',
                        }}
                      >
                        Cena od
                      </Typography>
                      <Typography
                        variant='h6'
                        sx={{ fontWeight: 800, color: 'primary.main' }}
                      >
                        {tour.price.toLocaleString()} PLN
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
});

FeaturedTours.displayName = 'FeaturedTours';
