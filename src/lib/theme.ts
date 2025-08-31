import { createTheme } from '@mui/material/styles'

export default {}
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiImageListItem: {
      styleOverrides: {
        root: {
          overflow: 'hidden',
          borderRadius: 8,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiImageListItemBar: {
      styleOverrides: {
        root: {
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          color: 'white',
        },
      },
    },
  },
})
