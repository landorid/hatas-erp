import React from 'react';
import { withStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { Form } from 'formik';

const style = (theme) => ( {
  root: {
    overflow: 'hidden',
    padding: theme.spacing.unit * 2,
  },
} );

const FormContainer = (props) => {
  return (
    <Paper className={props.classes.root} square>
      <Form>
        {props.children}
      </Form>
    </Paper>
  );
};

export default withStyles(style)(FormContainer);