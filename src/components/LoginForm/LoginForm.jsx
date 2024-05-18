import React from 'react';
import { Box, TextField, Button, Typography, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import logo from '../../assets/logo2.png';
import backgroundImage from '../../assets/fondo.png';

import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/authSlice';

const LoginForm = () => {
    const [showPassword, setShowPassword] = React.useState(false);
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Inicio de sesión");
        dispatch(login());
    };

    if (isAuthenticated) {
        return null;
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                position: 'relative', // <-- Añadido para posicionamiento relativo
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '300px',
                    margin: '0 auto',
                    padding: '20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '10px',
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                }}
            >
                <img src={logo} alt="logo" style={{ width: '120px', marginBottom: '20px'}} />
                <Typography variant="h4" sx={{ fontFamily: 'Poppins', marginBottom: '20px', color: '#333', fontWeight: 'bold' }}>Ingresar</Typography>
                <TextField 
                    label="Correo" 
                    variant="outlined" 
                    sx={{ marginBottom: '20px', width: '100%', height: '56px' }} 
                />
                <TextField 
                   label="Contraseña" 
                   variant="outlined"
                   type={showPassword ? 'text' : 'password'}
                   sx={{ marginBottom: '20px', width: '100%', height: '56px' }}
                   InputProps={{
                       endAdornment: (
                           <InputAdornment position="end">
                               <IconButton
                                   aria-label="toggle password visibility"
                                   onClick={() => setShowPassword(!showPassword)}
                               >
                                   {showPassword ? <VisibilityOff /> : <Visibility />}
                               </IconButton>
                           </InputAdornment>
                       )
                    }}
                />
                <Button 
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ backgroundColor: '#EFE8DD', '&:hover': { backgroundColor: '#f3eee7' }, color: 'black', fontFamily: 'Poppins', borderRadius: '10px', textTransform: 'none', padding: '10px 7px', fontSize: '17px', marginTop: '7px', marginBottom: '5px', marginLeft: '7px', fontWeight: 'bold' }}
                >
                    Iniciar sesión
                </Button>
                <Button 
                   type="button" // <- No queremos que este botón envíe el formulario.
                   variant="text" // <- Para que se vea como un botón ligero, no lleno.
                   sx={{ 
                      color: 'black', // <- Para que tenga el mismo color que el botón de "Iniciar sesión".
                      fontFamily: 'Poppins',
                      textTransform: 'none',
                      fontSize: '15px',
                      marginTop: '10px',
                    }}
                     onClick={() => {
                        // Aquí puedes agregar la lógica para redirigir al usuario a la página de recuperación de contraseña, mostrar un modal, etc.
                        console.log("Redirigir a recuperación de contraseña");
                     }}
                >
                   ¿Olvidaste tu contraseña?
                </Button>
            </Box>
        </Box>
    );
};

export default LoginForm;

