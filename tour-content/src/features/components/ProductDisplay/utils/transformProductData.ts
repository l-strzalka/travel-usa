// src/components/PlacePage/utils/transformProductData.ts

import { resolveImageUrl } from '@/utils/imageUrl';
import { Product, FormattedPlaceData } from '../types/products-types';

// Transformacja danych surowych z NestJS do spójnego formatu widoku

export const transformProductData = (
  product: Product | null | undefined,
): FormattedPlaceData | null => {
  if (!product) return null;

  // Bezpieczne sortowanie przystanków wycieczki po kolejności stopOrder
  const sortedRoutePoints = product.routePoints
    ? [...product.routePoints].sort((a, b) => a.stopOrder - b.stopOrder)
    : [];

  // Mapowanie punktów trasy na plan podróży
  const mappedTripPlan =
    sortedRoutePoints.length > 0
      ? sortedRoutePoints.map((point, index) => ({
          dayLabel: `Etap ${index + 1}`,
          title: point.title || `Przystanek ${index + 1}`,
          description: [
            `Szerokość GPS: ${point.latitude}, Długość GPS: ${point.longitude}`,
            'Zwiedzanie lokalnych atrakcji w ramach wybranego programu wycieczki.',
          ],
        }))
      : [
          {
            dayLabel: 'Program',
            title: 'Dzień wyjazdu i realizacja programu',
            description: [
              product.description || 'Brak dodatkowego opisu trasy.',
            ],
          },
        ];

  return {
    id: String(product.id),
    title: product.name,
    category: 'Wycieczka objazdowa / Wypoczynek',
    location: product.location || 'USA / Stany Zjednoczone',
    priceFrom: product.price,
    currency: 'PLN',
    durationDays: Math.max(sortedRoutePoints.length, 1),
    heroImageUrl: String (resolveImageUrl(
      product.imageUrl ||
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
    )),
    breadcrumbs: [
      { label: 'Strona Główna', href: '/' },
      { label: 'Oferty', href: '/explore' },
      { label: product.name },
    ],
    description: product.description,
    highlights: [
      'Pełne zakwaterowanie i profesjonalna opieka przewodnika',
      'Elastyczny program dopasowany do tempa grupy',
      'Kompleksowe ubezpieczenie podróżne w cenie pakietu',
      'Przejazdy komfortowymi, klimatyzowanymi pojazdami',
    ],
    tailorMadeFeatures: [
      'Program dopasowany do Twoich potrzeb i zainteresowań',
      'Hotele dopasowane do budżetu',
      'Dedykowany Specjalista Podróży',
      'Prywatne transfery i przewodnik na wyłączność',
      'Wsparcie techniczne oraz opieka 24/7',
    ],
    tripPlan: mappedTripPlan,
    priceIncludes: [
      {
        title: 'ZAKWATEROWANIE',
        description: 'Hotele 3* / 4* ze śniadaniami',
      },
      {
        title: 'OPIEKA PRZEWODNIKA',
        description: 'Certyfikowany przewodnik polskojęzyczny',
      },
      {
        title: 'TRANSPORT',
        description: 'Wszystkie przejazdy wewnętrzne wg programu',
      },
      {
        title: 'UBEZPIECZENIE',
        description: 'KL 100 000 EUR, NNW 30 000 PLN',
      },
    ],
    priceExcludes: [
      {
        title: 'BILETY LOTNICZE',
        description: 'Przylot i powrót do kraju (opcjonalnie do dopłaty)',
      },
      {
        title: 'WYŻYWIENIE',
        description: 'Posiłki niewymienione w oficjalnym programie',
      },
      {
        title: 'NAPIWKI',
        description: 'Napiwki dla kierowców i lokalnych przewodników',
      },
    ],
    priceDisclaimer:
      '* Ostateczna cena zależna od terminu, dostępności pokoi hotelowych oraz wybranych opcji dodatkowych w kalkulatorze.',
    latitude: product.latitude,
    longitude: product.longitude,
    routePoints: sortedRoutePoints,
  };
};
