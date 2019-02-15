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
import Supplier from './containers/Supplier';
import Suppliers from './containers/Suppliers';
import Products from './containers/Products';
import Product from './containers/Product';
import Worksheets from './containers/Worksheets';
import Worksheet from './containers/Worksheet';

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
                <PrivateRoute path="/customer/add" exact component={Customer}/>
                <PrivateRoute path="/customers/all/:page" component={Customers}/>
                <PrivateRoute path="/customer/:id" component={Customer}/>
                <PrivateRoute path="/stock" exact component={Stock}/>
                <PrivateRoute path="/stock/add" exact component={StockItem}/>
                <PrivateRoute path="/stock/category" exact component={StockCategory}/>
                <PrivateRoute path="/stock/:id" component={StockItem}/>
                <PrivateRoute path="/suppliers" component={Suppliers}/>
                <PrivateRoute path="/supplier/add" exact component={Supplier}/>
                <PrivateRoute path="/supplier/:id" component={Supplier}/>
                <PrivateRoute path="/products" component={Products}/>
                <PrivateRoute path="/product/add" exact component={Product}/>
                <PrivateRoute path="/product/:id" component={Product}/>
                <PrivateRoute path="/worksheets" component={Worksheets}/>
                <PrivateRoute path="/worksheet/add" exact component={Worksheet}/>
                <PrivateRoute path="/worksheet/:id" component={Worksheet}/>
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
