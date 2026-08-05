// tour-content/src/components/ExploreMap/ExploreMap.tsx
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { Box, Paper, Typography, Skeleton, Stepper, Step, StepLabel } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MapIcon from '@mui/icons-material/Map';
import { DynamicViewController } from './DynamicViewController';
import 'leaflet/dist/leaflet.css';
import { ProductFormInputs } from '@/admin-panel/resources/products/create';

// Naprawa ikon Leaflet dla środowiska Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useNavigate } from 'react-router-dom';

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export interface RouteItem {
  id: string;
  path: [number, number][];
  color?: string;
}

export interface ExploreMapProps {
  routes?: RouteItem[];
  isLoading?: boolean;
  height?: number | string;
  customCenter?: [number, number] | null;
  customZoom?: number | null;
}

export const RoutePointsStepper = ({ formValues }: { formValues: ProductFormInputs }) => {
  // Wywołujemy Twoją funkcję, aby pobrać sformatowane dane
  const { routePoints: points } = routePoints(formValues);

  if (!points || points.length === 0) {
    return <Typography>Brak punktów trasy</Typography>;
  }

  return (
    <Box sx={{ width: '100%', py: 2 }}>
      {/* activeStep={-1} sprawia, że żaden krok nie jest zaznaczony jako "w trakcie" */}
      <Stepper activeStep={-1} orientation="vertical">
        {points.map((point, index) => (
          <Step key={index} expanded>
            <StepLabel>
              <Typography variant="body1" fontWeight="medium">
                {point.title || 'Bez nazwy'}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

/**
 * Wewnętrzny komponent zarządzający zachowaniem scrolla i klawisza Ctrl/Cmd
 */
const ScrollZoomHandler: React.FC<{ onRequireCtrl: () => void }> = ({
  onRequireCtrl,
}) => {
  const map = useMap();

  useEffect(() => {
    // Nasłuchiwanie klawiszy, aby włączyć/wyłączyć zoomowanie w locie
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control' || e.metaKey) {
        map.scrollWheelZoom.enable();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control' || e.key === 'Meta') {
        map.scrollWheelZoom.disable();
      }
    };

    // Nasłuchiwanie scrolla na kontenerze mapy w celu pokazania komunikatu
    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) {
        onRequireCtrl();
      }
    };

    const container = map.getContainer();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    container.addEventListener('wheel', handleWheel, {
      capture: true,
      passive: true,
    });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      container.removeEventListener('wheel', handleWheel, { capture: true });
    };
  }, [map, onRequireCtrl]);

  return null;
};

export const ExploreMap: React.FC<ExploreMapProps> = ({
  routes = [],
  isLoading = false,
  height = 450,
  customCenter = null,
  customZoom = null,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const navigate = useNavigate();
  const [showCtrlMessage, setShowCtrlMessage] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Wymuszamy przerysowanie mapy, gdy kontener zmienia rozmiar
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, []);

  // Funkcja aktywująca komunikat "Naciśnij Ctrl..."
  const handleRequireCtrl = useCallback(() => {
    setShowCtrlMessage(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setShowCtrlMessage(false);
    }, 2000);
  }, []);

  // Spłaszczamy ścieżki tras do jednej tablicy współrzędnych [lat, lng] dla algorytmu Auto-Fit
  const allPositions = useMemo<[number, number][]>(() => {
    return routes.flatMap((route) => route.path);
  }, [routes]);

  // Obsługa zmiany rozmiaru okna/kontenera (prevent grey tiles issue)
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  }, []);

  // Stan ładowania danych
  if (isLoading) {
    return (
      <Paper variant='outlined' sx={{ overflow: 'hidden', borderRadius: 2 }}>
        <Skeleton
          variant='rectangular'
          width='100%'
          height={height}
          animation='wave'
        />
      </Paper>
    );
  }

  // Stan pusty - brak wyznaczonych tras
  if (!routes.length || allPositions.length === 0) {
    return (
      <Paper
        variant='outlined'
        sx={{
          height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'action.hover',
          borderRadius: 2,
          p: 3,
        }}
      >
        <MapIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
        <Typography variant='h6' color='text.secondary'>
          Brak wyznaczonej trasy
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Dla tej wycieczki nie dodano jeszcze przystanków na mapie.
        </Typography>
      </Paper>
    );
  }

  // Domyślny kadr przed uruchomieniem animacji fitBounds
  const initialCenter: [number, number] = customCenter ||
    allPositions[0] || [39.8283, -98.5795];
  const initialZoom = customZoom || 6;

  return (
    <Box
      sx={{
        height,
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 1,
        position: 'relative',
        '& .leaflet-container': {
          height: '100%',
          width: '100%',
          zIndex: 1,
        },
      }}
    >
      {/* OVERLAY - Komunikat o użyciu Ctrl / Cmd */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000, // Z-index Leafleta kończy się zazwyczaj na 400 dla warstw
          opacity: showCtrlMessage ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          pointerEvents: 'none', // Ważne: nakładka nie może blokować kliknięć w mapę!
        }}
      >
        <Typography
          variant='h5'
          sx={{
            color: 'white',
            fontWeight: 'bold',
            textShadow: '1px 1px 4px rgba(0,0,0,0.8)',
          }}
        >
          Naciśnij Ctrl (lub Cmd), aby przybliżyć mapę
        </Typography>
      </Box>
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        scrollWheelZoom={false}
        ref={mapRef}
      >
        <ScrollZoomHandler onRequireCtrl={handleRequireCtrl} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        {/* Polilinia rysująca trasę */}
        {routes.map((route) => (
          <Polyline
            key={route.id}
            positions={route.path}
            pathOptions={{
              color: route.color || '#d49800',
              weight: 4,
              opacity: 0.85,
              dashArray: '6, 8',
            }}
          />
        ))}

        {/* Punkty przesiadkowe/przystanki */}
        {allPositions.map((pos, index) => (
          <Marker key={`marker-${index}`} position={pos}>
            <Popup>
              <Typography
                variant='subtitle2'
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <LocationOnIcon fontSize='small' color='primary' />
          {`${RoutePointsStepper}`}Przystanek #{index + 1}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                {pos[0].toFixed(4)}, {pos[1].toFixed(4)}
              </Typography>
            </Popup>
          </Marker>
        ))}

        {/* KONTROLER AUTO-FIT BOUNDS */}
        <DynamicViewController
          positions={allPositions}
          customCenter={customCenter}
          customZoom={customZoom}
        />
      </MapContainer>
    </Box>
  );
};
