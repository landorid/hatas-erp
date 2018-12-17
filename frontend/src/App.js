import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import Home from './containers/Home';
import Login from './containers/Login';
import NotFound from './containers/NotFound';
import Layout from './hoc/Layout/Layout';
import client from './lib/dataProvider';
import PrivateRoute from './components/helper/PrivateRoute';
import UnauthenticatedRoute from './components/helper/UnauthenticatedRoute';

class App extends Component {
  render() {
    return (
        <ApolloProvider client={client}>
          <Layout>
            <Switch>
              <PrivateRoute path="/" exact component={Home}/>
              <UnauthenticatedRoute path="/login" component={Login}/>
              <Route component={NotFound}/>
            </Switch>
          </Layout>
        </ApolloProvider>
    );
  }
}

export default App;
