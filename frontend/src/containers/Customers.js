import React from 'react';
import PageTitle from '../components/PageTitle';
import AddFab from '../components/AddFab';

const Customers = (props) => {
  return (
    <div>
      <PageTitle title="Ügyfelek"/>

      <AddFab title="Új ügyfél" to="/customers/add"/>
    </div>
  );
};

export default Customers;