export interface CarouselSlide {
  src: string;
  link: string;
}

interface ViteImageModule {
  default: string;
}

// Mapowanie linków do każdego slajdu
const SLIDE_LINKS = [
  '/explore?search=NewYork',
  '/explore?search=Zachodnie+Wybrze%C5%BCe+%26+Parki+Narodowe',
  '/planner',
  '/explore',
  '/explore',
  '/explore',
];

// Ładuj obrazy dynamicznie i mapuj na obiekty z linkami
export const images: CarouselSlide[] = Object.values(
  import.meta.glob<ViteImageModule>('../assets/slides/*.{jpg,png,webp}', {
    eager: true,
  }),
).map((module, index) => ({
  src: module.default,
  link: SLIDE_LINKS[index] || '/explore', // Fallback na /explore jeśli brakuje linka
}));
