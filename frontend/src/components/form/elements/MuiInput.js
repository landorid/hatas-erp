import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField/TextField';
import { getIn } from 'formik';

class MuiInput extends PureComponent {
  render() {
    const {
      label,
      autoFocus,
      autoComplete,
      field,
      form: { touched, errors },
      InputProps,
      inputProps,
      ...other
    } = this.props;
    const hasError = Boolean(touched[field.name] && errors[field.name]) || Boolean(getIn(errors, field.name));
    const errorText = errors[field.name] || getIn(errors, field.name);

    return (
      <TextField
        label={label}
        fullWidth
        margin='normal'
        error={hasError}
        helperText={hasError ? errorText : ''}
        {...field}
        {...other}
        InputProps={InputProps}
        inputProps={inputProps}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
      />
    );
  }
}

MuiInput.propTypes = {
  label: PropTypes.string,
  field: PropTypes.shape({
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.array,
    ]),
  }),
  form: PropTypes.shape({
    dirty: PropTypes.bool,
    errors: PropTypes.object,
  }),
  inputProps: PropTypes.object,
};

export default MuiInput;
