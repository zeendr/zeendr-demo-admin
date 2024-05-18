// ProductoCard.jsx
import React from 'react';
import { Card, CardContent, CardMedia, Typography, Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { red, blue } from '@mui/material/colors';

function ProductoCard({ producto, onDelete, onEdit }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card raised sx={{ maxWidth: 345, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <CardMedia
          component="img"
          sx={{ height: 200, objectFit: 'contain' }}
          image={producto.imagen_url || 'path_to_default_image.jpg'}
          alt="Imagen del producto"
        />
        <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
          <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'medium' }}>
            {producto.nombre}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.2rem' }}>
            Precio:  {formatCurrency(producto.precio)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
            Categoría: {producto.categoria}
          </Typography>
          <div>
            <IconButton onClick={() => onEdit(producto)} size="small" sx={{ color: blue[500], marginRight: 1 }}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => onDelete(producto)} size="small" sx={{ color: red[500] }}>
              <DeleteIcon />
            </IconButton>
          </div>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default ProductoCard;


