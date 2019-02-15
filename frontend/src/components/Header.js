import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import gql from 'graphql-tag';
import { ApolloConsumer, Mutation } from 'react-apollo';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import UsersIcon from '@material-ui/icons/SupervisedUserCircle';
import StatIcon from '@material-ui/icons/TrendingUp';
import RefreshIcon from '@material-ui/icons/Refresh';
import SettingsIcon from '@material-ui/icons/Settings';
import Munkalap from '@material-ui/icons/Assignment';
import Feladatok from '@material-ui/icons/Event';
import People from '@material-ui/icons/People';
import LocalShipping from '@material-ui/icons/LocalShipping';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Store from '@material-ui/icons/Store';
import ListIcon from '@material-ui/icons/List';
import Products from '@material-ui/icons/ImportantDevices';
import Divider from '@material-ui/core/Divider/Divider';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import ListItem from '@material-ui/core/ListItem/ListItem';
import List from '@material-ui/core/List/List';
import Drawer from '@material-ui/core/Drawer/Drawer';
import Hidden from '@material-ui/core/Hidden/Hidden';
import { fade } from '@material-ui/core/styles/colorManipulator';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import Menu from '@material-ui/core/Menu/Menu';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import { CURRENT_USER_QUERY } from './User';
import PageTitle from './PageTitle';

const drawerWidth = 240;

const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    signOut {
      message
    }
  }
`;

const styles = theme => ( {
  appBar: {
    width: '100%',
    [theme.breakpoints.up('md')]: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
    '& a': {
      color: 'white',
      textDecoration: 'none',
      '&:hover': {
        color: fade(theme.palette.common.white, 0.5),
      },
    },
  },
  drawer: {
    flexShrink: 0,
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
    },
  },
  drawerPaper: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
    },
  },
  toolbar: {
    ...theme.mixins.gutters(),
    '& h6': {
      ...theme.mixins.toolbar,
      display: 'flex',
      alignItems: 'center',
    },
  },
  menu_sub: {
    paddingLeft: theme.spacing.unit * 5,
  },
} );

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      loading: false,
      anchorEl: null,
    };
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  toggleDrawerMenu = () => {
    this.setState({ drawerOpen: !this.state.drawerOpen });
  };

  closeDrawerMenu = () => {
    this.setState({ drawerOpen: false });
  };

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    const renderDrawer = (
      <div>
        <div className={classes.toolbar}>
          <Typography variant="h6" color="inherit" noWrap>Hatás Reklám</Typography>
        </div>
        <Divider/>
        <List>
          {[
            { name: 'Munkalapok', icon: <Munkalap/>, to: '/worksheets' },
            { name: 'Termékek', icon: <Products/>, to: '/products'},
            { name: 'Feladatok', icon: <Feladatok/>, to: '/task' },
            { name: 'Ügyfelek', icon: <People/>, to: '/customers/all/1' },
            { name: 'Beszállítók', icon: <LocalShipping/>, to: '/suppliers' },
            { name: 'Alapanyagok', icon: <Store/>, to: '/stock' },
            { name: 'Kategóriák', icon: <ListIcon/>, to: '/stock/category', sub: true },
          ].map(item => (
            <ListItem key={item.name}
                      to={item.to}
                      className={item.sub ? classes.menu_sub : null}
                      component={Link}
                      button>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name}/>
            </ListItem>
          ))}
        </List>

        <Divider/>
        <List>
          {[
            { name: 'Felhasználók', icon: <UsersIcon/>, to: '/users' },
            { name: 'Statisztika', icon: <StatIcon/>, to: '/statistic' },
            { name: 'Beállítások', icon: <SettingsIcon/>, to: '/settings' },
          ].map(item => (
            <ListItem key={item.name} to={item.to} component={NavLink} onClick={this.closeDrawerMenu} button>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name}/>
            </ListItem>
          ))}
        </List>
      </div>
    );

    return (
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit"
                        onClick={this.toggleDrawerMenu} aria-label="Open drawer">
              <MenuIcon/>
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              <PageTitle/>
            </Typography>
            <div className={classes.grow}/>
            <ApolloConsumer>
              {client => (
                <IconButton color="inherit" onClick={() => client.resetStore()}>
                  {this.state.loading ?
                    <CircularProgress className={classes.progress} color="inherit" size={24}/> :
                    <RefreshIcon/>
                  }
                </IconButton> )}
            </ApolloConsumer>
            <div>
              <IconButton
                aria-owns={open ? 'menu-appbar' : undefined}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
              >
                <AccountCircle/>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={this.handleClose}
              >

                <MenuItem component={Link} to="/profile" onClick={this.handleClose}>Profil</MenuItem>
                <Mutation mutation={SIGN_OUT_MUTATION} fetchPolicy={'no-cache'}
                          refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
                  {(signOut) => (
                    <MenuItem onClick={signOut}>Kilépés</MenuItem>
                  )}
                </Mutation>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer}>
          <Hidden mdUp>
            <Drawer
              container={this.props.container}
              variant="temporary"
              open={this.state.drawerOpen}
              onClose={this.toggleDrawerMenu}
              classes={{ paper: classes.drawerPaper }}
              ModalProps={{ keepMounted: true }}
            >
              {renderDrawer}
            </Drawer>
          </Hidden>
          <Hidden smDown>
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open>
              {renderDrawer}
            </Drawer>
          </Hidden>
        </nav>
      </div>
    );
  }
}

export default withStyles(styles)(Header);