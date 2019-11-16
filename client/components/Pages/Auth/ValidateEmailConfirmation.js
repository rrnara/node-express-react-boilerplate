import React from 'react';
import ValidateTokenPage from './ValidateTokenPage';
import { routes } from '../../Core/constants';

export default function ValidateEmailConfirmation() {
  return (
    <ValidateTokenPage
      submit="Create"
      title={routes.loggedOut.verifyEmail.label}
      link1={routes.loggedOut.root}
      link2={routes.loggedOut.resetPassword}
      type="confirmEmail"
    />
  );
};
