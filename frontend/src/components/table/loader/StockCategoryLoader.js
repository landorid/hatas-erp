import React from 'react';
import ContentLoader from 'react-content-loader';
import * as PropTypes from 'prop-types';
import { Paper } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core';

const style = (theme) => ( {
  root: {
    overflow: 'hidden',
    padding: theme.spacing.unit * 2,
  },
} );

const MyLoader = props => (
  <ContentLoader
    rtl
    height={65}
    speed={2}
    ariaLabel="Betöltés.."
    {...props}
  >
    <rect x="5" y="5" rx="5" ry="5" width={295} height={55} />
  </ContentLoader>
);

const StockCategoryLoader = (props) => {
  const { size = 10, classes } = props;

  return (
    <Paper className={classes.root} square>
      <Grid container spacing={16}>
        <Grid item xs={12} sm={6} lg={6}>
          {[...Array(size).keys()].map(item => <MyLoader key={item}/>)}
        </Grid>
        <Grid item xs={12} sm={6} lg={6}>
          {[...Array(size).keys()].map(item => <MyLoader key={item}/>)}
        </Grid>
      </Grid>
    </Paper>
  );
};

StockCategoryLoader.propTypes = {
  size: PropTypes.number,
};
export default withStyles(style)(StockCategoryLoader);