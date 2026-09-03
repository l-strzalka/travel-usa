import { Link } from 'react-router-dom';
import {useRef, useEffect} from 'react'
import usaVideo from '/videos/usa-video.mp4';



export const Hero = () => {

  const videoRef = useRef<HTMLVideoElement | null> (null)

  useEffect(() =>{
  if(videoRef.current) {
    videoRef.current.playbackRate = 0.5;
  }
},[])

  return (
    <section className='hero'>
      {/* Kontener na wideo i ciemną nakładkę */}
      <div className='hero-video-wrapper'>
        <video
          ref={videoRef}
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
  
          <h1 className='hero-h1'>Poczuj amerykański dziki zachód!</h1>
          <div className='hero-search-group'>
            <input
              className='hero-input'
              placeholder='Wpisz: Colorado lub Wielki Kanion'
              type='text'
            />
          </div>
        </div>
    </section>
  );
};
