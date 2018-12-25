import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import User from '../User';

export default ({ component: C, props: cProps, ...rest }) =>
  <Route {...rest} render={props =>
    <User>
      {({ loading, data: { me } }) => {
        //TODO: global loading
        return loading ? ''
          : ( me
              ? <C {...props} {...cProps} />
              : <Redirect to={`/login`} />
          );

      }}
    </User>
  }
  />
