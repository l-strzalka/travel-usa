// tour-content/src/pages/PlacePage.tsx
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Product, CalculatorState } from '../features/components/ProductDisplay/types/products-types';
import { PlacePageSkeleton } from '../features/components/ProductDisplay/ui/PlacePageSkeleton';
import { resolveImageUrl } from '../utils/imageUrl';

// Importy Material UI
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  Button,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Divider,
} from '@mui/material';

// Importy ikon Material UI
import MapPinIcon from '@mui/icons-material/LocationOn';
import UsersIcon from '@mui/icons-material/People';
import ShieldCheckIcon from '@mui/icons-material/Security';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import XCircleIcon from '@mui/icons-material/Cancel';
import CompassIcon from '@mui/icons-material/Explore';
import usaBackground from '../assets/usa-background.png';

const API_URL = 'http://localhost:3000';

export const PlacePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // 1. Definicja stanu lokalnego dla kalkulatora ceny w locie
  const [calcState, setCalcState] = useState<CalculatorState>({
    participants: 1,
    insuranceType: 'standard',
    hasExtendedEquipment: false,
    hasVIPTransfer: false,
  });

  // 2. Pobieranie danych z wykorzystaniem TanStack Query v5+ / React 19
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['product', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Slug is required');
      const response = await axios.get<Product>(`${API_URL}/products/${slug}`);
      return response.data;
    },
    enabled: !!slug,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minut cache'owania
  });

  // 3. Memoizowane obliczenia kalkulatora (brak zbędnych re-renderów)
  const calculatedPrices = useMemo(() => {
    if (!product) return { basePrice: 0, additions: 0, total: 0 };

    const basePrice = product.price * calcState.participants;
    let additions = 0;

    // Ubezpieczenie
    if (calcState.insuranceType === 'standard') {
      additions += 150 * calcState.participants;
    } else if (calcState.insuranceType === 'premium') {
      additions += 350 * calcState.participants;
    }

    // Sprzęt turystyczny
    if (calcState.hasExtendedEquipment) {
      additions += 200 * calcState.participants;
    }

    // Transfer VIP
    if (calcState.hasVIPTransfer) {
      additions += 500; // Opłata jednorazowa
    }

    return {
      basePrice,
      additions,
      total: basePrice + additions,
    };
  }, [product, calcState]);

  // Obsługa akcji przejścia do kasy
  const handleBooking = () => {
    if (!product) return;
    // Przekazujemy parametry konfiguracji rezerwacji do checkoutu za pomocą stanu routera
    navigate('/checkout', { 
      state: { 
        productId: product.id, 
        config: calcState,
        totalPrice: calculatedPrices.total 
      } 
    });
  };

  // 4. Stany ładowania, błędów oraz pustego wyniku
  if (isLoading) {
    return <PlacePageSkeleton />;
  }

  if (error || !product) {
    return (
      <Container 
        sx={{ 
          minHeight: '60vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          px: 2, 
          textAlign: 'center' 
        }}
      >
        <XCircleIcon 
          sx={{ 
            fontSize: 64, 
            color: 'error.main', 
            mb: 2,
            animation: 'bounce 2s infinite',
            '@keyframes bounce': {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-10px)' }
            }
          }} 
        />
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 3 }}>
          {error ? 'Nie udało się załadować oferty' : 'Nie znaleziono oferty'}
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 3, maxWidth: 400 }}>
          Wybrana wycieczka nie istnieje lub serwer bazy danych (XAMPP/MySQL) nie odpowiada.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/explore')}
          sx={{ py: 1.5, px: 3, borderRadius: 3, fontWeight: 'bold', textTransform: 'none' }}
        >
          Wróć do wyszukiwarki
        </Button>
      </Container>
    );
  }



  return (
    <Box sx={{ backgroundImage: `linear-gradient(rgba(92, 92, 92, 0.71), rgba(41, 41, 41, 0.03)), url(${usaBackground})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        minHeight: '100vh', py: 14 }}>
      <Container maxWidth="lg">
        
        {/* NAGŁÓWEK STRONY */}
        <Box sx={{ mb: 4, mx: 1 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ fontWeight: 800, color: '#d49800', mb: 4.5, letterSpacing: '-0.02em' }}
          >
            {product.name}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
            {product.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <MapPinIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body1">{product.location}</Typography>
              </Box>
            )}
            {product.latitude && product.longitude && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5, 
                  bgcolor: 'rgba(25, 118, 210, 0.08)', 
                  color: 'primary.dark', 
                  px: 1.5, 
                  py: 0.5, 
                  borderRadius: 5 
                }}
              >
                <CompassIcon sx={{ fontSize: 16 }} />
                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                  GPS: {product.latitude.toFixed(4)}, {product.longitude.toFixed(4)}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* SIATKA GŁÓWNA */}
        <Grid container spacing={4} alignItems="flex-start">
          
          {/* LEWA KOLUMNA: Prezentacja, zdjęcia, opis */}
          <Grid item xs={12} lg={8} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            
            {/* Galeria / Zdjęcie główne z lazy-loading */}
            <Box 
              sx={{ 
                position: 'relative', 
                overflow: 'hidden', 
                borderRadius: 6, 
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', 
                bgcolor: 'grey.200', 
                aspectRatio: '16/9' 
              }}
            >
              {product.imageUrl ? (
                <Box
                  component="img"
                  src={resolveImageUrl(product.imageUrl)}
                  alt={product.name}
                  loading="lazy"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                />
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.disabled' }}>
                  <Typography>Brak zdjęcia oferty</Typography>
                </Box>
              )}
              <Paper 
                sx={{ 
                  position: 'absolute', 
                  top: 16, 
                  left: 16, 
                  bgcolor: 'rgba(255, 255, 255, 0.9)', 
                  backdropFilter: 'blur(4px)', 
                  px: 2, 
                  py: 1, 
                  borderRadius: 4, 
                  fontWeight: 'bold', 
                  color: 'primary.dark', 
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' 
                }}
              >
                Cena bazowa: {product.price.toLocaleString()} PLN / os.
              </Paper>
            </Box>

            {/* Szczegółowy opis oferty */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: '1px solid', borderColor: 'grey.100' }}>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2 }}>
                Opis programu wycieczki
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ color: 'text.secondary', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}
              >
                {product.description}
              </Typography>
            </Paper>

            {/* Sekcja: Co jest w cenie (Inkluzje i ekskluzje) */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box 
                  sx={{ 
                    bgcolor: 'rgba(186, 255, 189, 0.85)', 
                    border: '1px solid', 
                    borderColor: 'rgba(46, 125, 50, 0.12)', 
                    p: 3, 
                    borderRadius: 4,
                    height: '100%'
                  }}
                >
                  <Typography variant="subtitle1" sx={{ color: 'success.dark', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CheckCircleIcon sx={{ color: 'success.main' }} /> W cenie wyjazdu
                  </Typography>
                  <Box component="ul" sx={{ p: 0, m: 0, listStyleType: 'none', '& li': { mb: 1, fontSize: '0.875rem', color: 'success.dark' } }}>
                    <li>• Pełne zakwaterowanie w hotelach 3/4*</li>
                    <li>• Przejazdy komfortowym autokarem z klimatyzacją</li>
                    <li>• Opieka certyfikowanego polskojęzycznego pilota</li>
                    <li>• Podstawowe ubezpieczenie KL i NNW</li>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box 
                  sx={{ 
                    bgcolor: 'rgba(255, 214, 214, 0.83)', 
                    border: '1px solid', 
                    borderColor: 'rgba(211, 47, 47, 0.12)', 
                    p: 3, 
                    borderRadius: 4,
                    height: '100%'
                  }}
                >
                  <Typography variant="subtitle1" sx={{ color: 'error.dark', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <XCircleIcon sx={{ color: 'error.main' }} /> We własnym zakresie
                  </Typography>
                  <Box component="ul" sx={{ p: 0, m: 0, listStyleType: 'none', '& li': { mb: 1, fontSize: '0.875rem', color: 'error.dark' } }}>
                    <li>• Bilety wstępu do parków narodowych i muzeów (~120 USD)</li>
                    <li>• Wyżywienie poza śniadaniami</li>
                    <li>• Atrakcje fakultatywne i wydatki własne</li>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Interaktywna mapa (lub dynamiczny placeholder oparty o współrzędne z bazy) */}
            {product.latitude && product.longitude && (
              <Paper elevation={0} sx={{ p: 3, borderRadius: 6, border: '1px solid', borderColor: 'grey.100' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Lokalizacja i mapa wyprawy</Typography>
                <Box sx={{ aspectRatio: '16/9', width: '100%', borderRadius: 4, overflow: 'hidden', bgcolor: 'grey.100', border: '1px solid', borderColor: 'grey.200', position: 'relative' }}>
                  <Box
                    component="iframe"
                    title="Mapa wycieczki"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    src={`https://maps.google.com/maps?q=${product.latitude},${product.longitude}&hl=pl&z=10&output=embed`}
                    sx={{ position: 'absolute', inset: 0 }}
                  />
                </Box>
              </Paper>
            )}

          </Grid>

          {/* PRAWA KOLUMNA: Kalkulator ceny w locie i przycisk rezerwacji */}
          <Grid 
            item 
            xs={12} 
            lg={4} 
            sx={{ 
              position: { lg: 'sticky' }, 
              top: { lg: 32 } 
            }}
          >
            <Paper 
              elevation={4} 
              sx={{ 
                p: { xs: 3, sm: 4 }, 
                borderRadius: 6, 
                border: '1px solid', 
                borderColor: 'grey.100',
                display: 'flex',
                flexDirection: 'column',
                gap: 3
              }}
            >
              
              <Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: 'text.disabled', 
                    letterSpacing: '0.1em', 
                    textTransform: 'uppercase', 
                    display: 'block', 
                    mb: 0.5 
                  }}
                >
                  Skonfiguruj i zarezerwuj
                </Typography>
                <Typography variant="h3" component="p" sx={{ fontWeight: 900 }}>
                  {calculatedPrices.total.toLocaleString()} <Typography component="span" variant="h5" sx={{ fontWeight: 'medium' }}>PLN</Typography>
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                  Łączny koszt dla {calcState.participants} os. z dodatkami
                </Typography>
              </Box>

              <Divider sx={{ borderColor: 'grey.100' }} />

              {/* Wybór liczby uczestników */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <UsersIcon sx={{ color: 'primary.main', fontSize: 20 }} /> Liczba uczestników
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setCalcState(prev => ({ ...prev, participants: Math.max(1, prev.participants - 1) }))}
                    sx={{ minWidth: 40, height: 40, p: 0, fontWeight: 'bold', fontSize: '1.2rem', borderRadius: 2 }}
                  >
                    -
                  </Button>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', width: 32, textAlign: 'center' }}>
                    {calcState.participants}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => setCalcState(prev => ({ ...prev, participants: prev.participants + 1 }))}
                    sx={{ minWidth: 40, height: 40, p: 0, fontWeight: 'bold', fontSize: '1.2rem', borderRadius: 2 }}
                  >
                    +
                  </Button>
                </Box>
              </Box>

              {/* Wybór ubezpieczenia */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShieldCheckIcon sx={{ color: 'primary.main', fontSize: 20 }} /> Pakiet ubezpieczeń
                </Typography>
                <Select
                  value={calcState.insuranceType}
                  onChange={(e) => setCalcState(prev => ({ ...prev, insuranceType: e.target.value as any }))}
                  size="small"
                  fullWidth
                  sx={{ borderRadius: 3, bgcolor: 'background.paper' }}
                >
                  <MenuItem value="none">Brak dodatkowego ubezpieczenia (0 PLN)</MenuItem>
                  <MenuItem value="standard">Standard (+150 PLN / os.)</MenuItem>
                  <MenuItem value="premium">Premium Travel Cover (+350 PLN / os.)</MenuItem>
                </Select>
              </Box>

              {/* Dodatki checkbox */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>Dodatkowe usługi</Typography>
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={calcState.hasExtendedEquipment}
                      onChange={(e) => setCalcState(prev => ({ ...prev, hasExtendedEquipment: e.target.checked }))}
                    />
                  }
                  label={
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Wypożyczenie profesjonalnego sprzętu turystycznego (+200 PLN / os.)
                    </Typography>
                  }
                  sx={{ alignItems: 'flex-start', m: 0, '& .MuiCheckbox-root': { p: 0, mr: 1, mt: 0.2 } }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={calcState.hasVIPTransfer}
                      onChange={(e) => setCalcState(prev => ({ ...prev, hasVIPTransfer: e.target.checked }))}
                    />
                  }
                  label={
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Prywatny transfer VIP z/na lotnisko (+500 PLN / grupa)
                    </Typography>
                  }
                  sx={{ alignItems: 'flex-start', m: 0, '& .MuiCheckbox-root': { p: 0, mr: 1, mt: 0.2 } }}
                />
              </Box>

              {/* Podsumowanie kwotowe kalkulatora */}
              <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Cena wycieczki ({calcState.participants}x):</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{calculatedPrices.basePrice.toLocaleString()} PLN</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Wybrane opcje dodatkowe:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{calculatedPrices.additions.toLocaleString()} PLN</Typography>
                </Box>
              </Box>

              {/* Przycisk CTA */}
              <Button
                variant="contained"
                onClick={handleBooking}
                startIcon={<CalendarIcon />}
                fullWidth
                sx={{
                  py: 2,
                  borderRadius: 4,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 4px 14px 0 rgba(25, 118, 210, 0.4)',
                  '&:hover': {
                    boxShadow: '0 6px 20px 0 rgba(25, 118, 210, 0.4)'
                  }
                }}
              >
                Przejdź do rezerwacji
              </Button>

              <Typography variant="caption" sx={{ color: 'text.disabled', textAlign: 'center', lineHeight: 1.4 }}>
                Dokonanie rezerwacji nie wiąże się z natychmiastowym obowiązkiem zapłaty. Masz 24h na opłacenie zaliczki.
              </Typography>

            </Paper>
          </Grid>

        </Grid>

      </Container>
    </Box>
  );
};