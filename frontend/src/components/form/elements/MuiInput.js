import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField/TextField';

class MuiInput extends PureComponent {
  render() {
    const { label, autoFocus, autoComplete, field, form: { touched, errors }, inputProps, ...other } = this.props;
    const hasError = Boolean(touched[field.name] && errors[field.name]);
    const errorText = errors[field.name];
    return (
        <TextField
            label={label}
            fullWidth
            margin='normal'
            error={hasError}
            helperText={errorText || ''}
            {...field}
            {...other}
            InputProps={inputProps}
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
      PropTypes.number
    ])
  }),
  form: PropTypes.shape({
    dirty: PropTypes.bool,
    errors: PropTypes.object
  }),
  inputProps: PropTypes.object
};

export default MuiInput;
