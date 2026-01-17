export const images = Object.values(import.meta.glob('../assets/slides/*.{jpg,png,webp}', { eager: true})
);
