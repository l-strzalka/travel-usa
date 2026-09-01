import { Link } from 'react-router-dom';
import usaVideo from '../../../public/videos/usa-video.mp4';

export const Hero = () => {
  return (
    <section className='hero'>
      {/* Kontener na wideo i ciemną nakładkę */}
      <div className='hero-video-wrapper'>
        <video
          src={usaVideo}
          autoPlay
          loop
          muted
          playsInline
          className='hero-video'
        />
        <div className='hero-overlay'></div>
      </div>

      {/* Warstwa tekstowa z formularzem */}
      <div className='hero-content'>
        <div className='container'>
          <h1 className='hero-h1'>Poczuj amerykański dziki zachód!</h1>
          <div className='hero-search-group'>
            <input
              className='hero-input'
              placeholder='Wpisz: Colorado lub Wielki Kanion'
              type='text'
            />
          </div>
        </div>
      </div>
    </section>
  );
};
