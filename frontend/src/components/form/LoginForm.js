import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import * as Yup from 'yup';
import { adopt } from 'react-adopt';
import Button from '@material-ui/core/Button/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import { blue } from '@material-ui/core/colors';
import Paper from '@material-ui/core/Paper/Paper';
import Typography from '@material-ui/core/Typography/Typography';
import Avatar from '@material-ui/core/Avatar/Avatar';
import LockIcon from '@material-ui/icons/Lock';
import MuiInput from './elements/MuiInput';
import { CURRENT_USER_QUERY } from '../User';
import { handleErrors } from '../../lib/utils';

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
    email: '',
    password: '',
  };

  const formLoginFormScheme = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
  });

  const formOnSubmit = async (values, { setSubmitting, setErrors }, signIn) => {
    await signIn({ variables: values }).then(({ errors }) => {
      handleErrors(errors, setErrors);
    }).catch(err => {
      //TODO: handle network error
      console.log(err);
      setSubmitting(false);
    });
    setSubmitting(false);
  };

  const ComposedLoginForm = adopt({
    signIn: ({ render }) =>
      <Mutation
        mutation={SIGN_IN_MUTATION}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
        {(mutation, result) => render({ mutation, result })}
      </Mutation>,
    formik: ({ render, signIn }) =>
      <Formik initialValues={formDefaultValue}
              validateOnBlur={false}
              validateOnChange={false}
              validationSchema={formLoginFormScheme}
              onSubmit={(v, a) => formOnSubmit(v, a, signIn.mutation)}
              children={render}/>,
  });

  return (
    <Paper className={classes.paper}>
      <Avatar className={classes.avatar}>
        <LockIcon/>
      </Avatar>

      <Typography component="h1" variant="h5">Bejelentkezés</Typography>

      <ComposedLoginForm>
        {({ formik }) => (
          <Form className={classes.form}>
            <Field type="email"
                   name="email"
                   autoComplete="email"
                   label="E-mail"
                   component={MuiInput}
                   autoFocus/>

            <Field type="password"
                   name="password"
                   autoComplete="current-password"
                   label="Jelszó"
                   component={MuiInput}/>

            <div className={classes.wrapper}>
              <Button type="submit"
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      disabled={formik.isSubmitting}
                      fullWidth>
                Belépés
              </Button>
            </div>
          </Form>
        )}
      </ComposedLoginForm>
    </Paper>
  );
};

export default withStyles(styles)(LoginForm);
