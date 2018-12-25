import React from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import withStyles from '@material-ui/core/styles/withStyles';
import MuiInput from './elements/MuiInput';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import ErrorMessage from '../ErrorMessage';
import MenuItem from '@material-ui/core/MenuItem';
import { roles } from '../../config';

const CURRENT_USER_PROFILE_QUERY = gql`
  query CURRENT_USER_PROFILE_QUERY {
    me {
      id
      name
      email
      phone
      location
      job
      bloodType
      ICEName
      ICEContact
    }
  }
`;

const CURRENT_USER_UPDATE_MUTATION = gql`
  mutation CURRENT_USER_UPDATE_MUTATION(
  $name: String
  $email: String
  $phone: String
  $location: String
  $job: [Job]
  $bloodType: String
  $ICEName: String
  $ICEContact: String
  ) {
    updateProfile(
      name: $name
      email: $email
      phone: $phone
      location: $location
      job: $job
      bloodType: $bloodType
      ICEName: $ICEName
      ICEContact: $ICEContact
    ) {
      id
    }
  }
`;

const style = (theme) => {

};

const UserForm = (props) => {
  const { classes } = props;
  const formDefaultValue = {
    name: '',
    email: '',
    phone: '',
    location: '',
    job: '',
    bloodType: '',
    ICEName: '',
    ICEContact: '',
  };
  const bloodTypes = [
    '0-pozitív',
    '0-negatív',
    'A-pozitív',
    'A-negatív',
    'B-pozitív',
    'B-negatív',
    'AB-pozitív',
    'AB-negatív',
  ];

  const formScheme = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().email().required(),
    phone: Yup.string(),
    location: Yup.string(),
    job: Yup.string(),
    bloodType: Yup.string(),
    ICEName: Yup.string(),
    ICECContact: Yup.string(),
  });

  //TODO: show message when updated is finished properly
  return (
    <Mutation mutation={CURRENT_USER_UPDATE_MUTATION} ignoreResults={true}>
      {(updateUser, { error: MutationError }) => {
        return (
          <Query query={CURRENT_USER_PROFILE_QUERY}>
            {({ loading, error, data }) => {
              if (loading) return 'betöltés';
              if (error) return <ErrorMessage error={error}/>;
              if (!loading) return (
                <Formik initialValues={{ ...formDefaultValue, ...data.me }} validateOnChange={false}
                        validateOnBlur={false}
                        validationSchema={formScheme} onSubmit={async (values, { setSubmitting }) => {
                  await updateUser({ variables: values }).catch(() => setSubmitting(false));
                  setSubmitting(false);
                }}>
                  {({ isSubmitting }) => (
                    <Form className={classes.form}>
                      <Grid container className={classes.root} spacing={16}>
                        <Grid item xs={12} sm={6} lg={4}>
                          <Field type="text" name="name" label="Név" component={MuiInput} variant="outlined" autoFocus/>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4}>
                          <Field type="email" name="email" label="E-mail" component={MuiInput} variant="outlined"/>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4}>
                          <Field type="text" name="phone" label="Telefonszám" component={MuiInput} variant="outlined"/>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4}>
                          <Field type="text" name="location" label="Telephely" component={MuiInput} variant="outlined"/>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4}>
                          <Field type="text" name="job" label="Szerepkör" component={MuiInput} variant="outlined" select>
                            {roles.map(role => <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>)}

                          </Field>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4}>
                          <Field type="text" name="bloodType" label="Vércsoport" component={MuiInput} variant="outlined"
                                 select>
                            {bloodTypes.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                          </Field>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field type="text" name="ICEName" label="ICEName" component={MuiInput} variant="outlined"/>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field type="text" name="ICEContact" label="ICEContact" component={MuiInput}
                                 variant="outlined"/>
                        </Grid>
                      </Grid>
                      <div className={classes.wrapper}>
                        <Button type="submit" variant="contained" color="primary" className={classes.submit}
                                disabled={isSubmitting}>
                          Mentés
                        </Button>
                      </div>
                      <ErrorMessage error={MutationError}/>
                    </Form>
                  )}
                </Formik> );
            }}
          </Query>
        );
      }}
    </Mutation>
  );
};

export default withStyles(style)(UserForm);