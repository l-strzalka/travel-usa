export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface TourOfferMapItem {
    id: string,
    title: string,
    price: number,
    coordinates: LocationCoordinates,
    imageUrl?: string,
}

export interface TourRoute {
    id: string,
    path: [number, number][]; // Tablica współrzędnych do rysowania ścieżki
    color?: string,
}
