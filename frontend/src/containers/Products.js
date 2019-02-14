import React from 'react';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import { format } from 'date-fns';
import MUIDataTable from 'mui-datatables';
import Button from '@material-ui/core/Button';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import PageTitle from '../components/PageTitle';
import TableLoading from '../components/table/elements/TableLoading';
import { tableLabels } from '../config';

const PRODUCTTEMPLATE_SQUERY = gql`
  query PRODUCTTEMPLATE_SQUERY {
    productTemplates {
      id
      name
      status
      createdAt
    }
  }
`;

const getMuiTheme = () => createMuiTheme({
  overrides: {
    MUIDataTableBodyCell: {
      root: {
        cursor: 'pointer',
      },
    },
  },
});

const Products = props => {
  const { classes, history } = props;

  const columns = [
    {
      name: 'ID',
      display: 'excluded',
      options: {
        display: 'excluded',
        filter: false,
      },
    },
    {
      name: 'Megnevezés',
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return value;
        },
      },
    },
    {
      name: 'Állapot',
      options: {
        customBodyRender: (value) => {
          return value ? 'Elérhető' : 'Nem elérhető';
        },
      },
    },
    {
      name: 'Létrehozva',
      options: {
        customBodyRender: (value) => {
          return format(value, 'YYYY. MM. D. HH:s');
        },
      },
    },
  ];

  const options = {
    selectableRows: false,
    fixedHeader: true,
    print: false,
    onRowClick: (currentRowsSelected) => {
      history.push(`/product/${currentRowsSelected[0]}`);
    },
    ...tableLabels,
  };

  return (
    <>
      <PageTitle title="Termékek"/>

      <Query query={PRODUCTTEMPLATE_SQUERY}>
        {({ data, loading, error }) => {
          if (loading) return <TableLoading/>;
          const newData = data.productTemplates.reduce((array, item) => {
            const newItem = [];
            delete item.__typename;
            Object.keys(item).map(key => newItem.push(item[key]));
            array.push(newItem);

            return array;
          }, []);

          return <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              title={<Button color="primary"
                             to="/product/add"
                             component={Link}
                             variant="contained">Új Termék</Button>}
              data={newData}
              columns={columns}
              options={options}/>
          </MuiThemeProvider>;
        }}
      </Query>
    </>
  );
};
export default Products;