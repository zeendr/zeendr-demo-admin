import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import BarrioTable from './BarrioTable';
import CategoriaTable from './CategoriaTable';
import MensajeWhatsApp from './MensajeWhatsApp';
import HorarioAtencion from './HorarioAtencion'; // Importamos el nuevo componente

// Componente TabPanel para mostrar el contenido de cada pestaña
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const ParametrosScreen = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
        <Tab label="Barrios y Costos de Domicilio" id="tab-0" aria-controls="tabpanel-0" />
        <Tab label="Categorías del Menú" id="tab-1" aria-controls="tabpanel-1" />
        <Tab label="Mensajes de WhatsApp" id="tab-2" aria-controls="tabpanel-2" />
        <Tab label="Horarios de Atención" id="tab-3" aria-controls="tabpanel-3" /> {/* Nueva pestaña */}
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        <BarrioTable />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <CategoriaTable />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <MensajeWhatsApp />
      </TabPanel>
      <TabPanel value={tabValue} index={3}> {/* Nuevo TabPanel */}
        <HorarioAtencion />
      </TabPanel>
    </Box>
  );
};

export default ParametrosScreen;
