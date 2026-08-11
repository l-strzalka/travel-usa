import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlacePageSkeleton } from './ui/PlacePageSkeleton';
import { useProductQuery } from './api/useProductQuery';
import { transformProductData } from './utils/transformProductData';

import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Button,
  Tabs,
  Tab,
  Paper,
  Grid2,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  Place as PlaceIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
  LocationOnOutlined as LocationIcon,
  StarOutline as StarIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

import { ExploreMap } from '../ExploreMap/ExploreMap';

export const PlacePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<number>(0);

  const { data: product, isLoading, error } = useProductQuery(slug);

  const offerData = useMemo(() => transformProductData(product), [product]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

   // Zabezpieczona memoizacja trasy w PlacePage.tsx

   const formattedRoutes = useMemo(() => {
    if (!offerData?.routePoints?.length) return [];

    return [
      {
        id: `route-${offerData.id || 'main'}`,
        path: offerData.routePoints.map(
          (point) => [point.latitude, point.longitude] as [number, number],
        ),
      },
    ];
  }, [offerData?.id, offerData?.routePoints]);

  const scrollToSection = (idSection: string) => {
    const element = document.getElementById(idSection);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 1. Stan ładowania z przygotowanym widokiem Skeleton
  if (isLoading) {
    return <PlacePageSkeleton />;
  }

  // 2. Obsługa błędu pobierania danych z serwera (Empty State / Error Boundary)
  if (error || !offerData) {
    return (
      <Container maxWidth='md' sx={{ py: 10 }}>
        <Alert severity='error' variant='filled'>
          <AlertTitle>Błąd pobierania oferty</AlertTitle>
          {error?.message ||
            'Nie udało się odnaleźć wskazanej oferty wycieczki.'}
        </Alert>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant='outlined'
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/explore')}
          >
            Wróć do listy ofert
          </Button>
        </Box>
      </Container>
    );
  } 

  return (
    <Box component='main' sx={{ bgcolor: 'background.default', pb: 8 }}>
      {/* HERO SECTION */}
      <Box
        sx={{
          position: 'relative',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.57), rgba(0, 0, 0, 0.38)), url(${product ? product.imageUrl : ''})`,
          minHeight: 500,
          backgroundSize: 'cover',
          backgroundPosition: '20% 15%',
          color: 'common.white',
          pt: 3,
          pb: 8,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Container maxWidth='lg'>
          <Breadcrumbs
            separator={
              <NavigateNextIcon
                fontSize='small'
                sx={{ color: 'common.white' }}
              />
            }
            aria-label='breadcrumb'
            sx={{ mb: 4, '& .MuiBreadcrumbs-li': { color: 'common.white' } }}
          >
            {offerData.breadcrumbs.map((item, idx) =>
              item.href ? (
                <MuiLink
                  key={idx}
                  underline='hover'
                  color='inherit'
                  href={item.href}
                  sx={{ fontSize: '0.875rem' }}
                >
                  {item.label}
                </MuiLink>
              ) : (
                <Typography
                  key={idx}
                  variant='body2'
                  sx={{ color: 'rgba(255,255,255,0.8)' }}
                >
                  {item.label}
                </Typography>
              ),
            )}
          </Breadcrumbs>

          <Box sx={{ maxWidth: 1200, mt: 8 }}>
            <Typography
              variant='subtitle2'
              sx={{
                textTransform: 'uppercase',
                letterSpacing: 1,
                mb: 1,
                opacity: 0.9,
              }}
            >
              {offerData.category}
            </Typography>
            <Typography
              variant='h3'
              component='h1'
              sx={{ fontWeight: 700, mb: 2 }}
            >
              {product ? product.name : ''}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <LocationIcon fontSize='small' />
              <Typography variant='subtitle1'>{offerData.location}</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
              <Typography variant='h4' sx={{ fontWeight: 600 }}>
                Od {offerData.priceFrom.toLocaleString('pl-PL')}{' '}
                {offerData.currency} / os
              </Typography>
              <Typography variant='h6' sx={{ opacity: 0.8 }}>
                {offerData.durationDays}{' '}
                {offerData.durationDays === 1 ? 'dzień' : 'dni'}
              </Typography>
            </Box>

            <Button
              variant='contained'
              size='large'
              color='primary'
              onClick={() =>
                navigate('/checkout', { state: { productId: offerData.id } })
              }
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: 2,
              }}
            >
              Rezerwuj / Zapytaj o Ofertę
            </Button>
          </Box>
        </Container>
      </Box>

      {/* STICKY NAV TABS */}
      <Paper
        elevation={1}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          borderRadius: 0,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth='lg'>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant='scrollable'
            scrollButtons='auto'
            aria-label='Sekcje wycieczki'
            sx={{
              '& .MuiTabs-flexContainer': {
                justifyContent: 'space-between',
                p: 2,
                '& .MuiButtonBase-root': {
                  fontSize: 16,
                  fontWeight: 700,
                },
              },
            }}
          >
            <Tab
              label='Opis i Atrakcje'
              onClick={() => scrollToSection('opis-podrozy')}
            />
            <Tab
              label='Plan podróży'
              onClick={() => scrollToSection('plan-podrozy')}
            />
            <Tab label='Mapa i Trasa' onClick={() => scrollToSection('mapa')} />
            <Tab label='Cena' onClick={() => scrollToSection('cena')} />
          </Tabs>
        </Container>
      </Paper>

      {/* GLOWNA ZAWARTOSC */}
      <Container maxWidth='xl' sx={{ mt: 6 }}>
        {/* OPIS I HIGHLIGHTS */}
        <Box
          id='opis-podrozy'
          component='section'
          sx={{ mb: 8, scrollMarginTop: '80px', mx: 3 }}
        >
          <Grid2 container spacing={12}>
            <Grid2 size={{ xs: 12, md: 6, lg: 7 }}>
              <Typography
                variant='h4'
                component='h2'
                sx={{ fontWeight: 700, mb: 3, textAlign: 'left' }}
              >
                {product ? product.name : ''}
              </Typography>
              <Typography
                variant='body1'
                color='text.secondary'
                paragraph
                sx={{
                  lineHeight: 1.8,
                  whitespace: 'pre-line',
                  textAlign: 'left',
                }}
              >
                {product ? product.description : ''}
              </Typography>

              <Typography
                variant='h5'
                component='h3'
                sx={{ fontWeight: 600, mt: 8, mb: 2, textAlign: 'left' }}
              >
                Największe atrakcje tej podróży
              </Typography>
              <List disablePadding>
                {offerData.highlights.map((item, idx) => (
                  <ListItem key={idx} sx={{ px: 0, py: 0.75 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <StarIcon color='primary' fontSize='small' />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6, lg: 5 }}>
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
                <Typography
                  variant='h6'
                  component='h3'
                  sx={{ fontWeight: 700, mb: 2 }}
                >
                  Wakacje szyte na miarę
                </Typography>
                <List disablePadding>
                  {offerData.tailorMadeFeatures.map((feat, idx) => (
                    <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckIcon color='success' fontSize='small' />
                      </ListItemIcon>
                      <ListItemText
                        primary={feat}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid2>
          </Grid2>
        </Box>

        <Divider sx={{ my: 6 }} />

        {/* PLAN PODROZY */}
        <Box
          id='plan-podrozy'
          component='section'
          sx={{ mb: 8, scrollMarginTop: '80px' }}
        >
          <Typography
            variant='h4'
            component='h2'
            sx={{ fontWeight: 700, mb: 4 }}
          >
            Plan podróży ({offerData.tripPlan.length}{' '}
            {offerData.tripPlan.length === 1 ? 'etap' : 'etapy'})
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {offerData.tripPlan.map((step, idx) => (
              <Paper
                key={idx}
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
                <Box
                  sx={{
                    minWidth: 100,
                    fontWeight: 700,
                    color: 'primary.main',
                    fontSize: '1.1rem',
                  }}
                >
                  {step.dayLabel}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant='h6'
                    component='h3'
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    {step.title}
                  </Typography>
                  {step.description.map((p, pIdx) => (
                    <Typography
                      key={pIdx}
                      variant='body2'
                      color='text.secondary'
                      paragraph
                      sx={{ mb: 1 }}
                    >
                      {p}
                    </Typography>
                  ))}
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 6 }} />

        {/* MAPA I GPS */}
        <Box
          id='mapa'
          component='section'
          sx={{ mb: 8, scrollMarginTop: '80px' }}
        >
          <Typography
            variant='h4'
            component='h2'
            sx={{ fontWeight: 700, mb: 3 }}
          >
            Trasa i Lokalizacja GPS
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: 'grey.100',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ textAlign: 'center', color: 'text.secondary', mb: 3 }}>
              <PlaceIcon sx={{ fontSize: 48, mb: 1, color: 'primary.main' }} />
              <Typography variant='h6' color='text.primary'>
                Główny punkt: {offerData.location}
              </Typography>
              {offerData.latitude && offerData.longitude && (
                <Typography variant='body2'>
                  Współrzędne główne: {offerData.latitude},{' '}
                  {offerData.longitude}
                </Typography>
              )}
            </Box>

            {offerData.routePoints.length > 0 && (
              <Box sx={{ mt: 2, p: 3 }}>
                <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2 }}>
                  Trasa Wycieczki
                </Typography>
                <ExploreMap
                  routes={formattedRoutes}
                  stepTitles={offerData.tripPlan.map((step) => step.title)}
                />
                <Grid container spacing={2}>
                  {offerData.routePoints.map((point, index) => (
                    <Grid item xs={12} sm={6} md={4} key={point.id || index}>
                      <Paper
                        variant='outlined'
                        sx={{ p: 2, bgcolor: 'background.paper' }}
                      >
                        <Typography variant='subtitle2' color='primary'>
                          #{point.stopOrder}{' '}
                          {point.title || `Przystanek ${index + 1}`}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          Lat: {point.latitude} | Lng: {point.longitude}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Paper>
        </Box>

        <Divider sx={{ my: 6 }} />

        {/* SZCZEGÓŁY CENY */}
        <Box
          id='cena'
          component='section'
          sx={{ mb: 4, scrollMarginTop: '80px' }}
        >
          <Typography
            variant='h4'
            component='h2'
            sx={{ fontWeight: 700, mb: 4 }}
          >
            Cena i szczegóły
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%',
                }}
              >
                <Typography
                  variant='h6'
                  component='h3'
                  color='success.main'
                  sx={{ fontWeight: 700, mb: 2 }}
                >
                  Cena zawiera
                </Typography>
                <List disablePadding>
                  {offerData.priceIncludes.map((item, idx) => (
                    <ListItem
                      key={idx}
                      sx={{ px: 0, py: 1, alignItems: 'flex-start' }}
                    >
                      <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                        <CheckIcon color='success' fontSize='small' />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.title}
                        secondary={item.description}
                        primaryTypographyProps={{
                          fontWeight: 600,
                          variant: 'body2',
                        }}
                        secondaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%',
                }}
              >
                <Typography
                  variant='h6'
                  component='h3'
                  color='error.main'
                  sx={{ fontWeight: 700, mb: 2 }}
                >
                  Cena nie zawiera
                </Typography>
                <List disablePadding>
                  {offerData.priceExcludes.map((item, idx) => (
                    <ListItem
                      key={idx}
                      sx={{ px: 0, py: 1, alignItems: 'flex-start' }}
                    >
                      <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                        <CloseIcon color='error' fontSize='small' />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.title}
                        secondary={item.description}
                        primaryTypographyProps={{
                          fontWeight: 600,
                          variant: 'body2',
                        }}
                        secondaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>

          <Typography
            variant='caption'
            color='text.secondary'
            sx={{ display: 'block', mt: 3, fontStyle: 'italic' }}
          >
            {offerData.priceDisclaimer}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default PlacePage;
