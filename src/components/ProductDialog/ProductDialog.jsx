import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, CircularProgress, Card, CardMedia
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function ProductoDialog({ open, handleClose, handleChange, handleAddProducto, nuevoProducto, loading, editMode }) {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('https://domicilios-madriguera-ac104c9fedbe.herokuapp.com/categorias');
        setCategorias(response.data);
      } catch (error) {
        console.error('Error fetching categorias:', error);
      }
    };

    fetchCategorias();
  }, []);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Añadir Nuevo Producto</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="nombre"
          label="Nombre del Producto"
          type="text"
          fullWidth
          variant="outlined"
          name="nombre"
          value={nuevoProducto.nombre}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          id="precio"
          label="Precio"
          type="number"
          fullWidth
          variant="outlined"
          name="precio"
          value={nuevoProducto.precio}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          id="descripcion"
          label="Descripción del Producto"
          type="text"
          fullWidth
          variant="outlined"
          name="descripcion"
          value={nuevoProducto.descripcion || ''}  // Asegurarte de manejar un valor predeterminado
          onChange={handleChange}
          multiline
          rows={4}  // Especificar el número de filas
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="categoria-label">Categoría</InputLabel>
          <Select
            labelId="categoria-label"
            id="categoria"
            value={nuevoProducto.categoria}
            label="Categoría"
            name="categoria"
            onChange={handleChange}
          >
            {categorias.map((categoria) => (
              <MenuItem key={categoria.id} value={categoria.nombre}>
                {categoria.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          component="label"
          startIcon={<AddCircleOutlineIcon />}
          sx={{ mt: 1 }}
        >
          {editMode ? "Reemplaza tu imagen" : "Sube Tu Imagen"}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleChange}
            name="imagen"
          />
        </Button>
        {nuevoProducto.imagen && (
          <Card sx={{ margin: '10px 0', maxWidth: 345 }}>
            <CardMedia
              component="img"
              sx={{ height: 200, objectFit: 'contain', width: '100%' }}
              image={nuevoProducto.imagen}
              alt="Vista previa de la imagen"
            />
          </Card>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleAddProducto} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Agregar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductoDialog;
