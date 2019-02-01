import React from 'react';
import gql from 'graphql-tag';
import { adopt } from 'react-adopt';
import { Mutation, Query } from 'react-apollo';
import PageTitle from '../components/PageTitle';
import StockItemForm from '../components/form/StockItemForm';
import FormLoading from '../components/form/elements/FormLoading';

const CREATE_STOCKITEM_MUTATION = gql`
  mutation CREATE_STOCKITEM_MUTATION(
  $where: StockItemWhereUniqueInput!
  $create: StockItemCreateInput!
  $update: StockItemUpdateInput!) {
    upsertStockItem(where: $where, create: $create, update: $update) {
      id
      name
      category {
        id
      }
      quantity
      quantityUnit
      quantityAlarm
    }
  }
`;

const STOCKCATEGORIES_QUERY = gql`
  query STOCKCATEGORIES_QUERY {
    stockCategories(orderBy: name_ASC) {
      id
      name
      parent {
        id
      }
    }
  }
`;

const STOCK_ITEM_QUERY = gql`
  query STOCK_ITEM_QUERY($id: ID!) {
    stockItem(where: {id: $id}) {
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
      updatedAt
    }
  }
`;

const ComposedStockItem = adopt({
  stockCategory: ({ render }) =>
    <Query query={STOCKCATEGORIES_QUERY} children={render}/>,
  stockItem: ({ single, render }) =>
    <Query query={STOCK_ITEM_QUERY}
           children={render}
           variables={{ id: single }}
           skip={!single}/>,
  createStockItem: ({ render }) =>
    <Mutation mutation={CREATE_STOCKITEM_MUTATION}>
      {(mutation, result) => render({ mutation, result })}
    </Mutation>,
});

const StockItem = (props) => {
  const singleStockItem = props.match.params.id;

  return (
    <ComposedStockItem single={singleStockItem}>
      {({ stockCategory, stockItem, createStockItem }) => {
        if (stockItem.loading || stockCategory.loading) return <>
          <PageTitle title="Betöltés..."/>
          <FormLoading size={2}/>
        </>;
        return ( <>
          <PageTitle title={singleStockItem ? stockItem.data.stockItem.name : 'Új alapanyag'}/>
          <StockItemForm
            mutation={createStockItem.mutation}
            data={singleStockItem ? stockItem.data.stockItem : null}
            categories={stockCategory.data.stockCategories}
          />
        </> );
      }}
    </ComposedStockItem>
  );
};

export default StockItem;