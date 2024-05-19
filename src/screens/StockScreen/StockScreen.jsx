import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Grid, Card, CardContent, Typography, TextField,
  CircularProgress, IconButton, InputAdornment, Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';
import InventoryDialog from './InventoryDialog';
import MovimientosDialog from './MovimientosDialog';

const apiBaseUrl = process.env.REACT_APP_API_URL;

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const StyledCard = styled(Card)({
  border: '1px solid black',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.02)',
  }
});

const StockScreen = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockChanges, setStockChanges] = useState({});
  const [editing, setEditing] = useState({});
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [movimientosDialogOpen, setMovimientosDialogOpen] = useState(false);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/productos`);
      setProductos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los productos', error);
      setLoading(false);
    }
  };

  const handleStockChange = (id, cantidad) => {
    setStockChanges(prev => ({ ...prev, [id]: cantidad }));
  };

  const handleSaveStock = async (id) => {
    const cantidad = stockChanges[id];
    if (cantidad !== undefined) {
      try {
        const response = await axios.post(`${apiBaseUrl}/productos/${id}/stock`, { cantidad });
        setEditing(prev => ({ ...prev, [id]: false }));
        setProductos(prevProductos => prevProductos.map(producto => 
          producto.id === id ? { ...producto, stock: response.data.stock } : producto
        ));
        alert('Stock actualizado con éxito');
      } catch (error) {
        console.error('Error al actualizar el stock', error);
      }
    }
  };

  const handleEditClick = (id) => {
    setEditing(prev => ({ ...prev, [id]: true }));
  };

  const handleCancelClick = (id) => {
    setEditing(prev => ({ ...prev, [id]: false }));
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleMovimientosDialogOpen = () => {
    setMovimientosDialogOpen(true);
  };

  const handleMovimientosDialogClose = () => {
    setMovimientosDialogOpen(false);
  };

  const handleSaveMovement = async (tipoMovimiento, comentario, cambiosStock) => {
    try {
      const response = await axios.post(`${apiBaseUrl}/inventarios/movimiento`, {
        tipo: tipoMovimiento,
        comentario: comentario,
        cambiosStock: cambiosStock
      });
      alert(response.data.mensaje);
      fetchProductos();  // Actualiza la lista de productos después del movimiento
    } catch (error) {
      console.error('Error al registrar los movimientos de inventario', error);
      alert('Error al registrar los movimientos de inventario');
    }
  };

  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container maxWidth="xl" style={{ backgroundColor: '#EDE9DE', minHeight: '100vh', paddingTop: '20px' }}>
      <Typography variant="h4" gutterBottom>Gestión de Inventarios</Typography>
      <TextField
        variant="outlined"
        placeholder="Buscar producto"
        fullWidth
        margin="normal"
        value={search}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Button variant="contained" onClick={handleDialogOpen} style={{ marginBottom: '20px', backgroundColor: '#5A67D8', textTransform: 'none' }}>
        Registrar Movimiento de Inventario
      </Button>
      <Button variant="contained" onClick={handleMovimientosDialogOpen} style={{ marginBottom: '20px', marginLeft: '10px', backgroundColor: '#5A67D8', textTransform: 'none' }}>
        Ver Movimientos de Inventario
      </Button>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {filteredProductos.map(producto => (
            <Grid item xs={12} sm={6} md={4} key={producto.id}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h5">{producto.nombre}</Typography>
                  <Typography variant="body1">Precio: {formatCurrency(producto.precio)}</Typography>
                  <Typography variant="body2">Categoría: {producto.categoria}</Typography>
                  {editing[producto.id] ? (
                    <>
                      <TextField
                        label="Stock"
                        type="number"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={stockChanges[producto.id] !== undefined ? stockChanges[producto.id] : producto.stock}
                        onChange={(e) => handleStockChange(producto.id, e.target.value)}
                      />
                      <IconButton onClick={() => handleSaveStock(producto.id)} color="primary">
                        <SaveIcon />
                      </IconButton>
                      <IconButton onClick={() => handleCancelClick(producto.id)} color="secondary">
                        <CancelIcon />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <Typography variant="body1">Stock: {producto.stock !== undefined && producto.stock !== null ? producto.stock : 0}</Typography>
                      <IconButton onClick={() => handleEditClick(producto.id)} sx={{ color: '#5A67D8'}}>
                        <EditIcon />
                      </IconButton>
                    </>
                  )}
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}
      <InventoryDialog
        open={dialogOpen}
        handleClose={handleDialogClose}
        productos={productos}
        handleSaveMovement={handleSaveMovement}
      />
      <MovimientosDialog
        open={movimientosDialogOpen}
        handleClose={handleMovimientosDialogClose}
      />
    </Container>
  );
};

export default StockScreen;


