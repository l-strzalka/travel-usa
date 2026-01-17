export const CarouselItem = ({
  src,
  index,
  width,
  height,
  alt,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <>
      <div
        className="carousel-item"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          flexShrink: 0,
        }}
      >
        <img src={src} alt={alt} width={width} height={height} index={index} />
        <div className="text-overlay">
          <span class="highlight">Zobacz Więcej</span>
        </div>
      </div>
    </>
  );
};
