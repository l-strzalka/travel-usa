// tour-content/src/components/ExploreMap/DynamicViewController.tsx
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface DynamicViewControllerProps {
  positions: [number, number][];
  customCenter?: [number, number] | null;
  customZoom?: number | null;
  padding?: [number, number];
}

export const DynamicViewController = ({
  positions,
  customCenter = null,
  customZoom = null,
  padding = [50, 50],
}: DynamicViewControllerProps) => {
  const map = useMap();

  useEffect(() => {
    // 1. Priorytet: Ręczne nadpisanie widoku przez administratora w CMS
    if (customCenter && customCenter[0] !== 0 && customCenter[1] !== 0) {
      map.setView(customCenter, customZoom || 8, { animate: true });
      return;
    }

    // 2. Priorytet: Automatyczny Fit Bounds na podstawie punktów trasy
    if (positions && positions.length > 0) {
      // Tworzymy obiekt obramowania na podstawie tablicy [lat, lng]
      const bounds = L.latLngBounds(positions);

      // Dopasowujemy widok z płynną animacją i marginesem bezpieczeństwa (padding)
      map.fitBounds(bounds, {
        padding, // Margines w pikselach od krawędzi kontenera mapy
        maxZoom: customZoom || 13, // Zabezpieczenie przed zbyt bliskim zoomem dla 1 punktu
        animate: true,
      });
    }
  }, [map, positions, customCenter, customZoom, padding]);

  return null;
};