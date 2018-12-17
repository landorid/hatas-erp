import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const LIST_USERS = gql`
    query LIST_USERS {
        users {
            name
        }
    }
`;

const Home = () => {
  return (
      <div>
kezdőlap
      </div>
  );
};

export default Home;