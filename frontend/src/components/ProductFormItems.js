import React from 'react';
import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';
import withStyles from '@material-ui/core/styles/withStyles';
import ProductFormItem from './ProductFormItem';
import PropTypes from 'prop-types';

const fieldDefaultValue = {
  name: '',
  type: 'text',
  suffix: '',
  required: 0,
  role: 'EVERYBODY',
};

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

const ProductFormItems = (props) => {
  const { classes, remove } = props;

  return ( <>
      {props.form.values.fields.map((item, index) =>
        <ProductFormItem remove={remove}
                         data={item}
                         item={index}
                         count={props.form.values.fields.length}
                         key={index}/>)}

      <Button
        color="primary"
        onClick={() => props.push(fieldDefaultValue)}>
        <Add/> Mező hozzáadása
      </Button>
    </>
  );
};

ProductFormItems.propTypes = {
  remove: PropTypes.func.isRequired,
};

export default withStyles(styles)(ProductFormItems);