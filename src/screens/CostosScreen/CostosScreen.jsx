import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, CardContent, Typography, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';
import { ProductCard, ProductMedia } from '../../styles/styledComponents';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const CostosScreen = () => {
  const [productos, setProductos] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [costo, setCosto] = useState('');

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('https://domicilios-madriguera-ac104c9fedbe.herokuapp.com/productos');
        setProductos(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProductos();
  }, []);

  const handleOpenDialog = (producto) => {
    setSelectedProduct(producto);
    setCosto(producto.costo || '');
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
    setCosto('');
  };

  const handleSaveCosto = async () => {
    try {
      await axios.put(`https://domicilios-madriguera-ac104c9fedbe.herokuapp.com/productos/${selectedProduct.id}`, { costo: parseFloat(costo) });
      setProductos(productos.map((producto) => (producto.id === selectedProduct.id ? { ...producto, costo: parseFloat(costo) } : producto)));
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating product cost:', error);
    }
  };

  const calculateUtility = (precio, costo) => precio - costo;
  const calculateMargin = (precio, costo) => ((precio - costo) / precio) * 100;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Centro de Costos
      </Typography>
      <Grid container spacing={2}>
        {productos.map((producto) => (
          <Grid item key={producto.id} xs={12} sm={6} md={4}>
            <ProductCard onClick={() => handleOpenDialog(producto)}>
              <ProductMedia
                component="img"
                alt={producto.nombre}
                image={producto.imagen_url}
                title={producto.nombre}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {producto.nombre}
                </Typography>
                <Typography variant="h6" color="textPrimary">
                  Precio: {formatCurrency(producto.precio)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Categoría: {producto.categoria}
                </Typography>
                {producto.costo && (
                  <>
                    <Typography variant="body2" color="textSecondary">
                      Costo: {formatCurrency(producto.costo)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Utilidad: {formatCurrency(calculateUtility(producto.precio, producto.costo))}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Margen de Ganancia: {calculateMargin(producto.precio, producto.costo).toFixed(2)}%
                    </Typography>
                  </>
                )}
              </CardContent>
            </ProductCard>
          </Grid>
        ))}
      </Grid>

      <Dialog open={!!selectedProduct} onClose={handleCloseDialog}>
        <DialogTitle>Actualizar Costo del Producto</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ingresa el costo del producto {selectedProduct?.nombre}:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Costo"
            type="number"
            fullWidth
            value={costo}
            onChange={(e) => setCosto(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: '#5E55FE'}}>Cancelar</Button>
          <Button onClick={handleSaveCosto} sx={{ color: '#5E55FE'}}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CostosScreen;
