import React from 'react';
import * as Yup from 'yup';
import { Formik, Field } from 'formik';
import withStyles from '@material-ui/core/styles/withStyles';
import MuiInput from './elements/MuiInput';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import MenuItem from '@material-ui/core/MenuItem';
import { permissions, roles } from '../../config';
import FormContainer from './elements/FormContainer';
import Input from './elements/Input';
import { Redirect } from 'react-router-dom';
import { handleErrors, hasPermission } from '../../lib/utils';
import { adopt } from 'react-adopt';
import User from '../User';

const SIGN_UP_MUTATION = gql`
  mutation SIGN_UP_MUTATION($data: UserCreateInput!) {
    signUp(data: $data) {
      id
    }
  }
`;

const style = (theme) => ( {
  root: {
    marginTop: 0,
    marginBottom: 0,
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
      lastName: '',
      firstName: '',
      email: '',
      password: '',
      passwordConfirm: '',
      phone: '',
      permissions: 'USER',
      location: '',
      job: '',
      bloodType: '',
      ICEName: '',
      ICEContact: '',
    };
    const formScheme = Yup.object().shape({
      firstName: Yup.string().required(),
      lastName: Yup.string().required(),
      permissions: Yup.string().required(),
      password: Yup.string().min(6).required(),
      passwordConfirm: Yup.string().oneOf([Yup.ref('password'), null], 'A két jelszó nem egyezik').required(),
      email: Yup.string().email().required(),
      phone: Yup.string(),
      location: Yup.string(),
      job: Yup.string().required(),
      bloodType: Yup.string(),
      ICEName: Yup.string(),
      ICECContact: Yup.string(),
    });

    const formOnSubmit = async (values, { setSubmitting, setErrors }, signUp) => {
      const formData = { ...values };
      delete formData.passwordConfirm;
      formData.job = { set: formData.job };
      formData.status = true;
      formData.permissions = { set: formData.permissions };
      await signUp({ variables: { data: formData } }).then(({ errors }) => {
        handleErrors(errors, setErrors);
      }).catch(err => {
        setSubmitting(false);
      });
      setSubmitting(false);
    };

    const ComposedAddUserForm = adopt({
      signUp: ({ render }) =>
        <Mutation mutation={SIGN_UP_MUTATION}>
          {(mutation, result) => render({ mutation, result })}
        </Mutation>,
      formik: ({ render, signUp }) =>
        <Formik initialValues={formDefaultValue}
                validateOnChange={false}
                validateOnBlur={false}
                validationSchema={formScheme}
                children={render}
                onSubmit={(v, a) => formOnSubmit(v, a, signUp.mutation)}/>,
    });

    return (
      <ComposedAddUserForm>
        {({ signUp, formik }) => (
          <FormContainer>
            <Grid container className={classes.root} spacing={16}>
              <Grid item xs={12} sm={6} lg={4}>
                <Input name="lastName"
                       label="Vezetéknév"
                       autoFocus/>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Input name="firstName" label="Keresztnév"/>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Field type="text"
                       name="job"
                       label="Szerepkör"
                       component={MuiInput}
                       variant="outlined"
                       select>
                  {roles.map(role => <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>)}
                </Field>
              </Grid>
            </Grid>
            <Grid container className={classes.root} spacing={16}>
              <User>
                {({ loading, data: { me } }) => {
                  return loading ? '' : ( hasPermission(me, ['ADMIN']) ?
                    <Grid item xs={12} sm={6} lg={4}>
                      <Field type="text"
                             name="permissions"
                             label="Jogosultság"
                             component={MuiInput}
                             variant="outlined"
                             select>
                        {permissions.map(({ id, name }) =>
                          <MenuItem key={id} value={id}>
                            {name}
                          </MenuItem>)
                        }
                      </Field>
                    </Grid> : '' );
                }}
              </User>
              <Grid item xs={12} sm={6} lg={4}>
                <Input type="password"
                       name="password"
                       label="Jelszó"
                       autoComplete="new-password"/>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Input type="password"
                       name="passwordConfirm"
                       label="Jelszó ismét"
                       autoComplete="new-password"/>
              </Grid>
            </Grid>
            <Grid container className={classes.root} spacing={16}>
              <Grid item xs={12} sm={6} lg={4}>
                <Input type="email"
                       name="email"
                       label="E-mail"
                       autoComplete="username"/>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Input name="phone" label="Telefonszám"/>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Input name="location" label="Telephely"/>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Field type="text"
                       name="bloodType"
                       label="Vércsoport"
                       component={MuiInput}
                       variant="outlined"
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
            <div className={classes.actionContainer}>
              <Button type="submit"
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      disabled={formik.isSubmitting}>
                Mentés
              </Button>
            </div>
            {signUp.result.data && <Redirect to={`/user/${signUp.result.data.signUp.id}`}/>}
          </FormContainer> )}
      </ComposedAddUserForm>
    );
  }
;

export default withStyles(style)(UserForm);