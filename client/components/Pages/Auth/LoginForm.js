import React from 'react';
import { connect } from 'react-redux';
import { formToObject } from './utils';
import { routes } from '../../Core/constants';
import { authEntity, facebookEntity, login, facebookAuth } from '../../Actions/Auth';
import AuthPage from './AuthPage';
import { HTTP_POST, getRequestState } from '../../../utils/api';

const mapStateToProps = state => {
  return {
    requestState: getRequestState(state, HTTP_POST, authEntity),
    facebookRequestState: getRequestState(state, HTTP_POST, facebookEntity)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    doLogin: data => {
      dispatch(login(data));
    },
    doFacebookAuth: data => {
      dispatch(facebookAuth(data));
    }
  };
};

const LoginForm = ({
  requestState,
  facebookRequestState,
  doLogin,
  doFacebookAuth,
  location: { state: { from: { pathname: returnTo } = {} } = {} } = {},
} = {}) => {
  const submit = event => {
    event.preventDefault();
    return doLogin(formToObject(event, ['email', 'password']));
  };

  const facebookCallback = profile => {
    return doFacebookAuth({ accessToken: profile.accessToken });
  };

  return (
    <AuthPage
      password
      submit="Login"
      title="Login"
      link1={routes.loggedOut.resetPassword}
      link2={routes.loggedOut.confirmEmail}
      onSubmit={submit}
      facebookCallback={facebookCallback}
      submitting={requestState.done === false || facebookRequestState.done === false}
      error={requestState.error || facebookRequestState.error}
    />
  );
};

const LoginFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginForm);

export { LoginFormContainer as default };
