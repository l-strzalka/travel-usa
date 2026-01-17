import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

export const CarouselControls = ({ onNext, onPrev }) => {
  return (
    <>
      <button
        onClick={onPrev}
        className="carousel-control left"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon />
      </button>
      <button
        onClick={onNext}
        className="carousel-control right"
        aria-label="Next slide"
      >
        <ChevronRightIcon />
      </button>
    </>
  );
};
