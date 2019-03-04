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
    // secondary: {
    //   main: '#FDD835',
    //   contrastText: '#ffffff',
    // },
  },
  overrides: {
    MUIDataTableBodyCell: {
      root: {
        cursor: 'pointer',
      },
    },
  },
});
