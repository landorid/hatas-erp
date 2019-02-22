import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Add from '@material-ui/icons/Add';
import ProductItem from './ProductItem';
import { FastField } from 'formik';
import NoMoney from '@material-ui/icons/MoneyOff';
import MuiSelect from '../form/elements/MuiSelect';
import withStyles from '@material-ui/core/styles/withStyles';
import * as classnames from 'classnames';

const styles = (theme) => ( {
  productSelect: {
    flexGrow: 1,
  },
  noProduct: {
    textAlign: 'center',
    color: theme.palette.grey[400],
  },
  noProductError: {
    textAlign: 'center',
    color: theme.palette.error.main,
  },
  noProductTitle: {
    color: 'inherit',
  },
  addButton: {
    alignSelf: 'center',
    marginLeft: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit,
  },
} );

const WorksheetProducts = (props) => {
  const {
    push,
    remove,
    form: { values, setFieldValue, errors },
    templates,
    me,
    classes,
  } = props;

  const addNewEvent = (item, push, setFieldValue) => {
    if (item.value) {
      const [template] = templates.filter(template => template.id === item.value);
      template.fields = template.fields.map(item => ( { ...item, value: '' } ));
      push(template);
      setFieldValue('current_product', '');
    }
  };

  const templatesList = templates.filter(item => item.status).map(item => ( {
    value: item.id,
    label: item.name,
  } ));
  return ( <>
    {values.products.map((item, index) => (
      <ProductItem
        remove={remove}
        errors={errors}
        item={index}
        me={me}
        data={values.products[index]}
        key={index}/>
    ))}

    {!values.products.length > 0 &&
    <div className={classnames(
      { [classes.noProduct]: typeof errors.products !== 'string' },
      { [classes.noProductError]: typeof errors.products === 'string' },
    )}>
      <NoMoney/>
      <Typography variant="body1"
                  className={classes.noProductTitle}>Még nem adtál hozzá terméket!</Typography>
    </div>}

    <Divider style={{ marginTop: 16, marginBottom: 16 }}/>

    <div style={{ display: 'flex' }}>
      <div className={classes.productSelect}>
        <FastField component={MuiSelect}
                   name="current_product"
                   label="Termék"
                   options={templatesList}
                   type="text"/>
      </div>
      <Button
        className={classes.addButton}
        color="primary"
        size="small"
        onClick={() => addNewEvent(values.current_product, push, setFieldValue)}>
        <Add/> Hozzáad
      </Button>
    </div>
  </> );
};

WorksheetProducts.propTypes = {
  templates: PropTypes.array.isRequired,
  me: PropTypes.object.isRequired,
};

export default withStyles(styles)(WorksheetProducts);