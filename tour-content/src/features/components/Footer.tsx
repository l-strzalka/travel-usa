import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const TEXT_COLOR = '#d49800';

const NAV_LINKS = [
  { label: 'Strona Główna', path: '/' },
  { label: 'Eksploruj', path: '/explore' },
  { label: 'Planner', path: '/planner' },
  { label: 'Zaloguj', path: '/login' },
];

const LEGAL_LINKS = [
  { label: 'Polityka prywatności', path: '/privacy-policy' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Proces rezerwacji', path: '/booking-process' },
  { label: 'Regulamin', path: '/terms' },
];

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1976D2', // Niebieskie tło spójne z nagłówkiem
        color: '#ffffff',
        pt: 8,
        pb: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* KOLUMNA 1: LOGO I OPIS */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: TEXT_COLOR,
                textDecoration: 'none',
                textTransform: 'uppercase',
                display: 'inline-block',
                mb: 2,
              }}
            >
              USA Escape
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.7, pr: { md: 2 } }}>
              Odkryj niezapomniane wyprawy i zaplanuj swoją idealną podróż po Stanach Zjednoczonych razem z nami.
            </Typography>
          </Grid>

          {/* KOLUMNA 2: PIERWSZA LISTA LINKÓW (NAWIGACJA) */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#ffffff', mb: 2 }}>
              Nawigacja
            </Typography>
            <List disablePadding>
              {NAV_LINKS.map((link) => (
                <ListItem key={link.path} disableGutters sx={{ py: 0.5 }}>
                  <Link
                    component={RouterLink}
                    to={link.path}
                    underline="hover"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.875rem',
                      transition: 'color 0.2s',
                      '&:hover': {
                        color: TEXT_COLOR,
                      },
                    }}
                  >
                    {link.label}
                  </Link>
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* KOLUMNA 3: DRUGA LISTA LINKÓW (INFORMACJE) */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#ffffff', mb: 2 }}>
              Informacje
            </Typography>
            <List disablePadding>
              {LEGAL_LINKS.map((link) => (
                <ListItem key={link.path} disableGutters sx={{ py: 0.5 }}>
                  <Link
                    component={RouterLink}
                    to={link.path}
                    underline="hover"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.875rem',
                      transition: 'color 0.2s',
                      '&:hover': {
                        color: TEXT_COLOR,
                      },
                    }}
                  >
                    {link.label}
                  </Link>
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* KOLUMNA 4: KONTAKT I GODZINY OTWARCIA */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#ffffff', mb: 2 }}>
              Kontakt i godziny
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'rgba(255, 255, 255, 0.85)' }}>
                <LocationOnIcon sx={{ color: TEXT_COLOR, fontSize: 20 }} />
                <Typography variant="body2">ul. Podróżnicza 12, Warszawa</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'rgba(255, 255, 255, 0.85)' }}>
                <PhoneIcon sx={{ color: TEXT_COLOR, fontSize: 20 }} />
                <Typography variant="body2">+48 123 456 789</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'rgba(255, 255, 255, 0.85)' }}>
                <EmailIcon sx={{ color: TEXT_COLOR, fontSize: 20 }} />
                <Typography variant="body2">kontakt@usaescape.pl</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, color: 'rgba(255, 255, 255, 0.85)', mt: 1 }}>
                <AccessTimeIcon sx={{ color: TEXT_COLOR, fontSize: 20, mt: 0.2 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#ffffff' }}>
                    Godziny otwarcia:
                  </Typography>
                  <Typography variant="caption" display="block">
                    Pn - Pt: 09:00 - 17:00
                  </Typography>
                  <Typography variant="caption" display="block">
                    Sobota: 10:00 - 14:00
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* DOLNA SEKCJA (COPYRIGHT) */}
        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            &copy; {new Date().getFullYear()} USA Escape. Wszelkie prawa zastrzeżone.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};