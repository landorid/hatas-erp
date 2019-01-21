import React from 'react';
import PageTitle from '../components/PageTitle';
import StockCategoryForm from '../components/form/StockCategoryForm';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import { adopt } from 'react-adopt';
import StockCategoryLoader from '../components/table/loader/StockCategoryLoader';

const STOCKCATEGORIES_QUERY = gql`
  query STOCKCATEGORIES_QUERY {
    stockCategories(orderBy: createdAt_ASC) {
      id
      name
      parent {
        id
      }
    }
  }
`;

const CREATE_STOCKCATEGORY_MUTATION = gql`
  mutation CREATE_STOCKCATEGORY_MUTATION(
  $where: StockCategoryWhereUniqueInput!
  $create: StockCategoryCreateInput!
  $update: StockCategoryUpdateInput!) {
    upsertStockCategory(where: $where, create: $create, update: $update) {
      id
      name
      parent {
        id
      }
    }
  }
`;

const DELETE_STOCKCATEGORY_MUTATION = gql`
  mutation DELETE_STOCKCATEGORY_MUTATION ($where: StockCategoryWhereInput){
    deleteManyStockCategories(where: $where) {
      count
    }
  }
`;

const Composed = adopt({
  stockCategories: ({ render }) =>
    <Query query={STOCKCATEGORIES_QUERY} children={render} fetchPolicy="cache-first"/>,
  createCategory: ({ render }) =>
    <Mutation
      refetchQueries={[{ query: STOCKCATEGORIES_QUERY }]}
      mutation={CREATE_STOCKCATEGORY_MUTATION}>
      {(mutation, result) => render({ mutation, result })}
    </Mutation>,
  deleteCategory: ({ render }) =>
    <Mutation
      refetchQueries={[{ query: STOCKCATEGORIES_QUERY }]}
      mutation={DELETE_STOCKCATEGORY_MUTATION} ignoreResults>
      {(mutation, result) => render({ mutation, result })}
    </Mutation>,
});
const StockCategory = () => {

  return (
    <div>
      <PageTitle title="Alapanyag kategóriák"/>
      <Composed>
        {({ stockCategories, createCategory, deleteCategory }) => {
          if (stockCategories.loading ) return <StockCategoryLoader/>;
          return <StockCategoryForm
            data={stockCategories.data.stockCategories}
            mutation={createCategory.mutation}
            deleteMutation={deleteCategory.mutation}
          />;

        }}
      </Composed>
    </div>
  );
};

export default StockCategory;
export { STOCKCATEGORIES_QUERY };