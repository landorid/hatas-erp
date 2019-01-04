import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import * as PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Table from '@material-ui/core/Table';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableHead from '@material-ui/core/TableHead';
import Ok from '@material-ui/icons/CheckCircleOutlined';
import Disabled from '@material-ui/icons/HighlightOffOutlined';

import { getRoleName, getPermission } from '../../lib/utils';

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const styles = theme => ( {
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  userAvatar: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: theme.palette.grey.A400,
  },
  avatarImage: {
    marginRight: '10px',
  },
} );

class UsersListing extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'firstName',
    page: 0,
    rowsPerPage: 5,
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const { classes, data, rows } = this.props;
    const { order, orderBy, rowsPerPage, page } = this.state;

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <TableHead>
              <TableRow>
                {rows.map(row => {
                  return (
                    <TableCell
                      key={row.id}
                      align={row.numeric ? 'right' : 'left'}
                      sortDirection={orderBy === row.id ? order : false}
                    >
                      <Tooltip
                        title="Rendezés"
                        placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                        enterDelay={300}
                      >
                        <TableSortLabel
                          active={orderBy === row.id}
                          direction={order}
                          onClick={(e) => this.handleRequestSort(e, row.id)}
                        >
                          {row.label}
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                  );
                }, this)}
              </TableRow>
            </TableHead>
            <TableBody>
              {stableSort(data, getSorting(order, orderBy)).
                slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).
                map(n => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={n.id}
                    >
                      <TableCell align="right">
                        <Link className={classes.userAvatar} to={`/users/${n.id}`}>
                          <Avatar alt="Felhasználó profilképe" src={n.avatar} className={classes.avatarImage}>
                            {n.lastName[0] + n.firstName[0]}
                          </Avatar>
                          {n.lastName} {n.firstName}
                        </Link>
                      </TableCell>
                      <TableCell align="right">{getRoleName(n.job[0])}</TableCell>
                      <TableCell align="right">{getPermission(n.permissions[0])}</TableCell>
                      <TableCell align="right">{n.status ?
                        <Tooltip
                          title="Engedélyezve"
                          placement="left"
                          enterDelay={300}
                        ><Ok color="inherit"/>
                        </Tooltip> :
                        <Tooltip
                          title="Letiltva"
                          placement="left"
                          enterDelay={300}
                        ><Disabled color="error"/>
                        </Tooltip>}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Előző oldal',
          }}
          nextIconButtonProps={{
            'aria-label': 'Következő oldal',
          }}
          onChangePage={this.handleChangePage}
          labelRowsPerPage={'Felhasználó oldalanként'}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

UsersListing.propTypes = {
  classes: PropTypes.object.isRequired,
  rows: PropTypes.array.isRequired,
};

export default withStyles(styles)(UsersListing);