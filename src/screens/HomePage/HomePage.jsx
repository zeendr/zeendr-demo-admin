import React from 'react';
import { Box, Typography, Button, Grid, Container, useMediaQuery, useTheme, Card, CardContent, CardHeader, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import logoClient from '../../assets/logo2.png';
import logoDeveloper from '../../assets/logo33.png';
import QrCodeIcon from '@mui/icons-material/QrCode';
import SettingsIcon from '@mui/icons-material/Settings';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import StorefrontIcon from '@mui/icons-material/Storefront';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

function HomePage() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const cardStyles = {
    width: 275, // Cambia este valor según lo que necesites.
    height: 'auto',
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'scale(1.1)'
    }
  };

  return (
    <Container style={{ 
       display: 'flex',
       flexDirection: 'column',
       alignItems: 'center',
       justifyContent: 'center',
       backgroundSize: 'cover', 
       backgroundRepeat: 'no-repeat' 
    }}>
      
      <Box sx={{ padding: '3rem 0', textAlign: isSmallScreen ? 'center' : 'initial' }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <img src={logoClient} alt="Logo del cliente" width={isSmallScreen ? '150' : '250'} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              Bienvenido a Zeendr Delivery
            </Typography>
            <Typography variant="h6" gutterBottom>
              Gestiona eficazmente tus planes de servicio de domicilios propios y ten total control sobre tus pedidos.
            </Typography>
            <Button variant="contained" size="large" sx={{mt: 2, backgroundColor: '#5E55FE', color: 'white', borderRadius: '10px', '&:hover': { backgroundColor: '#7b45a1' },}}>
              Empezar
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ margin: '4rem 0' }}>
        <Typography variant="h5" gutterBottom textAlign="center">
          Funciones principales
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            { title: "Scan QR", desc: "Escanee códigos QR para obtener información valiosa.", link: '/qr', icon: <QrCodeIcon /> },
            { title: "Clientes", desc: "Administra la información de tus clientes.", link: '/clientes', icon: <EmojiPeopleIcon /> },
            { title: "Data", desc: "Accede a los datos relevantes de tu negocio.", link: '/data', icon: <StorefrontIcon /> },
            { title: "Fidelización", desc: "Crea y gestiona tus planes de fidelización.", link: '/fidelizacion', icon: <Diversity3Icon /> },
            { title: "Mi Cuenta", desc: "Administra tus ajustes y preferencias.", link: '/cuenta', icon: <SettingsIcon /> },
            { title: "Soporte", desc: "Obtén ayuda en tiempo real cuando lo necesites.", link: '/soporte', icon: <SupportAgentIcon /> }
          ].map((item, index) => (
            <Grid key={index} item xs={12} sm={6} md={4}>
              <Link to={item.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card sx={cardStyles}>
                  <CardHeader
                    avatar={<Avatar aria-label="feature" sx={{ backgroundColor: '#5E55FE', color: 'white' }}>{item.icon || item.title.charAt(0)}</Avatar>}
                    title={item.title}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {item.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ padding: '3rem 0', backgroundColor: '#ffffff' }}>
        <Typography variant="body2" align="center">
          Desarrollado por:
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
          <img src={logoDeveloper} alt="Logo del desarrollador" width="150" />
        </Box>
      </Box>
      
    </Container>
  );
}

export default HomePage;


