import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PageTitle from '../components/PageTitle';
import AddFab from '../components/AddFab';
import TableLoading from '../components/table/elements/TableLoading';
import SuppliersListing from '../components/table/SuppliersListing';

const SUPPLIER_QUERY = gql`
  query SUPPLIER_QUERY($where: SupplierWhereInput, $orderBy: SupplierOrderByInput, $skip: Int) {
    suppliers(where: $where, orderBy: $orderBy, skip: $skip) {
      id
      name
      contactName
      email
      phone
      address
      web
      profile
    }
  }
`;

const Suppliers = (props) => {
  const page = props.match.params.page ? props.match.params.page : 1;
  const rows = [
    { id: 'name', numeric: false, label: 'Név' },
  ];

  return (
    <div>
      <PageTitle title="Beszállítók"/>
      <Query query={SUPPLIER_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return <TableLoading/>;
          return <SuppliersListing data={data.suppliers} page={page} rows={rows}/>;
        }}
      </Query>

      <AddFab title="Új beszállító" to="/supplier/add"/>
    </div>
  );
};

export default Suppliers;