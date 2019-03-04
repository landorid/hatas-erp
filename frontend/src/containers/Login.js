import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import LoginForm from '../components/form/LoginForm';
import PageTitle from '../components/PageTitle';

const styles = theme => ( {
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit *
    3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
} );

const Login = (props) => {
  const { classes } = props;

  return (
      <div className={classes.main}>
        <PageTitle title="Bejelentkezés"/>
        <LoginForm/>
      </div>
  );
};

export default withStyles(styles)(Login);