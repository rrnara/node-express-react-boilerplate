import React from 'react';
import { Route } from 'react-router-dom';
import MainWrapper from './MainWrapper';

const WrappedRoute = ({ component, wrapped, type, ...more}) => {
  return <Route {...more} render={props => {
    return wrapped ? <MainWrapper type={type} {...props}>{component}</MainWrapper> : component;
  }} />;
};

export default WrappedRoute;
