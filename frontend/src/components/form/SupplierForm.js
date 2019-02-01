import React from 'react';
import { Field, Formik } from 'formik';
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

const SupplierForm = (props) => {
  const { classes, mutation, data } = props;
  const updatedAt = data ? data.updatedAt : null;

  const formScheme = Yup.object().shape({
    name: Yup.string().required(),
    contactName: Yup.string(),
    email: Yup.string().email(),
    phone: Yup.string(),
    address: Yup.string(),
    web: Yup.string(),
    profile: Yup.string(),
  });

  const formDefaultValue = {
    name: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    web: '',
    profile: '',
  };

  const formOnSubmit = async (variables, { resetForm, setErrors, setSubmitting }) => {
    const supplierData = { ...variables };

    if (variables.id) {
      delete supplierData.id;
      delete supplierData.__typename;
      delete supplierData.updatedAt;
    }

    const formData = {
      variables: {
        where: { id: variables.id || 1 },
        create: { ...supplierData },
        update: { ...supplierData },
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
      {({ isSubmitting, dirty }) => {
        return (
          <FormContainer>
            <Grid container className={classes.root} spacing={16}>
              <Grid item xs={12} sm={6} lg={4}>
                <Input name="name" label="Név" autoFocus/>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Input name="contactName" label="Kapcsolattartó" />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Input name="address" label="Cím" />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Input name="email" label="Email" />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Input name="phone" label="Telefonszám" />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Input name="web" label="Weboldal" />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Input name="profile" label="Cégprofil" />
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

SupplierForm.propTypes = {
  mutation: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default withStyles(style)(SupplierForm);