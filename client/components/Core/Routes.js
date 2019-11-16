import React from 'react';
import { get as getAtPath } from 'lodash';
import { Switch } from 'react-router-dom';
import { routes } from './constants';
import WrappedRoute from './WrappedRoute';

const Routes = () => {
  const routeComponents = [];
  ['common', 'loggedIn', 'loggedOut'].forEach((type) => {
    const auth = type === 'loggedIn';
    routes[type].forEach((key) => {
      const route = routes[type][key];
      const wrapped = getAtPath(route, 'wrapped', true);
      const routeComponent = (
        <WrappedRoute
          exact
          path={route.path}
          wrapped={wrapped}
          auth={auth}
          component={route.component}
        />
      );
      routeComponents.push(routeComponent);
    });
  });
  return (
    <Switch>{routeComponents}</Switch>
  );
};

export default Routes;
