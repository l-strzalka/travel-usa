import { Carousel } from "./Carousel/Carousel";



export const RecommendedPlaces = () => (

    <main>

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

<section className="adventure-recommendations">
        <div className="adventure-recommendations__header">
            <h2 className="adventure-recommendations__title">
                Miejsca, które uważamy za niezwykłe
            </h2>
            <p className="adventure-recommendations__subtitle">
            Wyselekcjonowane punkty na mapie, które zmieniają zwykłą podróż w legendę.
            </p>
        </div>
        
</section> 
    </main>
)