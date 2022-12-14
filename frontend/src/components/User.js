import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

const CURRENT_USER_QUERY = gql`
  query CURRENT_USER_QUERY {
    me {
      id
      lastName
      firstName
      email
      avatar
      permissions
      job
    }
  }
`;

const User = props => (
  <Query {...props} query={CURRENT_USER_QUERY} fetchPolicy="cache-first">
    {payload => props.children(payload)}
  </Query>
);

User.propTypes = {
  children: PropTypes.func.isRequired,
};

export default User;
export { CURRENT_USER_QUERY };
