import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import UsersListing from '../components/table/UsersListing';
import PageTitle from '../components/PageTitle';
import AddFab from '../components/AddFab';
import TableLoading from '../components/table/elements/TableLoading';

const USERS_QUERY = gql`  
  query USERS_QUERY {
    users {
      id
      lastName
      firstName
      email
      phone
      location
      job
      bloodType
      ICEName
      ICEContact
      permissions
      status
      updatedAt
      avatar
    }
  }
`;

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
          if (loading) return <TableLoading/>;
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