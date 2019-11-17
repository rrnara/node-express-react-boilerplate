import React from 'react';
import { Redirect } from 'react-router-dom';
import { routes } from './constants';

export default class Home extends React.Component {
  render () {
    return (
      <Redirect
        to={routes.loggedIn.root.path}
      />
    );
  }
}
