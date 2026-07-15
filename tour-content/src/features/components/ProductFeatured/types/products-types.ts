export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
}

// Dodatkowe typy dla kalkulatora rezerwacji
export interface CalculatorState {
  participants: number;
  insuranceType: 'standard' | 'premium' | 'none';
  hasExtendedEquipment: boolean;
  hasVIPTransfer: boolean;
}

export interface UseFeaturedToursOptions {
  limit?: number;
  category?: string; // Do przyszłej rozbudowy
}