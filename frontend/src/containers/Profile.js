import React from 'react';
import PageTitle from '../components/PageTitle';
import UserForm from '../components/form/UserForm';

const Profile = () => {
  return (
    <div>
      <PageTitle title="Profil szerkesztése"/>
      <UserForm/>
    </div>
  );
};

export default Profile;