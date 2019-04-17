import React from 'react';
import PropTypes from 'prop-types';
import Query from 'react-apollo/Query';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Edit from '@material-ui/icons/Edit';
import NoMoney from '@material-ui/icons/MoneyOff';
import { SINGLE_CUSTOMER_QUERY } from '../../containers/Customer';
import CustomerInfoContent from './CustomerInfoContent';
import gql from 'graphql-tag';
import WorksheetItem from '../WorksheetItem';
import WorksheetsLoading from './WorksheetsLoading';

const styles = (theme) => ( {
  infoBar: {
    width: 400,
    outline: 'none',
  },
  infoContent: {
    padding: theme.spacing.unit * 3,
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
  noResultError: {
    textAlign: 'center',
    color: theme.palette.grey[400],
  },
  noResultText: {
    color: 'inherit',
  },
  worksheetWrap: {
    marginBottom: theme.spacing.unit * 3,
  },
} );

const WORKSHEETS_BY_CUSTOMER = gql`
  query WORKSHEETS_BY_CUSTOMER($customerId: ID!, $currentWorksheet: ID!) {
    worksheets(where: {customer: {id: $customerId}, id_not: $currentWorksheet}) {
      id
      name
      status
      cover
      customer {
        id
        name
      }
      responsible {
        id
        firstName
        lastName
      }
      tags {
        id
        name
      }
    }
  }`;

class CustomerInfoDrawerBase extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    customer: PropTypes.object,
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
    const { classes, customer, loading, currentWorksheet } = this.props;

    const toggleButton = (
      <Button disabled={loading}
              onClick={this.toggleDrawer('status', true)}>Ügyfél információ</Button>
    );

    if (loading) return toggleButton;

    return (
      <div>
        {toggleButton}
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

            <div className={classes.infoContent}>
              <Query query={WORKSHEETS_BY_CUSTOMER}
                     variables={{ customerId: customer.id, currentWorksheet }}>
                {({ data, loading }) => {
                  if (loading) return <WorksheetsLoading/>;
                  if (data.worksheets.length < 1) return ( <div className={classes.noResultError}>
                    <NoMoney/>
                    <Typography variant="body1"
                                className={classes.noResultText}>Ez az ügyfél még nem rendelt</Typography>
                  </div> );
                  return data.worksheets.map(item => <div key={item.id} className={classes.worksheetWrap}>
                    <WorksheetItem item={item}/>
                  </div>);
                }}
              </Query>
            </div>
            <Divider/>

          </div>
        </Drawer>
      </div>
    );
  }
}

const CustomerInfoDrawer = ({ classes, customer, currentWorksheet }) => {
  return (
    <Query query={SINGLE_CUSTOMER_QUERY}
           fetchPolicy="cache-first"
           variables={{ id: customer }}>
      {({ data, loading }) =>
        <CustomerInfoDrawerBase
          classes={classes}
          loading={loading}
          currentWorksheet={currentWorksheet}
          customer={data.customer}/>}
    </Query>
  );
};

CustomerInfoDrawer.propTypes = {
  customer: PropTypes.string.isRequired,
  currentWorksheet: PropTypes.string.isRequired,
};

export default withStyles(styles)(CustomerInfoDrawer);