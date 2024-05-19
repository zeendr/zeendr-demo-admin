import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import OrderTable from './OrderTable';
import Modals from './Modals';
import SummaryCards from './SummaryCards';
import './DeliveryScreen.css';
import deliveryCosts from '../../data/barrios';
import dayjs from 'dayjs'; // Añadir dayjs para manejar las fechas

const DeliveryScreen = () => {
  const [orders, setOrders] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [openComprobante, setOpenComprobante] = useState(false);
  const [openProductos, setOpenProductos] = useState(false);
  const [selectedComprobante, setSelectedComprobante] = useState('');
  const [selectedProductos, setSelectedProductos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD')); // Inicializar con la fecha actual

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersResponse = await axios.get('https://domicilios-madriguera-ac104c9fedbe.herokuapp.com/pedidos');
        setOrders(ordersResponse.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const productsResponse = await axios.get('https://domicilios-madriguera-ac104c9fedbe.herokuapp.com/productos');
        const productsMap = productsResponse.data.reduce((acc, product) => {
          acc[product.id] = product.nombre;
          return acc;
        }, {});
        setProductsMap(productsMap);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchOrders();
    fetchProducts();
  }, []);

  const handleOpenComprobanteDialog = (comprobanteUrl) => {
    setSelectedComprobante(comprobanteUrl);
    setOpenComprobante(true);
  };

  const handleCloseComprobanteDialog = () => {
    setOpenComprobante(false);
    setSelectedComprobante('');
  };

  const handleOpenProductosDialog = (productosDetalles) => {
    setSelectedProductos(productosDetalles);
    setOpenProductos(true);
  };

  const handleCloseProductosDialog = () => {
    setOpenProductos(false);
    setSelectedProductos([]);
  };

  const handleEstadoChange = async (orderId, newEstado) => {
    try {
      await axios.put(`https://domicilios-madriguera-ac104c9fedbe.herokuapp.com/pedido/${orderId}/estado`, { estado: newEstado });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, estado: newEstado } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const filteredOrders = selectedDate === 'Todas'
    ? orders
    : orders.filter((order) => order.fecha_hora.startsWith(selectedDate));

  const transformOrders = filteredOrders
    .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora)) // Ordenar cronológicamente
    .map((order) => {
      const productos = JSON.parse(order.productos);
      const productosDescripcion = productos
        .map((prod) => `${productsMap[prod.id]} (x${prod.quantity})`)
        .join(', ');

      const totalDomicilio = deliveryCosts[order.barrio] || 0;
      const totalVenta = order.total_productos + totalDomicilio;

      return {
        id: order.id,
        nombre_completo: order.nombre_completo,
        numero_telefono: order.numero_telefono,
        direccion: order.direccion,
        barrio: order.barrio,
        fecha: order.fecha_hora,
        productos: productosDescripcion,
        productosDetalles: productos,
        metodo_pago: order.metodo_pago,
        comprobante_pago: order.comprobante_pago,
        estado: order.estado,
        total: order.total_productos,
        total_domicilio: totalDomicilio,
        total_venta: totalVenta
      };
    });

  const summaryOrders = transformOrders.filter(order => ['Pedido Confirmado', 'Pedido Enviado'].includes(order.estado));

  const totalVentas = summaryOrders.reduce((sum, order) => sum + order.total_venta, 0);
  const totalProductos = summaryOrders.reduce((sum, order) => sum + order.total, 0);
  const totalDomicilios = summaryOrders.reduce((sum, order) => sum + order.total_domicilio, 0);
  const numeroPedidos = summaryOrders.length;

  // Obtener todas las fechas únicas de las órdenes y ordenarlas cronológicamente
  const uniqueDates = ['Todas', ...[...new Set(orders.map((order) => order.fecha_hora.split(' ')[0]))].sort((a, b) => new Date(a) - new Date(b))];

  return (
    <Box sx={{ p: 4 }}>
      <SummaryCards
        totalVentas={totalVentas}
        totalProductos={totalProductos}
        totalDomicilios={totalDomicilios}
        numeroPedidos={numeroPedidos}
      />
      <FormControl sx={{ minWidth: 200, marginBottom: 1, marginTop: 2 }}>
        <InputLabel>Filtrar por Fecha</InputLabel>
        <Select
          value={selectedDate}
          onChange={handleDateChange}
        >
          {uniqueDates.map((date, index) => (
            <MenuItem key={index} value={date}>
              {date}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <OrderTable
          orders={transformOrders}
          onOpenComprobanteDialog={handleOpenComprobanteDialog}
          onEstadoChange={handleEstadoChange}
          onOpenProductosDialog={handleOpenProductosDialog}
        />
      )}
      <Modals
        openComprobante={openComprobante}
        openProductos={openProductos}
        handleCloseComprobanteDialog={handleCloseComprobanteDialog}
        handleCloseProductosDialog={handleCloseProductosDialog}
        selectedComprobante={selectedComprobante}
        selectedProductos={selectedProductos}
        productsMap={productsMap}
      />
    </Box>
  );
};

export default DeliveryScreen;


