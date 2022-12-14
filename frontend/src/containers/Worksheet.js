import React from 'react';
import { adopt } from 'react-adopt';
import { Mutation, Query } from 'react-apollo';
import PageTitle from '../components/PageTitle';
import WorksheetForm from '../components/form/WorksheetForm';
import gql from 'graphql-tag';
import { CUSTOMERS_QUERY } from './Customers';
import { TAGS_SQUERY } from './Tags';
import { CURRENT_USER_QUERY } from '../components/User';
import ErrorMessage from '../components/ErrorMessage';
import { Redirect } from 'react-router-dom';
import WorksheetLoading from '../components/worksheet/WorksheetLoading';

const PRODUCTTEMPLATES_SQUERY = gql`
  query PRODUCTTEMPLATES_SQUERY {
    productTemplates(where: {status: 1}) {
      id
      name
      fields {
        id
        type
        name
        suffix
        role
        required
      }
    }
  }
`;

const USERS_QUERY = gql`
  query USERS_QUERY {
    users(where: {status: true}) {
      id
      lastName
      firstName
      job
    }
  }
`;

const WORKSHEET_QUERY = gql`
  query WORKSHEET_QUERY($id: ID!) {
    worksheet(where: {id: $id}) {
      id
      name
      updatedAt
      owner {
        id
      }
      customer {
        id
        name
      }
      status
      cover
      responsible {
        id
        firstName
        lastName
      }
      tags {
        id
        name
      }
      products {
        id
        template {
          id
          name
          fields {
            id
            type
            name
            suffix
            role
            required
          }
        }
        fields {
          id
          value
        }
      }
    }
  }
`;

const UPSERT_WORKSHEET = gql`
  mutation UPSERT_WORKSHEET(
  $where: WorksheetWhereUniqueInput!
  $create: WorksheetCreateInput!
  $update: WorksheetUpdateInput!
  ) {
    upsertWorksheet(where: $where, create: $create, update: $update) {
      id
      name
      owner {
        id
        firstName
        lastName
      }
      customer {
        id
        name
      }
      status
      cover
      responsible {
        id
        firstName
        lastName
      }
      tags {
        id
        name
      }
      products {
        id
        template {
          id
          name
          fields {
            id
            type
            name
            suffix
            role
            required
          }
        }
        fields {
          id
          value
        }
      }
    }
  }
`;

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

const ComposedWorksheet = adopt({
  templates: ({ single, render }) =>
    <Query query={PRODUCTTEMPLATES_SQUERY}
           children={render}
           variables={{ where: { status: 1 } }}
           fetchPolicy="cache-first"/>,
  customers: ({ single, render }) =>
    <Query query={CUSTOMERS_QUERY}
           children={render}
           variables={{ where: { status: 1 } }}
           fetchPolicy="cache-first"/>,
  tags: ({ single, render }) =>
    <Query query={TAGS_SQUERY}
           children={render}
           fetchPolicy="cache-first"/>,
  users: ({ single, render }) =>
    <Query query={USERS_QUERY}
           children={render}
           variables={{ where: { status: 1 } }}
           fetchPolicy="cache-first"/>,
  me: ({ single, render }) =>
    <Query query={CURRENT_USER_QUERY}
           children={render}
           fetchPolicy="cache-first"/>,
  worksheet: ({ single, render }) =>
    <Query query={WORKSHEET_QUERY}
           children={render}
           variables={{ id: single }}
           skip={!single}
           fetchPolicy="cache-and-network"/>,
  stock: ({ single, render }) =>
    <Query query={STOCK_ITEMS_QUERY}
           children={render}
           fetchPolicy="cache-first"/>,
  upsertWorksheet: ({ render }) =>
    <Mutation mutation={UPSERT_WORKSHEET}>
      {(mutation, result) => render({ mutation, result })}
    </Mutation>,
});

const Worksheet = props => {
  const singleWorksheet = props.match.params.id;
  return (
    <ComposedWorksheet single={singleWorksheet}>
      {({ customers, templates, tags, me, upsertWorksheet, users, worksheet, stock }) => {

        if (templates.loading || customers.loading || worksheet.loading
          || tags.loading || me.loading || users.loading || stock.loading) return <>
          <PageTitle title={' ...'}/>
          <WorksheetLoading/>
        </>;

        if (!singleWorksheet && upsertWorksheet.result.data && !upsertWorksheet.result.loading) return <Redirect
          to={`/worksheet/${upsertWorksheet.result.data.upsertWorksheet.id}`}/>;
        if (singleWorksheet && !worksheet.data.worksheet) return <Redirect to={`/worksheets/`}/>;

        return (
          <>
            <ErrorMessage error={upsertWorksheet.result.error}/>
            <PageTitle title={singleWorksheet ? worksheet.data.worksheet.name : '??j munkalap'}/>
            <WorksheetForm customers={customers.data.customers}
                           tags={tags.data.tags}
                           me={me.data.me}
                           users={users.data.users}
                           data={singleWorksheet ? worksheet.data.worksheet : null}
                           stock={stock.data.stockItems}
                           mutation={upsertWorksheet.mutation}
                           templates={templates.data.productTemplates}/>
          </>
        );
      }}
    </ComposedWorksheet>
  );
};

Worksheet.propTypes = {};

export default React.memo(Worksheet);