export const CarouselItem = ({ src, width }) => {
  return (
    <div
      className="carousel-item"
      style={{
        width: `${width}px`,
        flexShrink: 0
      }}
    >
      <img 
        src={src} 
        alt="" 
        width={width - 5} />
    </div>
  );
};
