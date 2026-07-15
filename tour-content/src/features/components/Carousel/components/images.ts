interface ViteImageModule {
  default: string;
}

export const images = Object.values(
  import.meta.glob<ViteImageModule>('../assets/slides/*.{jpg,png,webp}', {
    eager: true,
  }),
).map((module) => module.default);


