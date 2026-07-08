import './App.scss';
import './Sass/main.scss';
import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ExplorePage } from './pages/ExplorePage';
import { PlacePage } from './pages/PlacePage';
import { PlannerPage } from './pages/PlannerPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { Header } from './components/Header';
import { Login } from './components/Login/login';
// import { Carousel } from './components/Carousel/Carousel';
// import { Login } from './components/Login/login';



function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/explore' element={<ExplorePage />} />
        <Route path='/place/:id' element={<PlacePage />} />
        <Route path='/planner' element={<PlannerPage />} />
        <Route path='/checkout' element={<CheckoutPage />} />
        {/* <Route path='/login' element={<Login />} /> */}
      </Routes>
    </>
  );
}

export default App;
