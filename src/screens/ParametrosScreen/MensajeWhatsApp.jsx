import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Paper, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { styled } from '@mui/system';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const primaryColor = '#4A90E2';

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: primaryColor,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: primaryColor,
  }
}));

const ExampleAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
}));

const MensajeWhatsApp = () => {
  const [mensajes, setMensajes] = useState({
    "Pedido Recibido": '',
    "Pedido Enviado": '',
    "Pedido Entregado": ''
  });
  const [loading, setLoading] = useState(false);
  const [mensajeIds, setMensajeIds] = useState({
    "Pedido Recibido": null,
    "Pedido Enviado": null,
    "Pedido Entregado": null
  });

  useEffect(() => {
    const fetchMensajes = async () => {
      try {
        const response = await axios.get('https://domicilios-madriguera-ac104c9fedbe.herokuapp.com/mensajes');
        const fetchedMensajes = response.data.reduce((acc, mensaje) => {
          acc.mensajes[mensaje.estado] = mensaje.mensaje;
          acc.mensajeIds[mensaje.estado] = mensaje.id;
          return acc;
        }, { mensajes: {}, mensajeIds: {} });
        setMensajes(fetchedMensajes.mensajes);
        setMensajeIds(fetchedMensajes.mensajeIds);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMensajes();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setMensajes({ ...mensajes, [name]: value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const promises = Object.keys(mensajes).map(async (estado) => {
        const mensajeId = mensajeIds[estado];
        const mensaje = mensajes[estado];
        if (mensajeId) {
          return axios.put(`https://domicilios-madriguera-ac104c9fedbe.herokuapp.com/mensajes/${mensajeId}`, { estado, mensaje });
        } else {
          return axios.post('https://domicilios-madriguera-ac104c9fedbe.herokuapp.com/mensajes', { estado, mensaje });
        }
      });

      await Promise.all(promises);
      setLoading(false);
    } catch (error) {
      console.error('Error saving messages:', error);
      setLoading(false);
    }
  };

  return (
    
    <Box component={Paper} sx={{ p: 4, maxWidth: 900, margin: 'auto' }}>
        <h1>Mensajes de WhatsApp Personalizados</h1>
      <ExampleAccordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Ejemplos de Mensajes y Campos Dinámicos</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Puedes usar los siguientes campos dinámicos en tus mensajes:
          </Typography>
          <ul>
            <li><strong>{'{nombre_completo}'}</strong> - Nombre del cliente</li>
            <li><strong>{'{direccion}'}</strong> - Dirección de entrega</li>
            <li><strong>{'{productos}'}</strong> - Descripción de los productos</li>
            <li><strong>{'{metodo_pago}'}</strong> - Método de pago</li>
          </ul>
          <Typography>Ejemplo de mensaje para "Pedido Recibido":</Typography>
          <Typography variant="body2" component="div" sx={{ backgroundColor: '#f0f0f0', padding: 1, borderRadius: 1, marginTop: 1 }}>
            🐇 Hola {`{nombre_completo}`}, ¡tu pedido fue recibido! 🐇<br />
            📦 Productos: {`{productos}`}<br />
            🏠 Dirección de entrega: {`{direccion}`}<br />
            💳 Método de pago: {`{metodo_pago}`}<br />
            <br />
            Tu pedido será enviado en el transcurso del día. Recuerda que salen rutas cada 3 horas.<br />
            ¡Gracias por elegirnos! 🐇
          </Typography>
          <Typography>Ejemplo de mensaje para "Pedido Enviado":</Typography>
          <Typography variant="body2" component="div" sx={{ backgroundColor: '#f0f0f0', padding: 1, borderRadius: 1, marginTop: 1 }}>
            🚚 Hola {`{nombre_completo}`}, tu pedido está en camino. 🛵<br />
            🏠 Dirección de entrega: {`{direccion}`}<br />
            📦 Productos: {`{productos}`}<br />
            <br />
            ¡Gracias por tu compra! 🐇
          </Typography>
          <Typography>Ejemplo de mensaje para "Pedido Entregado":</Typography>
          <Typography variant="body2" component="div" sx={{ backgroundColor: '#f0f0f0', padding: 1, borderRadius: 1, marginTop: 1 }}>
            ✅ Hola {`{nombre_completo}`}, tu pedido ha sido entregado. 🎉<br />
            📦 Productos: {`{productos}`}<br />
            <br />
            ¡Esperamos que disfrutes tu compra! 🐇
          </Typography>
        </AccordionDetails>
      </ExampleAccordion>

      <TextField
        label="Pedido Recibido"
        name="Pedido Recibido"
        value={mensajes["Pedido Recibido"]}
        onChange={handleChange}
        fullWidth
        multiline
        rows={12}
        margin="normal"
        variant="outlined"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Pedido Enviado"
        name="Pedido Enviado"
        value={mensajes["Pedido Enviado"]}
        onChange={handleChange}
        fullWidth
        multiline
        rows={12}
        margin="normal"
        variant="outlined"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Pedido Entregado"
        name="Pedido Entregado"
        value={mensajes["Pedido Entregado"]}
        onChange={handleChange}
        fullWidth
        multiline
        rows={12}
        margin="normal"
        variant="outlined"
        InputLabelProps={{ shrink: true }}
      />
      <StyledButton
        variant="contained"
        onClick={handleSave}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? 'Guardando...' : 'Guardar'}
      </StyledButton>
    </Box>
  );
};

export default MensajeWhatsApp;
