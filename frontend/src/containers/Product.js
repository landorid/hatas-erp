import React from 'react';
import PropTypes from 'prop-types';
import PageTitle from '../components/PageTitle';
import ProductForm from '../components/form/ProductForm';

const Product = props => {
  return (
    <div>
      <PageTitle title="Termék"/>
      <ProductForm/>
    </div>
  );
};

Product.propTypes = {

};

export default Product;