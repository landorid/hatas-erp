import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Input from './elements/Input';
import withStyles from '@material-ui/core/styles/withStyles';
import gql from 'graphql-tag';
import { adopt } from 'react-adopt';
import { Mutation } from 'react-apollo';
import { handleError } from '../../lib/transformError';
import FormContainer from './elements/FormContainer';

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
  actionContainer: {
    margin: theme.spacing.unit * -2,
    marginTop: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2,
    backgroundColor: theme.palette.grey['100'],
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

const formSubmit = async (variables, { setErrors, setSubmitting }, mutation) => {
  await mutation({ variables }).catch(err => {
    handleError(err, setErrors, [
      { input: 'oldPassword', err: 'INVALID_OLD_PASSWORD' },
    ]);
    setSubmitting(false);
  });
  setSubmitting(false);
  //TODO: show message when updated is finished properly
};

const Composed = adopt({
  mutation: ({ render }) => <Mutation mutation={CHANGE_CURRENT_USER_MUTATION} children={render}/>,
  formik: ({ render, mutation }) =>
    <Formik initialValues={formDefaultValue} validationSchema={formScheme} children={render} validateOnChange={false}
            validateOnBlur={false} onSubmit={(v, a) => formSubmit(v, a, mutation)}/>,
});

const ChangePassword = (props) => {
  const { classes } = props;
  return (
    <Composed>
      {({ formik: { isSubmitting, dirty } }) => (
        <FormContainer>
          <Grid container className={classes.root} spacing={16}>
            <Grid item xs={12} sm={12} lg={4}>
              <Input type="password" name="oldPassword" label="Jelenlegi jelszó" autoComplete="current-password"
                     autoFocus/>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <Input type="password" name="newPassword" autoComplete="new-password" label="Új jelszó"/>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <Input type="password" name="newPasswordConfirm" autoComplete="new-password"
                     label="Új jelszó mégegyszer"/>
            </Grid>
          </Grid>
          <div className={classes.actionContainer}>
            <Button type="submit" variant="contained" color="primary" className={classes.submit}
                    disabled={isSubmitting || !dirty}>
              Módosítás
            </Button>
          </div>
        </FormContainer>
      )}
    </Composed> );
};

export default withStyles(style)(ChangePassword);