import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';

import Home from './containers/Home';
import Login from './containers/Login';
import NotFound from './containers/NotFound';
import Layout from './hoc/Layout/Layout';
import client from './lib/dataProvider';
import PrivateRoute from './components/helper/PrivateRoute';
import UnauthenticatedRoute from './components/helper/UnauthenticatedRoute';
import theme from './lib/muiTheme';
import Profile from './containers/Profile';
import { PageTitleProvider } from './lib/pageTitleProvider';
import Users from './containers/Users';
import AddUser from './containers/AddUser';
import EditUser from './containers/EditUser';
import Customers from './containers/Customers';
import Customer from './containers/Customer';
import Stock from './containers/Stock';
import StockItem from './containers/StockItem';
import StockCategory from './containers/StockCategory';

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <MuiThemeProvider theme={theme}>
          <PageTitleProvider>
            <CssBaseline/>
            <Layout>
              <Switch>
                <PrivateRoute path="/" exact component={Home}/>
                <PrivateRoute path="/profile" exact component={Profile}/>
                <PrivateRoute path="/users" exact component={Users}/>
                <PrivateRoute path="/users/add" exact component={AddUser}/>
                <PrivateRoute path="/users/:id" component={EditUser}/>
                <PrivateRoute path="/customers/add" exact component={Customer}/>
                <PrivateRoute path="/customers/all/:page" component={Customers}/>
                <PrivateRoute path="/customers/:id" component={Customer}/>
                <PrivateRoute path="/stock" exact component={Stock}/>
                <PrivateRoute path="/stock/add" exact component={StockItem}/>
                <PrivateRoute path="/stock/category" exact component={StockCategory}/>
                <PrivateRoute path="/stock/:id" component={StockItem}/>
                <UnauthenticatedRoute path="/login" component={Login}/>
                <PrivateRoute component={NotFound}/>
              </Switch>
            </Layout>
          </PageTitleProvider>
        </MuiThemeProvider>
      </ApolloProvider>
    );
  }
}

export default App;
