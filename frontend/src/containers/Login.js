import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Error from '../components/helper/Error';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet';
import { CURRENT_USER_QUERY } from '../components/User';

const SIGN_IN_MUTATION = gql`
    mutation SIGN_IN_MUTATION($email: String!, $password: String!) {
        signIn(email: $email, password: $password) {
            id
        }
    }
`;

const Login = (props) => {
  const formDefaultValue = {
    email: 'landori.david@gmail.com',
    password: '123456',
  };

  const formLoginFormScheme = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
  });

  return (
      <div>
        <Helmet>
          <title>Bejelentkezés</title>
        </Helmet>
        <Mutation mutation={SIGN_IN_MUTATION} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
          {(signIn, { error, loading }) => (
              <Formik initialValues={formDefaultValue} validationSchema={formLoginFormScheme}
                      onSubmit={async (values, { setSubmitting }) => {
                        await signIn({ variables: values }).catch(err => {});
                        setSubmitting(false);
                      }}>
                {({ isSubmitting }) => (
                    <Form>
                      <Field type="email" name="email" autoComplete="email"/>
                      <ErrorMessage name="email" component="div"/>
                      <Field type="password" name="password" autoComplete="current-password"/>
                      <ErrorMessage name="password" component="div"/>
                      <button type="submit" disabled={isSubmitting}>
                        Belépés
                      </button>
                      <Error error={error}/>
                    </Form>
                )}
              </Formik>
          )}
        </Mutation>

        <p> Vagy <Link to="/register">regisztrálj</Link>!</p>
      </div>
  );
};

export default Login;