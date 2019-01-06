import React from 'react';
import { distanceInWordsToNow } from 'date-fns';
import dateLocale from 'date-fns/locale/hu';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import * as PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

const style = (theme) => ( {
  root: {
    margin: theme.spacing.unit * -2,
    marginTop: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2,
    backgroundColor: theme.palette.grey['100'],
    display: 'flex',
    alignItems: 'center',
  },
  updatedAt: {
    marginLeft: 'auto',
  },
} );

const ActionFooter = ({ classes, submitting, dirty, updatedAt }) => (
  <div className={classes.root}>
    <Button type="submit"
            variant="contained"
            color="primary"
            disabled={submitting || !dirty}>
      Ment{!dirty ? 've' : 'és'}
    </Button>
    {updatedAt && <Typography variant="caption" color="textSecondary" className={classes.updatedAt}>
      Utolsó módosítás: {distanceInWordsToNow(
      new Date(updatedAt),
      { locale: dateLocale },
    )}</Typography>}
  </div>
);

ActionFooter.propTypes = {
  submitting: PropTypes.bool.isRequired,
  dirty: PropTypes.bool.isRequired,
  updatedAt: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default withStyles(style)(ActionFooter);