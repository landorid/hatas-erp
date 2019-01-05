import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import ContentLoader from 'react-content-loader';
import Paper from '@material-ui/core/Paper';
import UsersListing from '../components/table/UsersListing';
import PageTitle from '../components/PageTitle';
import AddFab from '../components/AddFab';

const USERS_QUERY = gql`  
  query USERS_QUERY {
    users {
      id
      firstName
      lastName
      avatar
      job
      permissions
      status
    }
  }
`;

const MyLoader = props => (
  <ContentLoader height={30} ariaLabel={'Betöltés..'} rtl>
    <rect x="0" y="0" rx="0" ry="0" width="113.33" height="17"/>
    <rect x="193.63" y="0" rx="0" ry="0" width="71.81" height="17"/>
    <rect x="309.63" y="0" rx="0" ry="0" width="71.81" height="17"/>
  </ContentLoader>
);

const Users = () => {
  const rows = [
    { id: 'lastName', numeric: false, label: 'Név' },
    { id: 'job', numeric: false, label: 'Beosztás' },
    { id: 'permissions', numeric: false, label: 'Jogosultság' },
    { id: 'status', numeric: false, label: 'Státusz' },
  ];

  return (
    <div>
      <PageTitle title="Felhasználók"/>
      <Query query={USERS_QUERY} fetchPolicy="cache-first">
        {({ data: { users }, loading }) => {
          if (loading) return (
            <Paper>
              <MyLoader/>
              <MyLoader/>
              <MyLoader/>
            </Paper>
          );
          return (
            <UsersListing data={users} rows={rows}/>
          );
        }}
      </Query>

      <AddFab title="Új felhasználó" to="/users/add"/>
    </div>
  );
};

export default Users;