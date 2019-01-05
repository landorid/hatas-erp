import React from 'react';
import { Link } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import * as PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

const style = (theme) =>( {
  addUserButton: {
    position: 'fixed',
    bottom: theme.spacing.unit * 3,
    right: theme.spacing.unit * 3,
  },
} );

const AddFab = ({ classes, title, to }) => (
  <div>
    <Tooltip placement="left" title={title} aria-label={title}>
      <Fab className={classes.addUserButton} color="primary" component={Link} to={to}>
        <AddIcon/>
      </Fab>
    </Tooltip>
  </div>
);

AddFab.propTypes = {
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export default withStyles(style)(AddFab);