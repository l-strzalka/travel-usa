import './app.scss';
import './sass/main.scss';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Refine, Authenticated } from '@refinedev/core';
import { DevtoolsProvider, DevtoolsPanel } from '@refinedev/devtools';
import {
  notificationProvider,
  RefineSnackbarProvider,
  ThemedLayoutV2,
  ErrorComponent,
  RefineThemes,
} from '@refinedev/mui';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import routerProvider, {
  UnsavedChangesNotifier,
  CatchAllNavigate,
  NavigateToResource,
} from '@refinedev/react-router-v6';
import dataProvider from '@refinedev/simple-rest';
import axios from 'axios';

import { authProvider } from './authProvider';

// Strony Klienckie
import { PlacePage } from './features/components/ProductDisplay/PlacePage';
import { LandingPage } from './pages/LandingPage';
import { ExplorePage } from './pages/ExplorePage';
import { PlannerPage } from './pages/PlannerPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { Header } from './features/components/Header';
import { Footer } from './features/components/Footer';
import { Login } from './pages/Login';
// Strony Administratora
import {
  ProductList,
  ProductCreate,
  ProductEdit,
} from './admin-panel/resources/products';

import {
  CategoryList,
  CategoryCreate,
} from './admin-panel/resources/categories';

import { 
  OrderList, 
  OrderCreate, 
  OrderEdit, 
  OrderShow,
} from './admin-panel/resources/orders';

import { API_URL, FRONTEND_URL } from './config';
import { ScrollToTop } from './features/components/ScrollToTop';

export { API_URL, FRONTEND_URL };

// Axios dołącza automatycznie token JWT
const axiosInstance = axios.create({
  baseURL: API_URL,
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const theme = createTheme(RefineThemes.Blue);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ScrollToTop />
      <CssBaseline />
      <RefineSnackbarProvider>
        <DevtoolsProvider>
          <Refine
            dataProvider={dataProvider(API_URL, axiosInstance as any)}
            notificationProvider={notificationProvider}
            routerProvider={routerProvider}
            authProvider={authProvider}
            resources={[
              {
                name: 'products',
                list: '/admin/products',
                create: '/admin/products/create',
                edit: '/admin/products/edit/:id',
                show: '/admin/products/show/:id',
                meta: {
                  label: 'Oferty Wycieczek',
                },
              },
              {
                name: 'categories',
                list: '/admin/categories',
                create: '/admin/categories/create',
                edit: '/admin/categories/edit/:id',
                meta: {
                  label: 'Kategorie',
                },
              },
              {
                name: 'orders',
                list: '/admin/orders',
                create: '/admin/orders/create',
                edit: '/admin/orders/create/:id',
                show: '/admin/orders/show/:id',
                meta: {
                  label: 'Zamówienia',
                },
              },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
          >
            <Routes>
              {/* SEKCJA KLIENCKA - Publiczna, dostępna bez logowania */}
              <Route
                element={
                  <>
                    <Header variant='home' />
                    <Outlet />
                    <Footer />
                  </>
                }
              >
                <Route path='/' element={<LandingPage />} />
              </Route>

              {/* SEKCJA KLIENCKA - STRONY STATYCZNE (Stały Header + odstęp od góry) */}
              <Route
                element={
                  <>
                    <Header variant='static' />
                    <Box component='main' sx={{ pt: { xs: 7, sm: 8 } }}>
                      <Outlet />
                    </Box>
                    <Footer />
                  </>
                }
              >
                <Route path='/explore' element={<ExplorePage />} />
                <Route path='/:slug' element={<PlacePage />} />
                <Route path='/planner' element={<PlannerPage />} />
                <Route path='/checkout' element={<CheckoutPage />} />
              </Route>

              {/* STRONA LOGOWANIA */}
              <Route
                path='/login'
                element={
                  <Authenticated
                    key='login-page'
                    fallback={<Login />}
                    v4Legacy={false}
                  >
                    {/* Jeśli zalogowany wejdzie na /login, leci bezpośrednio do ofert */}
                    <NavigateToResource resource='products' />
                  </Authenticated>
                }
              />

              {/* SEKCJA PANELU ADMINISTRATORA (Wymaga statusu ADMIN) */}
              <Route
                path='/admin'
                element={
                  <Authenticated
                    key='admin-layout'
                    fallback={<Navigate to='/login' replace />}
                  >
                    <ThemedLayoutV2>
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route
                  index
                  element={<Navigate to='/admin/products' replace />}
                />

                {/* CRUD dla Produktów/Ofert biura podróży */}
                <Route path='products'>
                  <Route index element={<ProductList />} />
                  <Route path='create' element={<ProductCreate />} />
                  <Route path='edit/:id' element={<ProductEdit />} />
                </Route>

                <Route path='categories'>
                  <Route index element={<CategoryList />} />
                  <Route path='create' element={<CategoryCreate />} />
                  <Route path='edit/:id' element={<CategoryCreate />} />
                </Route>

                <Route path='orders'>
                  <Route index element={<OrderList/>} />
                  <Route path='create' element={<OrderCreate />} />
                  <Route path='edit/:id' element={<OrderEdit />} />
                  <Route path="show/:id" element={<OrderShow/>} />
                </Route>

                {/* Obsługa błędów 404 wewnątrz panelu */}
                <Route path='*' element={<ErrorComponent />} />
              </Route>

              {/* Globalny fallback */}
              <Route path='*' element={<CatchAllNavigate to='/' />} />
            </Routes>

            <UnsavedChangesNotifier />
            <DevtoolsPanel />
          </Refine>
        </DevtoolsProvider>
      </RefineSnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
