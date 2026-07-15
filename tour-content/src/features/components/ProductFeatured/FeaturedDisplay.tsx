import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Box, 
  Typography, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActionArea 
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
    <Box component="section" sx={{ py: 8, bgcolor: '#ffffff' }}>
      <Container maxWidth="lg">
        {/* Nagłówek H2 zgodnie z wymaganiami */}
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            fontWeight: 800, 
            color: 'text.primary', 
            mb: 5, 
            letterSpacing: '-0.02em',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -12,
              left: 0,
              width: 60,
              height: 4,
              bgcolor: 'primary.main',
              borderRadius: 2
            }
          }}
        >
          Polecane Kierunki Wypraw
        </Typography>

        {/* Siatka 2 kolumny x 2 wiersze */}
        <Grid container spacing={4}>
          {tours.map((tour) => (
            <Grid item xs={12} md={6} key={tour.id}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 5, 
                  border: '1px solid', 
                  borderColor: 'grey.100',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 12px 24px -10px rgba(0,0,0,0.08)'
                  }
                }}
              >
                <CardActionArea onClick={() => navigate(`${tour.slug}`)}>
                  {/* Miniatura zdjęcia */}
                  <Box sx={{ position: 'relative', height: 240, bgcolor: 'grey.100' }}>
                    {tour.imageUrl ? (
                      <CardMedia
                        component="img"
                        image={resolveImageUrl(tour.imageUrl)}
                        alt={tour.name}
                        loading="lazy"
                        sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.disabled' }}>
                        <Typography variant="body2">Brak zdjęcia oferty</Typography>
                      </Box>
                    )}
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    {/* Cel podróży */}
                    {tour.location && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                        <MapPinIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                          {tour.location}
                        </Typography>
                      </Box>
                    )}

                    {/* Tytuł */}
                    <Typography 
                      variant="h5" 
                      component="h3" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 2, 
                        lineHeight: 1.3,
                        color: 'text.primary' 
                      }}
                    >
                      {tour.name}
                    </Typography>

                    {/* Cena */}
                    <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ color: 'text.disabled', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        Cena od
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
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