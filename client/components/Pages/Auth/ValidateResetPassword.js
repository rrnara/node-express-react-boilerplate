import React from 'react';
import ValidateTokenPage from './ValidateTokenPage';
import { routes } from '../../Core/constants';

export default function ValidateEmailConfirmation() {
  return (
    <ValidateTokenPage
      submit="Update"
      title={routes.loggedOut.verifyReset.label}
      link1={routes.loggedOut.root}
      link2={routes.loggedOut.resetPassword}
      type="resetPassword"
    />
  );
};
