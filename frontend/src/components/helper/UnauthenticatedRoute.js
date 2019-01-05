import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import User from '../User';
import ServerError from './PrivateRoute';

export default ({ component: C, props: cProps, ...rest }) =>
  <Route {...rest} render={props =>
    <User>
      {({ loading, data, error }) => {
        //TODO: global loading
        if (error) {
          return <ServerError/>;
        }
        return loading ? '' :
          ( !data.me
              ? <C {...props} {...cProps} />
              : <Redirect to={`/`}/>
          );

      }}
    </User>
  }
  />;