import React from 'react';
import MuiInput from './MuiInput';
import { Field } from 'formik';

const Input = (props) => {
  return (
    <Field  type="text" {...props} component={MuiInput} variant="outlined"/>
  );
};

export default Input;