import React from 'react';
import { connect } from 'react-redux';
import { formToObject } from './utils';
import { routes } from '../../Core/constants';
import { authEntity, login } from '../../Actions/Auth';
import AuthPage from './AuthPage';
import { HTTP_POST, getRequestState } from '../../../utils/api';

const mapStateToProps = state => {
  return {
    requestState: getRequestState(state, HTTP_POST, authEntity)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    doLogin: data => {
      dispatch(login(data));
    }
  };
};

const LoginForm = ({
  requestState,
  doLogin,
  location: { state: { from: { pathname: returnTo } = {} } = {} } = {},
} = {}) => {
  const submit = event => {
    event.preventDefault();
    return doLogin(formToObject(event, ['email', 'password']));
  };

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

const LoginFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginForm);

export { LoginFormContainer as default };
