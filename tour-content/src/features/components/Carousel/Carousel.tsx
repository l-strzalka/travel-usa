import './components/css/Carousel.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import { CarouselItem } from '@/features/components/Carousel/components/CarouselItem';
import { images } from './components/images';
import { CarouselControls } from './components/CarouselControls';

export const Carousel = () => {
  const [items, setItems] = useState(images);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevClick, setIsPrevClick] = useState(false);
  const [hasPrepended, setHasPrepended] = useState(false);
  const slideWidth = 400;
  const slideHeight = 490;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
  }, [isTransitioning]);

  const startInterval = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(nextSlide, 5000);
  }, [nextSlide]);

  const stopInterval = useCallback(() => {
    if (!intervalRef.current) return;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const goToSlide = useCallback(
    (direction: 'next' | 'prev') => {
      if (isTransitioning) return;
      //gdy nastąpi kliknięcie, intrwwał ma się zatrzymać, by nie kolidować z autostartem.
      stopInterval();

      if (direction === 'prev') {
        //jeżeli kierunek jest ustawiony na wstecz(bo użutkownik kliknie przycisk) to zmień stan ustawienia zdjęć wkladając je do parametru (prev):
        setItems((prev) => {
          //tworzę więc stałą last, do której przypisuje tablicę z której wyciągam ostani element [ABCDE -> E]
          const last = prev[prev.length - 1];
          // zwracam tablicę(last) w której mam [E] oraz resztę tablicy(przekazanej do prev) bez ostatniego elementu czyli [E,ABCD]
          return [last, ...prev.slice(0, -1)];
        });
        //Wstawiam flagę informującą, że wstawiłem ostatni element przed animacją
        setHasPrepended(true);
        //Informuję handleTransitionEnd, że animacja była wynikiem kliknięcia przycisku PREV
        setIsPrevClick(true);

        //wprowadzam opóźnienie startu animacji o 1 klatkę, żeby przeglądarka dała czas na narysowanie nowego układu w DOM.
        requestAnimationFrame(() => setIsTransitioning(true));
      } else {
        //W innym przypadku informuje handleTransitionEnd, że przycisk kliknięty został Next a nie Prev
        setIsPrevClick(false);

        //więc niech animacja działa jak dotychczas
        setIsTransitioning(true);
      }

      //Startuje interwał
      startInterval();
    },
    [isTransitioning, stopInterval, startInterval],
  );

  const clickChevronNext = useCallback(() => goToSlide('next'), [goToSlide]);
  const clickChevronPrev = useCallback(() => goToSlide('prev'), [goToSlide]);

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== 'transform') return; //filtry
    if (e.target !== e.currentTarget) return;

    setIsTransitioning(false);

    if (prevClick) {
      if (hasPrepended) {
        setHasPrepended(false);
        setIsPrevClick(false);
      } else {
        setItems((next) => {
          const last = next[next.length - 1];
          return [last, ...next.slice(0, -1)];
        });
        setIsPrevClick(false);
      }
    } else {
      setItems((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
    }
  };

  useEffect(() => {
    startInterval();
    return () => stopInterval();
  }, [startInterval, stopInterval]);

  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') clickChevronPrev();
      if (e.key === 'ArrowRight') clickChevronNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clickChevronNext, clickChevronPrev]);

  return (
    <div className='carousel'>
      <div
        style={{
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          className={`carousel-inner ${!isTransitioning ? 'no-transition' : ''}`}
          onTransitionEnd={handleTransitionEnd}
          style={{
            display: 'flex',
            transform: `translateX(${isTransitioning ? (prevClick ? 0 : -slideWidth) : prevClick ? -slideWidth : 0}px)`,
          }}
        >
          {items.map((src, index) => (
            <CarouselItem
              key={src + index} // Unikalny klucz
              alt={`Slide ${index + 1}`}
              src={src} 
              index={index} 
              width={slideWidth}
              height={slideHeight}
              onMouseEnter={stopInterval}
              onMouseLeave={startInterval}
            />
          ))}
        </div>
        <CarouselControls onNext={clickChevronNext} onPrev={clickChevronPrev} />
      </div>
    </div>
  );
};
