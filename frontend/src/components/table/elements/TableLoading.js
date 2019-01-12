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
  <ContentLoader height={30} ariaLabel={'Betöltés..'} width={380}>
    <rect x="0" y="0" rx="0" ry="0" width="113.33" height="17"/>
    <rect x="193.63" y="0" rx="0" ry="0" width="71.81" height="17"/>
    <rect x="309.63" y="0" rx="0" ry="0" width="71.81" height="17"/>
  </ContentLoader>
);

const style = (theme) => ( {
  root: {
    overflow: 'hidden',
    padding: theme.spacing.unit * 2,
  },
} );

const TableLoading = ({ size = 3, classes }) => (
  <Paper className={classes.root} square>
    <Hidden mdUp>
      {[...Array(size).keys()].map(item => <LoaderItem key={item}/>)}
    </Hidden>
    <Hidden smDown>
      {[...Array(size).keys()].map(item => <LoaderItemDesktop key={item}/>)}
    </Hidden>
  </Paper>
);

TableLoading.propTypes = {
  size: PropTypes.number,
};

export default withStyles(style)(TableLoading);
