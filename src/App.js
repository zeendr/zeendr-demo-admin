import React from 'react';
import { Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.css'

// Importamos los componentes
import HomePage from './screens/HomePage/HomePage';
import Navbar from './components/Navbar/Navbar';
import LoginForm from './components/LoginForm/LoginForm';
import DeliveryScreen from './screens/DeliveryScreen/DeliveryScreen';
import PaginaProductos from './screens/PaginaProductos/PaginaProductos';
import DataScreen from './screens/DataScreen/DataScreen';
import ClientsScreen from './screens/ClientsScreen/ClientsScreen';
import ParametrosScreen from './screens/ParametrosScreen/ParametrosScreen';
import SoporteScreen from './screens/SoporteScreen/SoporteScreen';
import StockScreen from './screens/StockScreen/StockScreen';
import CostosScreen from './screens/CostosScreen/CostosScreen';
import ProvedoresScreen from './screens/ProvedoresScreen/ProvedoresScreen';
import GastosScreen from './screens/GastosScreen/GastosScreen';

import { Provider } from 'react-redux';
import store from './redux/store';


const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

const ProtectedRoutes = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar /> 
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/orders" element={<DeliveryScreen />} />
          <Route path="/products" element={<PaginaProductos />} />
          <Route path="/data" element={<DataScreen />} />
          <Route path="/clients" element={<ClientsScreen />} />
          <Route path="/params" element={<ParametrosScreen />} />
          <Route path="/soporte" element={<SoporteScreen />} />
          <Route path="/stock" element={<StockScreen />} />
          <Route path="/costos" element={<CostosScreen />} />
          <Route path="/suppliers" element={<ProvedoresScreen />} />
          <Route path="/gastos" element={<GastosScreen />} />
        </Routes>
      </Box>
    </Box>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
      <ThemeProvider theme={theme}>
        <ProtectedRoutes />
        </ThemeProvider>
      </Router>
    </Provider>
  );
};

export default App;

