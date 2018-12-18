import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import { blue } from '@material-ui/core/colors';
import Paper from '@material-ui/core/Paper/Paper';
import Typography from '@material-ui/core/Typography/Typography';
import Avatar from '@material-ui/core/Avatar/Avatar';
import LockIcon from '@material-ui/icons/Lock';
import MuiInput from './elements/MuiInput';
import { CURRENT_USER_QUERY } from '../User';
import { handleError } from '../../lib/transformError';

const SIGN_IN_MUTATION = gql`
    mutation SIGN_IN_MUTATION($email: String!, $password: String!) {
        signIn(email: $email, password: $password) {
            id
        }
    }
`;

const styles = theme => ( {
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  buttonProgress: {
    color: blue[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -12,
  },
} );

const LoginForm = (props) => {
  const { classes } = props;
  const formDefaultValue = {
    email: 'landori.david@gmail.com',
    password: '123456',
  };

  const formLoginFormScheme = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
  });

  return (
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Bejelentkezés
        </Typography>
        <Mutation mutation={SIGN_IN_MUTATION} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
          {(signIn) => (
              <Formik initialValues={formDefaultValue} validationSchema={formLoginFormScheme}
                      onSubmit={async (values, { setSubmitting, setErrors }) => {
                        await signIn({ variables: values }).catch(err => {
                          handleError(err, setErrors, [
                            { input: 'email', err: 'NO_USER_FOUND' },
                            { input: 'password', err: 'INVALID_PASSWORD' },
                          ]);
                          setSubmitting(false);
                        });
                      }}>
                {({ isSubmitting }) => (
                    <Form className={classes.form}>
                      <Field type="email" name="email" autoComplete="email" label="E-mail" autoFocus
                             component={MuiInput}/>
                      <Field type="password" name="password" autoComplete="current-password" label="Jelszó"
                             component={MuiInput}/>

                      <div className={classes.wrapper}>
                        <Button type="submit" fullWidth variant="contained" color="primary"
                                className={classes.submit} disabled={isSubmitting}>
                          Belépés
                        </Button>
                      </div>
                    </Form>
                )}
              </Formik>
          )}
        </Mutation>
      </Paper>
  );
};

export default withStyles(styles)(LoginForm);
