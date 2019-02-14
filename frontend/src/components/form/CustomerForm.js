import React from 'react';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Input from './elements/Input';
import FormContainer from './elements/FormContainer';
import { Formik } from 'formik';
import * as Yup from 'yup';
import ActionFooter from './elements/ActionFooter';
import { handleErrors } from '../../lib/utils';
import * as PropTypes from 'prop-types';

const style = (theme) => ( {
  root: {
    marginTop: 0,
    marginBottom: 0,
  },
} );

const CustomerForm = (props) => {
  const { classes, mutation, data } = props;
  const updatedAt = data ? data.updatedAt : null;

  const formScheme = Yup.object().shape({
    name: Yup.string().required(),
    taxNumber: Yup.string(),
    contactName: Yup.string(),
    email: Yup.string().email(),
    phone: Yup.string(),
    address: Yup.string(),
    note: Yup.string(),
    status: Yup.bool(),
  });

  const fromDefaultValue = {
    name: '',
    taxNumber: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    note: '',
    status: true,
  };

  const formOnSubmit = async (variables, { resetForm, setErrors }) => {
    const formData = { variables: {} };
    formData.variables.data = { ...variables };

    //if it's an edit page, lets refactor data to update mutation
    if (variables.id) {
      delete formData.variables.data.id;
      delete formData.variables.data.__typename;
      delete formData.variables.data.updatedAt;
      formData.variables.where = { id: variables.id };
    }

    await mutation(formData).then(({ errors }) => {
      handleErrors(errors, setErrors);
    }).catch(err => {
      console.log(err);
    });
  };

  return (
    <Formik initialValues={data || fromDefaultValue}
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
                <Input name="taxNumber" label="Adószám"/>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Input name="address" label="Cím"/>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Input name="contactName" label="Kapcsolattartó"/>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Input type="email" name="email" label="Email"/>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Input name="phone" label="Telefon"/>
              </Grid>
              <Grid item xs={12} lg={8}>
                <Input name="note"
                       label="Megjegyzés"
                       rowsMax="10"
                       rows="4"
                       multiline/>
              </Grid>
            </Grid>
            <ActionFooter submitting={isSubmitting}
                          updatedAt={updatedAt}
                          dirty={dirty}/>
          </FormContainer> );
      }}
    </Formik>
  );
};

CustomerForm.propTypes = {
  mutation: PropTypes.func.isRequired,
  data: PropTypes.object,
};
export default withStyles(style)(CustomerForm);