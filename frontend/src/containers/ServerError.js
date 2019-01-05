import React from 'react';
import Typography from '@material-ui/core/es/Typography/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { Helmet } from 'react-helmet';

const style = (theme) => ( {
  wrapper: {
    textAlign: 'center',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    left: '50%',
    top: '50%',
  },
  errorTitle: {
    fontSize: 100,
    fontFamily: theme.typography.fontFamily,
    fontWeight: 900,
    margin: 0,
    letterSpacing: -10,
    marginLeft: -10,
    lineHeight: 1,
    [theme.breakpoints.up('md')]: {
      fontSize: 252,
      marginLeft: -40,
      letterSpacing: -40,
    },
    '& span': {
      textShadow: `-8px 0px 0px ${theme.palette.background.default}`,
    },
  },
} );

const ServerError = ({ classes }) => {
  return (
    <>
      <Helmet>
        <title>503 Service Unavailable</title>
      </Helmet>
      <div className={classes.wrapper}>
        <h1 className={classes.errorTitle}><span>5</span><span>0</span><span>3</span></h1>
        <Typography variant="h5">Hoppá! A szolgáltatás jelenleg nem elérhető</Typography>
      </div>
    </>
  );
};

export default withStyles(style)(ServerError);