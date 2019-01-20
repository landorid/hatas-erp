import React from 'react';
import MuiInput from './MuiInput';
import { Field } from 'formik';

const Input = (props) => {
  return (
    <Field type="text" component={MuiInput} variant="outlined" {...props}/>
  );
};

export default Input;