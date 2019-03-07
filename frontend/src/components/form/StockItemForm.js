import React from 'react';
import { FastField, Field, Formik } from 'formik';
import * as Yup from 'yup';
import * as PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import FormContainer from './elements/FormContainer';
import { handleErrors, createCategoryTree } from '../../lib/utils';
import ActionFooter from './elements/ActionFooter';
import Input from './elements/Input';
import MuiInput from './elements/MuiInput';

const style = (theme) => ( {
  root: {
    marginTop: 0,
    marginBottom: 0,
  },
} );

const StockItemForm = (props) => {
  const { classes, mutation, data, categories } = props;
  const updatedAt = data ? data.updatedAt : null;
  const categoryList = createCategoryTree(categories);

  //rebase db data to formik data to handle saved category
  if (data && data.category.id) {
    data.subcategory = data.category.id || '';
    data.category = data.category.parent.id || data.category.id;
  }

  const formScheme = Yup.object().shape({
    name: Yup.string().required(),
    category: Yup.string().required(),
    subcategory: Yup.string(),
    quantity: Yup.number(),
    quantityUnit: Yup.string(),
    quantityAlarm: Yup.string(),
  });

  const formDefaultValue = {
    name: '',
    category: '',
    subcategory: '',
    quantity: 0,
    quantityUnit: '',
    quantityAlarm: 0,
  };

  const formOnSubmit = async (variables, { resetForm, setErrors, setSubmitting }) => {
    const stockItemData = { ...variables };
    stockItemData.category = {
      connect: {
        id: variables.subcategory || variables.category,
      },
    };
    delete stockItemData.subcategory;

    if (variables.id) {
      delete stockItemData.id;
      delete stockItemData.__typename;
      delete stockItemData.updatedAt;
    }

    const formData = {
      variables: {
        where: { id: variables.id || 1 },
        create: { ...stockItemData },
        update: { ...stockItemData },
      },
    };

    await mutation(formData).then(({ errors }) => {
      handleErrors(errors, setErrors);
    }).catch(err => {
      console.log(err);
      setSubmitting(false);
    });

    if (!data) {
      resetForm({ ...variables, name: '' });
    } else {
      resetForm(variables);
    }
  };

  return (
    <Formik initialValues={data || formDefaultValue}
            validateOnChange={false}
            validateOnBlur={false}
            validationSchema={formScheme}
            onSubmit={formOnSubmit}>
      {({ isSubmitting, dirty, values, setFieldValue }) => {
        const [selectedCat] = categoryList.filter(item => item.id === values.category);
        return (
          <FormContainer>
            <Grid container className={classes.root} spacing={16}>
              <Grid item xs={12} sm={6} lg={4}>
                <Input name="name" label="Megnevezés" autoFocus/>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <FastField type="text"
                           name="category"
                           label="Főkategória"
                           component={MuiInput}
                           variant="outlined"
                           onChange={(e) => {
                             setFieldValue('category', e.target.value);
                             setFieldValue('subcategory', '');
                           }}
                           select>
                  <MenuItem value="">
                    <em>Egyik sem</em>
                  </MenuItem>
                  {categoryList.map(item => (
                    <MenuItem value={item.id} key={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </FastField>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Field type="text"
                           name="subcategory"
                           label="Alkategória"
                           component={MuiInput}
                           variant="outlined"
                           select>
                  {selectedCat && selectedCat.children.length === 0 &&
                  <MenuItem value="">
                    <em>Nincsen alkategória</em>
                  </MenuItem>}
                  {selectedCat && selectedCat.children.length > 0 &&
                  <MenuItem value="">
                    <em>Válassz</em>
                  </MenuItem>}
                  {selectedCat && selectedCat.children.map(item =>
                    <MenuItem value={item.id} key={item.id}>
                      {item.name}
                    </MenuItem>,
                  )}
                </Field>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Input name="quantity"
                       label="Mennyiség"
                       InputLabelProps={{ shrink: true }}
                       InputProps={{
                         endAdornment: <InputAdornment position="end">{values.quantityUnit}</InputAdornment>,
                         inputProps: {
                           style: { textAlign: 'right' },
                         },
                       }}
                       type="number"
                       noFast/>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Input name="quantityUnit"
                       InputLabelProps={{ shrink: true }}
                       label="Mennyiségi egység"/>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Input name="quantityAlarm"
                       label="Mennyiségi riasztás"
                       InputLabelProps={{ shrink: true }}
                       InputProps={{
                         endAdornment: <InputAdornment position="end">{values.quantityUnit}</InputAdornment>,
                         inputProps: {
                           style: { textAlign: 'right' },
                         },
                       }}
                       type="number"
                       noFast/>
              </Grid>
            </Grid>
            <ActionFooter submitting={isSubmitting}
                          updatedAt={updatedAt}
                          dirty={dirty}/>
          </FormContainer>
        );
      }}
    </Formik>
  );
};

StockItemForm.propTypes = {
  mutation: PropTypes.func.isRequired,
  data: PropTypes.object,
  categories: PropTypes.array.isRequired,
};

export default withStyles(style)(StockItemForm);