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
