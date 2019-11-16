import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { formToObject } from './utils';
import { routes } from '../../Core/constants';
import { authEntity, login } from '../../Actions/Auth';
import AuthPage from './AuthPage';

const mapStateToProps = state => {
  return {
    user: state.entities.user,
    requestState: getRequestState(state, HTTP_POST, authEntity, ownProps.type)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    doLogin: data => {
      dispatch(login(data));
    },
  };
};

const LoginForm = ({
  requestState,
  currentUser,
  doLogin,
  location: { state: { from: { pathname: returnTo } = {} } = {} } = {},
} = {}) => {
  const submit = event => {
    event.preventDefault();
    return doLogin(formToObject(event, ['email', 'password']));
  };

  if (user) {
    return (
      <Redirect
        to={returnTo || routes.loggedIn.root}
      />
    );
  }

  return (
    <AuthPage
      password
      submit="Login"
      title="Login"
      link1={routes.loggedOut.resetPassword}
      link2={routes.loggedOut.confirmEmail}
      onSubmit={submit}
      submitting={requestState.done}
      error={requestState.error}
    />
  );
};

const LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginForm);

export { LoginContainer as default };
