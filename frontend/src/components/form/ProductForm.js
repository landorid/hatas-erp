import React from 'react';
import PropTypes from 'prop-types';
import { FastField, FieldArray, Formik } from 'formik';
import Grid from '@material-ui/core/Grid';
import * as Yup from 'yup';
import withStyles from '@material-ui/core/styles/withStyles';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import ActionFooter from './elements/ActionFooter';
import { fieldTypes } from '../../config';
import Input from './elements/Input';
import MuiInput from './elements/MuiInput';
import FormContainer from './elements/FormContainer';
import { handleErrors } from '../../lib/utils';
import ProductFormItems from '../ProductFormItems';

const style = (theme) => ( {
  root: {
    marginTop: 0,
    marginBottom: 0,
  }
} );

const ProductForm = props => {
  const { classes, mutation, data } = props;
  const updatedAt = data ? data.updatedAt : null;

  const formScheme = Yup.object().shape({
    name: Yup.string().required(),
    status: Yup.boolean(),
    fields: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required(),
        type: Yup.mixed().oneOf(fieldTypes.map(item => item.id)),
        suffix: Yup.string(),
        required: Yup.boolean(),
        role: Yup.string(),
      }),
    ).min(1, 'Minimum egy mezőt tartalmaznia kell a Terméknek'),
  });

  const fieldDefaultValue = {
    name: '',
    type: 'text',
    suffix: '',
    required: 0,
    role: 'EVERYBODY',
  };

  const formDefaultValue = {
    name: '',
    status: 1,
    fields: [{ ...fieldDefaultValue }],
  };

  const formOnSubmit = async (variables, { resetForm, setErrors, setSubmitting }) => {
    const fieldsToDelete = [];

    delete variables.__typename;
    delete variables.updatedAt;
    variables.fields.map(item => delete item.__typename);

    //Find fields, which is now not present int formtemplate, but there was
    if (data) {
      data.fields.forEach(item => {
        if (!variables.fields.some(fieldItem => fieldItem.id && ( fieldItem.id === item.id ))) {
          fieldsToDelete.push({ id: item.id });
        }
      });
    }

    const formData = {
      variables: {
        where: variables.id || 1,
        data: {
          delete: fieldsToDelete,
          ...variables,
        },
      },
    };

    await mutation(formData).then(({ errors }) => {
      handleErrors(errors, setErrors);
    }).catch(err => {
      console.log(err);
      setSubmitting(false);
    });

    if (data) {
      resetForm(variables);
    }
  };

  return (
    <Formik initialValues={data || formDefaultValue}
            validateOnChange={false}
            validateOnBlur={false}
            validationSchema={formScheme}
            onSubmit={formOnSubmit}>
      {({ isSubmitting, dirty }) => {
        return (
          <FormContainer>
            <Grid container className={classes.root} spacing={16}>
              <Grid item xs={12} sm={6} lg={4}>
                <Input name="name" label="Név" autoFocus/>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <FastField type="text"
                           name="status"
                           label="Állapot"
                           component={MuiInput}
                           variant="outlined"
                           select>
                  <MenuItem key="active" value={1}>Elérhető</MenuItem>
                  <MenuItem key="archive" value={0}>Nem elérhető</MenuItem>
                </FastField>
              </Grid>
            </Grid>
            <Typography variant={'h6'}>Mezők</Typography>
            <Typography variant={'body2'}>Ha bejelölöd a Kötelező Mező-t, akkor egyik felhasználó
              sem fogja tudni elmenteni a Munkalapot a mező kitöltése nélkül! Ha kiválasztod a jogosultságot is, akkor
              csak annak a felhasználónak lesz az adott bező kötelező</Typography>
            <FieldArray validateOnChange={false}
                        name="fields"
                        render={(props) => <ProductFormItems {...props}/>}/>

            <ActionFooter submitting={isSubmitting}
                          updatedAt={updatedAt}
                          dirty={dirty}/>
          </FormContainer> );
      }}
    </Formik>
  );
};

ProductForm.propTypes = {
  data: PropTypes.object,
  mutation: PropTypes.func.isRequired,
};

export default withStyles(style)(ProductForm);