import { Link } from "react-router-dom";
import { CarouselSlide } from "./images";

type Props = {
  slide: CarouselSlide;
  index: number;
  width: string | number;
  height: string | number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const CarouselItem  = ({
  slide,
  index,
  width,
  height,
  onMouseEnter,
  onMouseLeave,
}: Props) => {
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
        <img src={slide.src} alt={`Slide ${index + 1}`} width={width} height={height} data-index={index} />
        <div className="text-overlay">
          <Link to={slide.link} style={{ textDecoration: 'none' }}><span className="highlight">Zobacz Więcej</span></Link>
          
        </div>
      </div>
  );
};
