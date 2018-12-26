import React from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { adopt } from 'react-adopt';
import withStyles from '@material-ui/core/styles/withStyles';
import MuiInput from './elements/MuiInput';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import ErrorMessage from '../ErrorMessage';
import MenuItem from '@material-ui/core/MenuItem';
import { roles } from '../../config';
import Paper from '@material-ui/core/es/Paper/Paper';

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

const style = (theme) => ( {
  root: {
    marginTop: 0,
    marginBottom: 0,
  },
  formContainer: {
    overflow: 'hidden',
    padding: theme.spacing.unit * 2,
  },
  actionContainer: {
    margin: theme.spacing.unit * -2,
    marginTop: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2,
    backgroundColor: theme.palette.grey['100'],
  },
} );

const UserForm = (props) => {
    const { classes } = props;
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

    const formDefaultValue = {
      name: '',
      email: '',
      phone: '',
      location: 'csa',
      job: '',
      bloodType: '',
      ICEName: '',
      ICEContact: '',
    };
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

    const Composed = adopt({
      getUser: ({ render }) => <Query query={CURRENT_USER_PROFILE_QUERY} children={render}/>,
      updateUser: ({ render }) => <Mutation mutation={CURRENT_USER_UPDATE_MUTATION} ignoreResults={true}
                                            children={render}/>,
    });

//TODO: show message when updated is finished properly
    return (
      <Composed>
        {({ getUser, updateUser }) => {
          if (updateUser.loading || getUser.loading) return 'betöltés';
          if (getUser.error) return <ErrorMessage error={getUser.error}/>;
          if (updateUser.error) return <ErrorMessage error={updateUser.error}/>;
          if (!getUser.loading) return (
            <Formik initialValues={{ ...formDefaultValue, ...getUser.data.me }} validateOnChange={false}
                    validateOnBlur={false}
                    validationSchema={formScheme} onSubmit={async (values, { setSubmitting }) => {
              await updateUser({ variables: values }).catch(() => setSubmitting(false));
              setSubmitting(false);
            }}>
              {({ isSubmitting, dirty }) => (
                <Paper className={classes.formContainer} square>
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
                        <Field type="text" name="ICEName" label="ICE Név" component={MuiInput} variant="outlined"/>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field type="text" name="ICEContact" label="ICE Elérhetőség" component={MuiInput}
                               variant="outlined"/>
                      </Grid>
                    </Grid>
                    <div className={classes.actionContainer}>
                      <Button type="submit" variant="contained" color="primary" className={classes.submit}
                              disabled={isSubmitting || !dirty}>
                        Ment{!dirty ? 've' : 'és'}
                      </Button>
                    </div>
                  </Form>
                </Paper> )}
            </Formik> );
        }}
      </Composed>
    );
  }
;

export default withStyles(style)(UserForm);