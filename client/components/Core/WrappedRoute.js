import React from 'react';
import { Route } from 'react-router-dom';
import MainWrapper from './MainWrapper';

const WrappedRoute = ({ component: Component, wrapped, auth, ...more}) => {
  return <Route {...more} render={props => {
    return wrapped ? <MainWrapper auth={auth} {...props}>{component}</MainWrapper> : component;
  }} />;
};

export default WrappedRoute;
