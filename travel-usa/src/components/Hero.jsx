import cowboy from "../assets/cowboy-usa.jpeg"
import { Link } from "react-router-dom";

export const Hero = () => (
    <>
    <section className="hero">
        <div className="slider-img">
            <div className="cowboy-img">
                <img src={cowboy} alt="Cowboy USA"/>
            </div>
        </div>
        <h1 className="hero-h1">Poczuj amerykański dziki zachód!</h1>
        <input className="hero-input" placeholder="Wpisz: Colorado lub Wielki Kanion"></input>
        <button><Link to="/planner">Zobacz Planer</Link></button>
                 
     </section>
    </>
)