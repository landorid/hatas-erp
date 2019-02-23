import React from 'react';
import gql from 'graphql-tag';
import { adopt } from 'react-adopt';
import { Mutation, Query } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import ProductForm from '../components/form/ProductForm';
import FormLoading from '../components/form/elements/FormLoading';

const UPSERT_PRODUCTTEMPLATE_MUTATION = gql`
  mutation UPSERT_PRODUCTTEMPLATE_MUTATION($where: ID $data: ProductTemplateInput!) {
    upsertProductTemplateItem(where: $where, data: $data) {
      id
      name
      status
      updatedAt
      fields {
        id
        type
        name
        default
        suffix
        role
        required
      }
    }
  }
`;

const PRODUCTTEMPLATE_QUERY = gql`
  query PRODUCTTEMPLATE_QUERY($id: ID!) {
    productTemplate(where: {id: $id}) {
      id
      name
      status
      updatedAt
      fields {
        id
        type
        name
        default
        suffix
        role
        required
      }
    }
  }
`;

const ComposedProductTemplate = adopt({
  productTemplate: ({ single, render }) =>
    <Query query={PRODUCTTEMPLATE_QUERY}
           children={render}
           fetchPolicy="cache-first"
           variables={{ id: single }}
           skip={!single}/>,
  upsertProductTemplate: ({ render }) =>
    <Mutation mutation={UPSERT_PRODUCTTEMPLATE_MUTATION}>
      {(mutation, result) => render({ mutation, result })}
    </Mutation>,
});

const Product = props => {
  const singleProductTemplate = props.match.params.id;

  return (
    <ComposedProductTemplate single={singleProductTemplate}>
      {({
          upsertProductTemplate: {
            mutation, result: { data, loading },
          },
          productTemplate: {
            data: dataProductTemplate, loading: dataLoading,
          },
        }) => {

        if (dataLoading)
          return <FormLoading size={3}/>;

        if (!singleProductTemplate && !loading && data && data.upsertProductTemplateItem.id)
          return <Redirect to={`/product/${data.upsertProductTemplateItem.id}`}/>;

        if (singleProductTemplate && !dataProductTemplate.productTemplate)
          return <Redirect to={`/products/`}/>;

        return ( <>
          <PageTitle title={singleProductTemplate ?
            dataProductTemplate.productTemplate.name : 'Új terméksablon'}/>
          <ProductForm mutation={mutation}
                       data={singleProductTemplate ? dataProductTemplate.productTemplate : null}/>
        </> );
      }}
    </ComposedProductTemplate>
  );
};

export default Product;
export { PRODUCTTEMPLATE_QUERY };