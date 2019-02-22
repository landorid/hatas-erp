import React from 'react';
import { adopt } from 'react-adopt';
import { Query } from 'react-apollo';
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
        default
        suffix
        role
        required
      }
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
  me: ({ single, render }) =>
    <Query query={CURRENT_USER_QUERY}
           children={render}
           fetchPolicy="cache-first"/>,

});

const Worksheet = props => {
  const singleWorksheet = props.match.params.id;

  return (
    <ComposedWorksheet single={singleWorksheet}>
      {({ customers, templates, tags, me }) => {
        if (templates.loading || customers.loading || tags.loading || me.loading) return '';
        return (
          <>
            <PageTitle title="Új munkalap"/>
            <WorksheetForm customers={customers.data.customers}
                           tags={tags.data.tags}
                           me={me.data.me}
                           templates={templates.data.productTemplates}/>
          </>
        );
      }}
    </ComposedWorksheet>
  );
};

// const Worksheet = props => {
//   return ( <>
//     <PageTitle title="Új munkalap"/>
//     <WorksheetForm/>
//   </> );
// };

Worksheet.propTypes = {};

export default Worksheet;