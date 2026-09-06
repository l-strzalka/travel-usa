import '../sass/main.scss'
// import Container from "@mui/material/Container"
import { Hero } from "../features/components/Hero"
import { RecommendedPlaces } from "../features/components/RecommendedPlaces"
import { FeaturedTours } from '@/features/components/ProductFeatured/FeaturedDisplay'
import { CardsSlider } from '@/features/components/CardsSlider'



export const LandingPage = () => ( 
    <main>
      <Hero/>
      <RecommendedPlaces />
      <FeaturedTours />
      <CardsSlider />
    
    </main>

)
