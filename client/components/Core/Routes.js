import React from 'react';
import { get as getAtPath } from 'lodash';
import { Switch } from 'react-router-dom';
import { routes } from './constants';
import WrappedRoute from './WrappedRoute';

const Routes = () => {
  const routeComponents = [];
  ['common', 'loggedIn', 'loggedOut'].forEach((type) => {
    const auth = type === 'loggedIn';
    const routesForType = routes[type];
    Object.keys(routesForType).forEach((key) => {
      const route = routesForType[key];
      const wrapped = getAtPath(route, 'wrapped', true);
      const routeComponent = (
        <WrappedRoute
          key={`route_${type}_${key}`}
          exact
          path={route.path}
          wrapped={wrapped}
          auth={auth}
          component={React.createElement(route.component)}
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
