import React from 'react';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import PageTitle from '../components/PageTitle';
import CustomerForm from '../components/form/CustomerForm';
import { Redirect } from 'react-router-dom';
import FormLoading from '../components/form/elements/FormLoading';

const CREATE_CUSTOMER_MUTATION = gql`
  mutation CREATE_CUSTOMER_MUTATION($data: CustomerCreateInput!) {
    createCustomer(data: $data) {
      id
    }
  }
`;

const SINGLE_CUSTOMER_QUERY = gql`
  query SINGLE_CUSTOMER_QUERY($id: ID!) {
    customer(where: {id: $id}) {
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
    }
  }
`;

const UPDATE_CUSTOMER_MUTATION = gql`
  mutation UPDATE_CUSTOMER_MUTATION($data: CustomerUpdateInput!,$where: CustomerWhereUniqueInput!) {
    updateCustomer(data: $data, where: $where) {
      id
    }
  }
`;

const Customer = (props) => {
  const singleCustomer = props.match.params.id;

  //TODO: global error notification

  return singleCustomer ? (
    <div>
      <Query query={SINGLE_CUSTOMER_QUERY}
             variables={{ id: singleCustomer }}
             fetchPolicy="cache-first"
      >
        {({ data, loading: dataLoading, error }) => {
          if (!dataLoading && !data.customer) {
            return <Redirect to={`/customers`}/>;
          }

          return (
            <>
              <PageTitle title={dataLoading ? 'Betöltés...' : data.customer.name}/>
              <Mutation mutation={UPDATE_CUSTOMER_MUTATION}>
                {(updateCustomer, { error }) => {
                  if (dataLoading) return <FormLoading/>;

                  return <CustomerForm mutation={updateCustomer} data={data.customer}/>;
                }}
              </Mutation>
            </>
          );
        }}
      </Query>
    </div>
  ) : (
    <div>
      <PageTitle title="Új ügyfél"/>
      <Mutation mutation={CREATE_CUSTOMER_MUTATION}>
        {(createCustomer, { loading, data }) => {

          if (!loading && data && data.createCustomer.id) {
            return <Redirect to={`/customer/${data.createCustomer.id}`}/>;
          }

          return <CustomerForm mutation={createCustomer}/>;
        }}
      </Mutation>
    </div> );
};

export default Customer;
export { SINGLE_CUSTOMER_QUERY };