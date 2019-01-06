import React from 'react';
import ContentLoader from 'react-content-loader';
import * as PropTypes from 'prop-types';
import Paper from '@material-ui/core/es/Paper/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import Hidden from '@material-ui/core/Hidden';

const LoaderItem = () => (
  <ContentLoader height={60} ariaLabel={'Betöltés..'}>
    <rect x="0" y="12" rx="0" ry="0" width="100%" height="60"/>
  </ContentLoader> );

const LoaderItemDesktop = () => (
  <ContentLoader height={40} ariaLabel={'Betöltés..'}>
    <rect x="12" y="10" rx="0" ry="0" width="112" height="20"/>
    <rect x="136" y="10" rx="0" ry="0" width="112" height="20"/>
    <rect x="265" y="10" rx="0" ry="0" width="112" height="20"/>
  </ContentLoader>
);

const style = (theme) => ( {
  root: {
    overflow: 'hidden',
    padding: theme.spacing.unit * 2,
  },
} );

const FormLoading = ({ size = 3, classes }) => (
  <Paper className={classes.root} square>
    <Hidden mdUp>
      {[...Array(size).keys()].map(item => <LoaderItem key={item}/>)}
    </Hidden>
    <Hidden smDown>
      {[...Array(size).keys()].map(item => <LoaderItemDesktop key={item}/>)}
    </Hidden>
  </Paper>
);

FormLoading.propTypes = {
  size: PropTypes.number,
};

export default withStyles(style)(FormLoading);
