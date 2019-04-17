import React from 'react';
import PropTypes from 'prop-types';
import { FastField } from 'formik';
import MuiInput from './form/elements/MuiInput';
import { fieldTypes, roles } from '../config';
import Input from './form/elements/Input';
import Remove from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ( {
  subField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    flex: '1 1 20%',
    [theme.breakpoints.up('md')]: {
      flex: '0 1 20%',
    },
  },
  subFieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    borderBottom: `solid 1px grey`,
  },
  subFieldList: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    },
  },
  deleteSubField: {
    marginLeft: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
} );

const ProductFormItem = props => {
  const { data, classes, item, remove, count } = props;
  console.log(data);
  return (
    <div className={classes.subFieldGroup} key={data.id}>
      <div className={classes.subFieldList}>
        <Input name={`fields[${item}].name`}
               fullWidth={false}
               className={classes.subField}
               label="Mező neve"/>

        <FastField name={`fields[${item}].type`}
                   label="Típus"
                   className={classes.subField}
                   fullWidth={false}
                   component={MuiInput}
                   variant="outlined"
                   select>
          {fieldTypes.map(item => (
            <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
          ))}
        </FastField>

        <Input name={`fields[${item}].suffix`}
               fullWidth={false}
               width={50}
               className={classes.subField}
               label="Mértékegység"/>
      </div>
      <div className={classes.subFieldList}>
        <FastField name={`fields[${item}].required`}
                   label="Kötelező"
                   className={classes.subField}
                   fullWidth={false}
                   component={MuiInput}
                   variant="outlined"
                   select>
          <MenuItem value={1}>Igen</MenuItem>
          <MenuItem value={0}>Nem</MenuItem>
        </FastField>
        {!!data.required &&
        <FastField name={`fields[${item}].role`}
                   label="Felelős"
                   className={classes.subField}
                   fullWidth={false}
                   component={MuiInput}
                   variant="outlined"
                   select>
          <MenuItem key={-1} value="EVERYBODY">Mindenki</MenuItem>
          {roles.map(item => (
            <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
          ))}
        </FastField>}

        {count > 1 && <div className={classes.deleteSubField}>
          <IconButton
            onClick={() => remove(item)}
            aria-label="Törlés">
            <Remove/>
          </IconButton>
        </div>}
      </div>
    </div>
  );
};

ProductFormItem.propTypes = {
  data: PropTypes.object.isRequired,
  item: PropTypes.number.isRequired,
  remove: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
};

export default withStyles(styles)(ProductFormItem);