import React from 'react';
import { Field, FastField } from 'formik';
import PropTypes from 'prop-types';
import MuiInput from './MuiInput';

const Input = (props) => props.noFast ?
  <Field type="text" component={MuiInput} variant="outlined" {...props}/> :
  <FastField type="text" component={MuiInput} variant="outlined" {...props}/>;

Input.propTypes = {
  noFast: PropTypes.bool,
};

export default React.memo(Input);