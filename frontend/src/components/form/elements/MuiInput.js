import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField/TextField';
import { getIn } from 'formik';
import { debounce } from 'debounce';

class MuiInput extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: props.field.value,
    };

    this.syncChange = debounce(this.syncChange, 200);
  }

  syncChange = (e) => {
    const { field: { onChange } } = this.props;
    onChange(e);
  };

  handleChange = (e) => {
    if (e.persist) {
      e.persist();
    }

    this.setState({ value: e.target.value });
    this.syncChange(e);
  };

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

    // Because of https://reactjs.org/warnings/unknown-prop.html
    delete other.noFast;

    return (
      <TextField
        label={label}
        fullWidth
        margin='normal'
        error={hasError}
        helperText={hasError ? errorText : ''}
        {...field}
        {...other}
        onChange={this.handleChange}
        onBlur={this.props.onChange}
        value={this.state.value}
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
      PropTypes.bool,
    ]),
  }),
  form: PropTypes.shape({
    dirty: PropTypes.bool,
    errors: PropTypes.object,
  }),
  inputProps: PropTypes.object,
};

export default MuiInput;
