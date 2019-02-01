import React from 'react';
import gql from 'graphql-tag';
import { adopt } from 'react-adopt';
import { Mutation, Query } from 'react-apollo';
import PageTitle from '../components/PageTitle';
import SupplierForm from '../components/form/SupplierForm';
import FormLoading from '../components/form/elements/FormLoading';

const CREATE_SUPPLIER_MUTATION = gql`
  mutation CREATE_SUPPLIER_MUTATION(
  $where: SupplierWhereUniqueInput!
  $create: SupplierCreateInput!
  $update: SupplierUpdateInput!) {
    upsertSupplier(where: $where, create: $create, update: $update) {
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

const SUPPLIER_QUERY = gql`
  query SUPPLIER_QUERY($id: ID!) {
    supplier(where: {id: $id}) {
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

const ComposedSupplier = adopt({
  supplier: ({ single, render }) =>
    <Query query={SUPPLIER_QUERY}
           children={render}
           fetchPolicy="cache-first"
           variables={{ id: single }}
           skip={!single}/>,
  createSupplier: ({ render }) =>
    <Mutation mutation={CREATE_SUPPLIER_MUTATION}>
      {(mutation, result) => render({ mutation, result })}
    </Mutation>,
});

const Supplier = (props) => {
  const singleSupplier = props.match.params.id;

  return (
    <ComposedSupplier single={singleSupplier}>
      {({ supplier, createSupplier }) => {
        if (supplier.loading ) return <>
          <PageTitle title="Betöltés..."/>
          <FormLoading size={2}/>
        </>;
        return ( <>
          <PageTitle title={singleSupplier ? supplier.data.supplier.name : 'Új beszállító'}/>
          <SupplierForm
            mutation={createSupplier.mutation}
            data={singleSupplier ? supplier.data.supplier : null}
          />
        </> );
      }}
    </ComposedSupplier>
  );
};

export default Supplier;