import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import TableLoading from '../components/table/elements/TableLoading';
import MUIDataTable from 'mui-datatables';
import { tableLabels } from '../config';
import Button from '@material-ui/core/Button';

const STOCK_ITEMS_QUERY = gql`
  query STOCK_ITEMS_QUERY {
    stockItems(orderBy: createdAt_ASC) {
      id
      name
      category {
        id
        parent {
          id
        }
      }
      quantity
      quantityUnit
      quantityAlarm
      createdAt
    }
  }
`;

const Stock = (props) => {
  const { history } = props;

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
      name: 'Készlet',
      options: {
        customBodyRender: (value, tableMeta) => {
          const unit = tableMeta.rowData[3];
          return `${value} ${unit}`;
        },
      },
    },
    {
      name: 'Mennyiségi egység',
      display: 'excluded',
      options: {
        display: 'excluded',
        filter: false,
      },
    },
    {
      name: 'Állapot',
      options: {
        customBodyRender: (value, tableMeta) => {
          const onStock = tableMeta.rowData[2] >= value;
          return onStock ? 'Készleten' : 'Rendelés szükséges';
        },
      },
    },
  ];

  const options = {
    selectableRows: false,
    fixedHeader: true,
    print: false,
    onRowClick: (currentRowsSelected) => {
      history.push(`/stock/${currentRowsSelected[0]}`);
    },
    ...tableLabels,
  };

  return (
    <div>
      <PageTitle title="Alapanyagok"/>
      <Query query={STOCK_ITEMS_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return <TableLoading/>;

          //we don't need all queried data, but we have to query it because of cache for single
          const usedDataOnly = data.stockItems.map(item => ( {
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            quantityUnit: item.quantityUnit,
            quantityAlarm: item.quantityAlarm,
          } ));

          const newData = usedDataOnly.reduce((array, item) => {
            const newItem = [];
            Object.keys(item).map(key => newItem.push(item[key]));
            array.push(newItem);

            return array;
          }, []);

          return <MUIDataTable
              title={<>
                <Button color="primary"
                        to="/stock/add"
                        component={Link}
                        variant="contained">Új Alapanyag</Button>
                <Button color="primary"
                        style={{ marginLeft: 10 }}
                        to="/stock/category"
                        component={Link}
                        variant="contained">Kategóriák</Button>
              </>}
              data={newData}
              columns={columns}
              options={options}/>;
        }}
      </Query>
    </div>
  );
};

export default Stock;
export { STOCK_ITEMS_QUERY };