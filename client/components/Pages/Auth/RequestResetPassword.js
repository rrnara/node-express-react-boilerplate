import React from 'react';
import RequestAuthPage from './RequestAuthPage';
import { routes } from '../../Core/constants';

export default function RequestResetPassword() {
  return (
    <RequestAuthPage
      submit="Send Reset"
      title={routes.loggedOut.resetPassword.label}
      link1={routes.loggedOut.root}
      link2={routes.loggedOut.confirmEmail}
      type="resetPassword"
    />
  );
};

