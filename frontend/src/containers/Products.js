import React from 'react';
import PageTitle from '../components/PageTitle';
import AddFab from '../components/AddFab';

const Products = props => {
  return (
    <div>
      <PageTitle title="Termékek"/>
      <AddFab title="Új termék" to="/product/add"/>
    </div>
  );
};
export default Products;