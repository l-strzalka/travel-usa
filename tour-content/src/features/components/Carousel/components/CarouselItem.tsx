type Props = {
  src: string,
  index: number,
  width: string | number,
  height: string | number,
  alt: string,
  onMouseEnter: () => void,
  onMouseLeave: () => void,
}

export const CarouselItem: React.FC<Props> = ({
  src,
  index,
  width,
  height,
  alt,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
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
        <img src={src} alt={alt} width={width} height={height} data-index={index} />
        <div className="text-overlay">
          <span className="highlight">Zobacz Więcej</span>
        </div>
      </div>
  );
};
