import React from 'react';
import { get as getAtPath } from 'lodash';
import { Switch } from 'react-router-dom';
import { routes, routeTypes } from './constants';
import WrappedRoute from './WrappedRoute';

const Routes = () => {
  const routeComponents = [];
  Object.values(routeTypes).forEach((type) => {
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
          type={type}
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
