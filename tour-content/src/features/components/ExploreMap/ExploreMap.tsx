import React, { useEffect, useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { TourOfferMapItem, TourRoute } from './types';

// Fix dla ikon Leaflet w środowisku Vite/React
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

export interface ExploreMapProps {
  offers: TourOfferMapItem[];
  routes?: TourRoute[];
  center?: [number, number];
  zoom?: number;
}

/**
 * Wewnętrzny komponent zarządzający zachowaniem scrolla i klawisza Ctrl/Cmd
 */
const ScrollZoomHandler: React.FC<{ onRequireCtrl: () => void }> = ({ onRequireCtrl }) => {
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
    container.addEventListener('wheel', handleWheel, { capture: true, passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      container.removeEventListener('wheel', handleWheel, { capture: true });
    };
  }, [map, onRequireCtrl]);

  return null;
};

export const ExploreMap: React.FC<ExploreMapProps> = ({
  offers,
  routes = [],
  center = [39.8283, -98.5795],
  zoom = 4,
}) => {
  const navigate = useNavigate();
  const [showCtrlMessage, setShowCtrlMessage] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  return (
    <Box 
      sx={{ 
        height: '600px', 
        width: '100%', 
        borderRadius: 2, 
        overflow: 'hidden', 
        boxShadow: 3,
        position: 'relative',
        zIndex: 1
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
          variant="h5" 
          sx={{ 
            color: 'white', 
            fontWeight: 'bold',
            textShadow: '1px 1px 4px rgba(0,0,0,0.8)'
          }}
        >
          Naciśnij Ctrl (lub Cmd), aby przybliżyć mapę
        </Typography>
      </Box>

      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false} // Na start wyłączamy domyślny scroll
        style={{ height: '100%', width: '100%' }}
      >
        <ScrollZoomHandler onRequireCtrl={handleRequireCtrl} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {routes.map((route) => (
          <Polyline
            key={route.id}
            positions={route.path}
            pathOptions={{ 
              color: route.color || '#d49800', 
              weight: 4, 
              dashArray: '10, 10' 
            }}
          />
        ))}

        {offers.map((offer) => (
          <Marker key={offer.id} position={[offer.coordinates.lat, offer.coordinates.lng]}>
            <Popup closeButton={false}>
              <Box sx={{ p: 1, minWidth: '180px', textAlign: 'center' }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                  {offer.title}
                </Typography>
                
                <Typography variant="body2" color="primary" sx={{ mb: 1.5, fontWeight: 'bold' }}>
                  Od ${offer.price}
                </Typography>
                
                <Button
                  size="small"
                  variant="contained"
                  fullWidth
                  sx={{ backgroundColor: '#1976d2', color: '#fff' }}
                  onClick={() => navigate(`/place/${offer.id}`)}
                >
                  Zobacz szczegóły
                </Button>
              </Box>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};