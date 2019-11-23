import React from 'react';
import * as Yup from 'yup';
import { Formik, Field } from 'formik';
import { adopt } from 'react-adopt';
import withStyles from '@material-ui/core/styles/withStyles';
import MuiInput from './elements/MuiInput';
import Grid from '@material-ui/core/Grid';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import ErrorMessage from '../ErrorMessage';
import MenuItem from '@material-ui/core/MenuItem';
import { roles } from '../../config';
import FormContainer from './elements/FormContainer';
import Input from './elements/Input';
import { handleErrors } from '../../lib/utils';
import ActionFooter from './elements/ActionFooter';
import FormLoading from './elements/FormLoading';

const CURRENT_USER_PROFILE_QUERY = gql`
  query CURRENT_USER_PROFILE_QUERY {
    me {
      id
      lastName
      firstName
      email
      phone
      location
      job
      bloodType
      ICEName
      ICEContact
      updatedAt
    }
  }
`;

const CURRENT_USER_UPDATE_MUTATION = gql`
  mutation CURRENT_USER_UPDATE_MUTATION(
  $lastName: String
  $firstName: String
  $email: String
  $phone: String
  $location: String
  $job: [Job]
  $bloodType: String
  $ICEName: String
  $ICEContact: String
  ) {
    updateProfile(
      lastName: $lastName
      firstName: $firstName
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
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    location: '',
    job: '',
    bloodType: '',
    ICEName: '',
    ICEContact: '',
  };

  const formScheme = Yup.object().shape({
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    email: Yup.string().email().required(),
    phone: Yup.string(),
    location: Yup.string(),
    job: Yup.string(),
    bloodType: Yup.string(),
    ICEName: Yup.string(),
    ICECContact: Yup.string(),
  });

  const Composed = adopt({
    getUser: ({ render }) => <Query query={CURRENT_USER_PROFILE_QUERY} children={render} fetchPolicy={'cache-first'}/>,
    updateUser: ({ render }) => <Mutation mutation={CURRENT_USER_UPDATE_MUTATION} ignoreResults={true}>
      {(mutation, result) => render({ mutation, result })}
    </Mutation>,
  });

  const formOnSubmit = async (values, { setSubmitting, setErrors }, updateUser) => {
    await updateUser({
      variables: values,
      update: (cache) => {
        const data = cache.readQuery({ query: CURRENT_USER_PROFILE_QUERY });
        data.me = values;
        data.me.updatedAt = Date.now();
        cache.writeQuery({ query: CURRENT_USER_PROFILE_QUERY, data });
      },
    }).then(({ errors }) => {
      handleErrors(errors, setErrors);
    }).catch(() => setSubmitting(false));
    setSubmitting(false);
  };

  return (
    <Composed>
      {({ getUser, updateUser }) => {
        if (updateUser.result.loading || getUser.loading) {
          return <FormLoading/>;
        }

        if (getUser.error) return <ErrorMessage error={getUser.error}/>;
        if (updateUser.result.error) return <ErrorMessage error={updateUser.result.error}/>;
        if (!getUser.loading) return (
          <Formik initialValues={{ ...formDefaultValue, ...getUser.data.me }}
                  validateOnChange={false}
                  validateOnBlur={false}
                  validationSchema={formScheme}
                  onSubmit={(v, a) => formOnSubmit(v, a, updateUser.mutation)}>
            {({ isSubmitting, dirty }) => (
              <FormContainer>
                <Grid container className={classes.root} spacing={16}>
                  <Grid item xs={12} sm={6} lg={4}>
                    <Input name="lastName" label="Vezetéknév" autoFocus/>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <Input name="firstName" label="Keresztnév"/>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <Input type="email" name="email" label="E-mail"/>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <Input name="phone" label="Telefonszám"/>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <Input name="location" label="Telephely"/>
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
                  <Grid item xs={12} sm={6} lg={4}>
                    <Input name="ICEName" label="ICE Név"/>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <Input name="ICEContact" label="ICE Elérhetőség"/>
                  </Grid>
                </Grid>
                <ActionFooter dirty={dirty}
                              submitting={isSubmitting}
                              updatedAt={getUser.data.me.updatedAt}/>
              </FormContainer> )}
          </Formik> );
      }}
    </Composed>
  );
};

export default withStyles(style)(UserForm);
