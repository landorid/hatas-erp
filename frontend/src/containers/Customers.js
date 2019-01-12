import React from 'react';
import gql from 'graphql-tag';
import PageTitle from '../components/PageTitle';
import AddFab from '../components/AddFab';
import CustomersListing from '../components/table/CustomersListing';
import { Query } from 'react-apollo';
import TableLoading from '../components/table/elements/TableLoading';

const CUSTOMERS_QUERY = gql`
  query CUSTOMERS_QUERY($where: CustomerWhereInput, $orderBy: CustomerOrderByInput, $skip: Int) {
    customers(where: $where, orderBy: $orderBy, skip: $skip, first: 200) {
      id
      name
      contactName
      email
      phone
      address
      taxNumber
      status
      note
      updatedAt
      status
    }
  }
`;

const Customers = (props) => {
  const page = props.match.params.page ? props.match.params.page : 1;
  const rows = [
    { id: 'name', numeric: false, label: 'Név' },
    { id: 'status', numeric: false, label: 'Státusz' },
  ];

  return (
    <div>
      <PageTitle title="Ügyfelek"/>
      <Query query={CUSTOMERS_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return <TableLoading/>;
          return <CustomersListing data={data.customers} page={page} rows={rows}/>;
        }}
      </Query>

      <AddFab title="Új ügyfél" to="/customers/add"/>
    </div>
  );
};

export default Customers;