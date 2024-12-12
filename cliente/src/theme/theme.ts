import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5A157F', // Cor primária principal
      contrastText: '#ffffff', // Texto de contraste
    },
    secondary: {
      main: '#2bff64', // Cor secundária principal
      contrastText: '#ffffff',
    },
    background: {
      default: '#454444', // Cor de fundo
      paper: '#ffffff', // Cor de cartões
    },
    warning: {
      main: '#ff2151', // Cor de alerta
    },
    success: {
      main: '#28a745', // Cor de sucesso
    },
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'white',
            color: '#5A157F',
          },
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '8px',
        },
      },
    },
  },
});

export default theme;
