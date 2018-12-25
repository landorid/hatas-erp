import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Notification from './Notification';

const styles = (theme) => ( {
  margin: {
    margin: theme.spacing.unit,
  },
  errorContent: {
    backgroundColor: theme.palette.error.dark,
  },
} );

class DisplayError extends React.Component {
  state = {
    open: true,
  };

  render() {
    const { error } = this.props;

    if (!error || !error.message) return null;
    if (error.networkError && error.networkError.result && error.networkError.result.errors.length) {
      return error.networkError.result.errors.map((error, i) => (
        <Notification key={i} variant={'error'} message={error.message.replace('GraphQL error: ', '')}/>

      ));
    }
    return (
      <Notification variant={'error'} message={error.message.replace('GraphQL error: ', '')}/>
    );
  }
};

DisplayError.defaultProps = {
  error: {},
};

DisplayError.propTypes = {
  error: PropTypes.object,
  classes: PropTypes.object,
};

export default withStyles(styles)(DisplayError);
