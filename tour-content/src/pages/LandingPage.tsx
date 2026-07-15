import '../sass/main.scss'
// import Container from "@mui/material/Container"
import { Hero } from "../features/components/Hero"
import { RecommendedPlaces } from "../features/components/RecommendedPlaces"
import { FeaturedTours } from '@/features/components/ProductFeatured/FeaturedDisplay'


export const LandingPage: React.FC = () => ( 
    <>
      <Hero/>
      <RecommendedPlaces />
      <FeaturedTours />
       
    </>

)
