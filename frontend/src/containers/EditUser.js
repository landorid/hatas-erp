import React from 'react';
import PageTitle from '../components/PageTitle';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import EditUserForm from '../components/form/EditUserForm';
import { Redirect } from 'react-router-dom';
import FormLoading from '../components/form/elements/FormLoading';

const GET_USER_BY_ID_QUERY = gql`
  query GET_USER_BY_ID_QUERY($id: ID!) {
    user(where: {id: $id}) {
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

const UPDATE_USER_MUTATION = gql`
  mutation CURRENT_USER_UPDATE_MUTATION($data: UserUpdateInput!, $where: UserWhereUniqueInput!) {
    updateUser(data: $data, where: $where) {
      id
      permissions
      job
    }
  }
`;

const EditUser = (props) => {
  return (
    <Query query={GET_USER_BY_ID_QUERY}
           variables={{ id: props.match.params.id }}
           fetchPolicy="cache-first">
      {({ data, loading }) => (
        <Mutation mutation={UPDATE_USER_MUTATION} ignoreResults={true}>
          {(updateUser, result) => {
            if (loading)
              return <FormLoading/>;
            return data.user ?
              <>
                <PageTitle title={loading ? 'Betöltés...' : `${data.user.lastName} ${data.user.firstName}`}/>
                <EditUserForm data={data.user}
                              mutation={updateUser}
                              loading={loading || result.loading}/>
              </> :
              <Redirect to="/users"/>;
          }
          }
        </Mutation> )
      }
    </Query>
  );
};

export default EditUser;
export { GET_USER_BY_ID_QUERY };