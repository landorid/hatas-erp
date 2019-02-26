import React from 'react';
import { adopt } from 'react-adopt';
import { Mutation, Query } from 'react-apollo';
import PageTitle from '../components/PageTitle';
import WorksheetForm from '../components/form/WorksheetForm';
import gql from 'graphql-tag';
import { CUSTOMERS_QUERY } from './Customers';
import { TAGS_SQUERY } from './Tags';
import { CURRENT_USER_QUERY } from '../components/User';

const PRODUCTTEMPLATES_SQUERY = gql`
  query PRODUCTTEMPLATES_SQUERY {
    productTemplates {
      id
      name
      status
      updatedAt
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

const UPSERT_WORKSHEET = gql`
  mutation UPSERT_WORKSHEET(
  $where: WorksheetWhereUniqueInput!
  $create: WorksheetCreateInput!
  $update: WorksheetUpdateInput!
  ) {
    upsertWorksheet(where: $where, create: $create, update: $update) {
      id
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
           fetchPolicy="cache-first"/>,
  tags: ({ single, render }) =>
    <Query query={TAGS_SQUERY}
           children={render}
           fetchPolicy="cache-first"/>,
  users: ({ single, render }) =>
    <Query query={USERS_QUERY}
           children={render}
           fetchPolicy="cache-first"/>,
  me: ({ single, render }) =>
    <Query query={CURRENT_USER_QUERY}
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
      {({ customers, templates, tags, me, upsertWorksheet, users }) => {
        if (templates.loading || customers.loading
          || tags.loading || me.loading || users.loading) return '';
        return (
          <>
            <PageTitle title="Új munkalap"/>
            <WorksheetForm customers={customers.data.customers}
                           tags={tags.data.tags}
                           me={me.data.me}
                           users={users.data.users}
                           mutation={upsertWorksheet.mutation}
                           templates={templates.data.productTemplates}/>
          </>
        );
      }}
    </ComposedWorksheet>
  );
};

Worksheet.propTypes = {};

export default Worksheet;