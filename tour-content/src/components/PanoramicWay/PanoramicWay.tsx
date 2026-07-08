import {useRef, useState} from "react";
import {tripDescriptions} from "./assets/tripDescriptions";
import "./assets/css/PanoramicWay.css";
 

interface TripDescription {
  tag: string;
  title: string;
  desc: string;
}

interface CarouselSlide extends TripDescription {
  id: string;
  url: string;
}

export const PanoramicWay = () => {
        const imagesData = import.meta.glob<string>("./assets/slides/*.{png,jpg}", {eager: true, import: 'default'});

        const element: CarouselSlide[] = Object.entries(imagesData).map(([path, url]) => {
            const fileName = path.split('/').pop()?.replace(/\.[^/.]+$/, "") || 'unknown';     
            return {
                id: fileName,
                url: url,
                ...(tripDescriptions[fileName] || {tag: 'USA', title: 'Zwiedzaj USA', desc: 'Przygoda czeka!'})
            }   
        });
        const imageWidth = 400;
        const imageHeight = 490;

        const scrollRef = useRef<HTMLDivElement>(null);
        const [isClickDown, setIsClickDown] = useState(false);
        const [startMouseX, setStartMouseX] = useState(0);
        const [initialScrollPos, setInitialScrollPos] = useState(0);


        const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
            if (!scrollRef.current ) return;
            setIsClickDown(true);

            setStartMouseX(e.pageX - scrollRef.current.offsetLeft);
            setInitialScrollPos(scrollRef.current.scrollLeft);
        };

        const handleMouseLeave = () =>{
            setIsClickDown(false);
        }

        const handleMouseUp = () => {
            setIsClickDown(false);
        }

        const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
            if (!isClickDown || !scrollRef.current) return;
            e.preventDefault();

        const currentMouseX = e.pageX - scrollRef.current.offsetLeft;
        const walk = (currentMouseX - startMouseX) * 1.5;
        scrollRef.current.scrollLeft = initialScrollPos - walk;
        };
     
       

    return (
        <div className="panoramic__way">
            <div>
                <div className={`panoramic__inner ${isClickDown ? 'active' : ''}`}
                     ref={scrollRef}
                     onMouseDown={handleMouseDown}
                     onMouseLeave={handleMouseLeave}
                     onMouseUp={handleMouseUp}
                     onMouseMove={handleMouseMove}
                     style={{
                        display: 'flex',
                        overflow: 'hidden',
                        gap: '3px',
                        padding: '30px 0',
                        
                     }}
                >
                    {element.map((element) => (
                        <div className="panoramic__item"
                             key={element.id}
                             style={{
                                position: 'relative'
                             }}
                        >
                            <img 
                                src={element.url} 
                                alt={element.title}
                                width={imageWidth}
                                height={imageHeight}
                                style={{
                                    objectFit: 'cover',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                                }}
                            /> 
                            <div className="panoramic__overlay "
                                 style={{position: 'absolute'}} >
                                <span className="panoramic__tag">{element.tag}</span>
                                <h3 className="panoramic__title" >{element.title}</h3>
                                <p className="panoramic__desc">{element.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}