import React from 'react';
import PropTypes from 'prop-types';
import Query from 'react-apollo/Query';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Edit from '@material-ui/icons/Edit';
import { SINGLE_CUSTOMER_QUERY } from '../../containers/Customer';
import CustomerInfoContent from './CustomerInfoContent';

const styles = (theme) => ( {
  infoBar: {
    width: 400,
    outline: 'none',
  },
  infoContent: {
    padding: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 2,
  },
  fullList: {
    width: 'auto',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    ...theme.mixins.gutters(),
    '& h6': {
      ...theme.mixins.toolbar,
      display: 'flex',
      alignItems: 'center',
    },
  },
  editButton: {
    alignSelf: 'center',
  },
} );

class CustomerInfoDrawerBase extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    customer: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  state = {
    status: false,
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  render() {
    const { classes, customer } = this.props;

    if (!customer) return '';

    return (
      <div>
        <Button onClick={this.toggleDrawer('status', true)}>Info</Button>
        <Drawer open={this.state.status}
                anchor="right"
                onClose={this.toggleDrawer('status', false)}>
          <div className={classes.infoBar} tabIndex={0}>
            <div className={classes.toolbar}>
              <Typography variant="h6" color="inherit" noWrap>Ügyfél adatai</Typography>
              <Button size="small"
                      className={classes.editButton}
                      href={`/customer/${customer.id}`}
                      target="_blank">
                <Edit style={{ marginRight: 8 }}/> Szerkesztés
              </Button>
            </div>
            <Divider/>
            <div className={classes.infoContent}>
              <CustomerInfoContent data={customer}/>
            </div>
            <Divider/>
            <div className={classes.toolbar}>
              <Typography variant="h6" color="inherit" noWrap>Korábbi megrendelések</Typography>
            </div>
            <Divider/>

          </div>
        </Drawer>
      </div>
    );
  }
}

const CustomerInfoDrawer = ({ classes, customer }) => {
  return (
    <Query query={SINGLE_CUSTOMER_QUERY}
           fetchPolicy="cache-first"
           variables={{ id: customer }}>
      {({ data, loading }) =>
        <CustomerInfoDrawerBase
          classes={classes}
          loading={loading}
          customer={data.customer}/>}
    </Query>
  );
};

CustomerInfoDrawer.propTypes = {
  customer: PropTypes.string.isRequired,
};

export default withStyles(styles)(CustomerInfoDrawer);