import React from 'react';
import * as Yup from 'yup';
import { Formik, Field } from 'formik';
import withStyles from '@material-ui/core/styles/withStyles';
import MuiInput from './elements/MuiInput';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { permissions, roles } from '../../config';
import FormContainer from './elements/FormContainer';
import Input from './elements/Input';
import { handleErrors, hasPermission } from '../../lib/utils';
import User from '../User';
import { GET_USER_BY_ID_QUERY } from '../../containers/EditUser';
import { MyLoader } from './UserForm';

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
    const { classes, data, mutation, loading } = props;
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
      firstName: Yup.string().required(),
      lastName: Yup.string().required(),
      permissions: Yup.string().required(),
      email: Yup.string().email().required(),
      phone: Yup.string(),
      location: Yup.string(),
      job: Yup.string().required(),
      bloodType: Yup.string(),
      ICEName: Yup.string(),
      ICECContact: Yup.string(),
    });

    const formOnSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
      const formData = { ...values };
      delete formData.passwordConfirm;
      delete formData.id;
      delete formData.__typename;
      formData.job = { set: formData.job };
      formData.permissions = { set: formData.permissions };
      await mutation({
        variables: { where: { id: values.id }, data: formData },
        update: (cache) => {
          const data = cache.readQuery({ query: GET_USER_BY_ID_QUERY, variables: { id: values.id } });
          data.user = values;
          cache.writeQuery({ query: GET_USER_BY_ID_QUERY, data });
        },
      }).then(({ errors }) => {
        handleErrors(errors, setErrors);
      }).catch(err => {
        setSubmitting(false);
      });
      resetForm(values);
    };

    if (loading)
      return (
        <FormContainer>
          <MyLoader/>
          <MyLoader/>
          <MyLoader/>
        </FormContainer>
      );

    return ( <Formik initialValues={data}
                     validateOnChange={false}
                     validateOnBlur={false}
                     validationSchema={formScheme}
                     onSubmit={formOnSubmit}>
        {({ isSubmitting, dirty }) => (
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
                      disabled={isSubmitting || !dirty}>
                Mentés
              </Button>
            </div>
          </FormContainer> )}
      </Formik>
    );
  }
;

export default withStyles(style)(UserForm);