import { Carousel } from "./Carousel/Carousel";
import { PanoramicWay} from "./PanoramicWay/PanoramicWay";



export const RecommendedPlaces = () => (

        <section className="adventure-discovery">
            <div className="adventure-discovery__container">
                <div className="adventure-discovery__content">
                    <header className="adventure-discovery__intro">
                        <h2 className="adventure-discovery__accent-title">Poza utartym szlakiem: 
                            <span className="highlight"> Nasze rekomendacje</span>
                        </h2>
                        <button className="adventure-discovery__view-all">
                            Zobacz wszystkie miejsca  
                        </button>  
                    </header>
                <Carousel/>
                </div>
                
            </div>
        </section>

       
    
)