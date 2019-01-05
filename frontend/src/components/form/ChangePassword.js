import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Grid from '@material-ui/core/Grid';
import Input from './elements/Input';
import withStyles from '@material-ui/core/styles/withStyles';
import gql from 'graphql-tag';
import { adopt } from 'react-adopt';
import { Mutation } from 'react-apollo';
import FormContainer from './elements/FormContainer';
import { handleErrors } from '../../lib/utils';
import ActionFooter from './elements/ActionFooter';

const CHANGE_CURRENT_USER_MUTATION = gql`
  mutation  CHANGE_CURRENT_USER_MUTATION(
  $oldPassword: String!
  $newPassword: String!
  ){
    changePassword(
      oldPassword: $oldPassword
      newPassword: $newPassword
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

const formDefaultValue = {
  oldPassword: '',
  newPassword: '',
  newPasswordConfirm: '',
};

const formScheme = Yup.object().shape({
  oldPassword: Yup.string().required(),
  newPassword: Yup.string().min(6).required(),
  newPasswordConfirm: Yup.string().oneOf([Yup.ref('newPassword'), null], 'A két jelszó nem egyezik').required(),
});

const formSubmit = async (variables, { setErrors, setSubmitting, resetForm }, mutation) => {
  await mutation({ variables }).then(({ errors }) => {
    handleErrors(errors, setErrors);
    if (!errors)
      resetForm(formDefaultValue);
  }).catch(err => {
    console.log(err);
    setSubmitting(false);
  });
  setSubmitting(false);
};

const Composed = adopt({
  mutation: ({ render }) =>
    <Mutation mutation={CHANGE_CURRENT_USER_MUTATION}
              children={render}/>,
  formik: ({ render, mutation }) =>
    <Formik initialValues={formDefaultValue}
            validationSchema={formScheme}
            children={render}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={(v, a) => formSubmit(v, a, mutation)}/>,
});

const ChangePassword = (props) => {
  const { classes } = props;
  return (
    <Composed>
      {({ formik: { isSubmitting, dirty } }) => (
        <FormContainer>
          <Grid container className={classes.root} spacing={16}>
            <Grid item xs={12} sm={12} lg={4}>
              <Input type="password"
                     name="oldPassword"
                     label="Jelenlegi jelszó"
                     autoComplete="current-password"
                     autoFocus/>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <Input type="password"
                     name="newPassword"
                     autoComplete="new-password"
                     label="Új jelszó"/>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <Input type="password"
                     name="newPasswordConfirm"
                     autoComplete="new-password"
                     label="Új jelszó mégegyszer"/>
            </Grid>
          </Grid>
          <ActionFooter dirty={dirty} submitting={isSubmitting}/>
        </FormContainer>
      )}
    </Composed> );
};

export default withStyles(style)(ChangePassword);