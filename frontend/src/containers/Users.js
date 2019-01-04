import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import ContentLoader from 'react-content-loader';
import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import withStyles from '@material-ui/core/styles/withStyles';
import UsersListing from '../components/table/UsersListing';
import PageTitle from '../components/PageTitle';

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

const style = (theme) =>( {
  addUserButton: {
    position: 'fixed',
    bottom: theme.spacing.unit * 3,
    right: theme.spacing.unit * 3,
  },
} );
const MyLoader = props => (
  <ContentLoader height={30} ariaLabel={'Betöltés..'} rtl>
    <rect x="0" y="0" rx="0" ry="0" width="113.33" height="17"/>
    <rect x="193.63" y="0" rx="0" ry="0" width="71.81" height="17"/>
    <rect x="309.63" y="0" rx="0" ry="0" width="71.81" height="17"/>
  </ContentLoader>
);

const Users = (props) => {
  const rows = [
    { id: 'lastName', numeric: false, label: 'Név' },
    { id: 'job', numeric: false, label: 'Beosztás' },
    { id: 'permissions', numeric: false, label: 'Jogosultság' },
    { id: 'status', numeric: false, label: 'Státusz' },
  ];

  return (
    <div>
      <PageTitle title="Felhasználók"/>
      <Query query={USERS_QUERY}>
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

      <Tooltip placement="left" title="Új felhasználó" aria-label="Új felhasználó">
        <Fab className={props.classes.addUserButton} color="primary" component={Link} to="/users/add">
          <AddIcon/>
        </Fab>
      </Tooltip>
    </div>
  );
};

export default withStyles(style)(Users);