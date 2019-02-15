import React from 'react';
import PropTypes from 'prop-types';
import { adopt } from 'react-adopt';
import { Mutation, Query } from 'react-apollo';
import PageTitle from '../components/PageTitle';
import { CUSTOMERS_QUERY } from './Customers';
import WorksheetForm from '../components/form/WorksheetForm';

const ComposedWorksheet = adopt({
  customers: ({ single, render }) =>
    <Query query={CUSTOMERS_QUERY}
           children={render}
           fetchPolicy="cache-first"
           variables={{ where: { status: 1 } }}/>,
  // upsertProductTemplate: ({ render }) =>
  //   <Mutation mutation={UPSERT_PRODUCTTEMPLATE_MUTATION}>
  //     {(mutation, result) => render({ mutation, result })}
  //   </Mutation>,
});

// const Worksheet = props => {
//   const singleWorksheet = props.match.params.id;
//
//   return (
//     <ComposedWorksheet single={singleWorksheet}>
//       {({ customers }) => {
//         if (customers.loading) return '';
//
//         return (
//           <>
//             <PageTitle title="Új munkalap"/>
//             <WorksheetForm/>
//
//           </>
//         );
//       }}
//     </ComposedWorksheet>
//   );
// };

const Worksheet = props => {
  return ( <>
    <PageTitle title="Új munkalap"/>
    <WorksheetForm/>
  </> );
};

Worksheet.propTypes = {};

export default Worksheet;