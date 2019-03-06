import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: '#00A0E3',
      contrastText: '#ffffff',
    },
  },
  overrides: {
    MUIDataTableBodyCell: {
      root: {
        cursor: 'pointer',
      },
    },
  },
});
