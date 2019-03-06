import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import CreatableSelect from 'react-select/lib/Creatable';
import Select from 'react-select';
import { getIn } from 'formik';

const styles = theme => ( {
  root: {
    flexGrow: 1,
    height: 250,
  },
  input: {
    display: 'flex',
    padding: '10px 14px',
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    height: 28,
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: '1rem',
  },
  paper: {
    position: 'absolute',
    zIndex: 2,
    left: 0,
    right: 0,
  },
  placeholder: {
    position: 'absolute',
    left: 14,
    fontSize: '1rem',
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
} );

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      Nincs találat
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      label={props.selectProps.label}
      variant="outlined"
      margin='normal'
      error={props.selectProps.error}
      helperText={props.selectProps.helperText.value}
      InputLabelProps={{ shrink: true }}
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      className={props.selectProps.classes.placeholder}
      color="textSecondary"
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

class MuiSelect extends React.PureComponent {
  render() {
    const {
      classes,
      field,
      isLoading,
      isDisabled,
      newItem,
      options,
      label,
      isMulti,
      isClearable,
      creatable,
      form: { touched, errors, setFieldValue },
    } = this.props;
    const hasError = Boolean(touched[field.name] && errors[field.name]) || Boolean(getIn(errors, field.name));
    const errorText = errors[field.name] || getIn(errors, field.name);
    const SelectComponent = creatable ? CreatableSelect : Select;

    return (
      <SelectComponent
        {...field}
        formatCreateLabel={item => `${newItem} "${item}"`}
        classes={classes}
        options={options}
        isLoading={isLoading}
        isDisabled={isDisabled}
        isClearable={isClearable}
        components={components}
        label={label}
        isMulti={isMulti}
        placeholder="Kezdj el gépelni.."
        error={hasError}
        helperText={errorText || ''}
        onChange={option => {
          if (!option) {
            setFieldValue(field.name, '');

            return;
          }
          if (!isMulti) {
            setFieldValue(field.name, {
              label: option.label,
              value: option.__isNew__ ? 'newItem' : option.value,
            });
          } else {
            const newOptions = option.map((item, index) => ( {
              label: item.label,
              value: item.__isNew__ ? `newItem_${index}` : item.value,
            } ));
            setFieldValue(field.name, newOptions);
          }
        }}
      />
    );
  }
}

MuiSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  newItem: PropTypes.string,
  name: PropTypes.string,
  isLoading: PropTypes.bool,
  isMulti: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isClearable: PropTypes.bool,
  creatable: PropTypes.bool,
  options: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
};

export default withStyles(styles)(MuiSelect);