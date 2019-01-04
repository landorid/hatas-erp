import React from 'react';
import PageTitle from '../components/PageTitle';
import AddUserForm from '../components/form/AddUser';

const AddUser = () => {
  return (
    <div>
      <PageTitle title="Új felhasználó"/>
      <AddUserForm/>
    </div>
  );
};

export default AddUser;