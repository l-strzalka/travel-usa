
import './App.scss'
import './sass/main.scss'
import {Routes, Route} from 'react-router-dom'
import {Counter} from './components/LikeCount'
import {LandingPage} from './pages/LandingPage'
import {ExplorePage} from './pages/ExplorePage'
import {PlacePage} from './pages/PlacePage'
import {PlannerPage} from './pages/PlannerPage'
import {CheckoutPage} from './pages/CheckoutPage'
import {Header} from './components/Header'
import { Carousel } from './components/Carousel/Carousel'



function App() {

  return (
    <>    
      <Header/>

      <Routes>
        <Route path ="/" element={<LandingPage/>} />
        <Route path ="/explore" element={<ExplorePage/>} />
        <Route path ="/place/:id" element={<PlacePage/>} />
        <Route path ="/planner" element={<PlannerPage/>} />
        <Route path ="/checkout" element={<CheckoutPage/>} />
      </Routes>
      
   
     
     
      
    
    </>
  )
}

export default App
