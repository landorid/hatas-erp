import React from 'react';
import PageTitle from '../components/PageTitle';
import AddFab from '../components/AddFab';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import TableLoading from '../components/table/elements/TableLoading';
import StockListing from '../components/table/StockListing';

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
  const page = props.match.params.page ? props.match.params.page : 1;

  const rows = [
    { id: 'name', numeric: false, label: 'Megnevezés' },
    { id: 'quantity', numeric: true, label: 'Raktárkészlet' },
  ];

  return (
    <div>
      <PageTitle title="Alapanyagok"/>
      <Query query={STOCK_ITEMS_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return <TableLoading/>;
          return <StockListing data={data.stockItems}
                               page={page}
                               rows={rows}/>;
        }}
      </Query>

      <AddFab title="Új alapanyag" to="/stock/add"/>
    </div>
  );
};

export default Stock;
export { STOCK_ITEMS_QUERY };