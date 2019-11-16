import React from 'react';
import RequestAuthPage from './RequestAuthPage';
import { routes } from '../../Core/constants';

export default function RequestEmailConfirmation() {
  return (
    <RequestAuthPage
      submit="Send Confirmation"
      title="Confirm Email Address"
      link1={routes.loggedOut.root}
      link2={routes.loggedOut.resetPassword}
      type="confirmEmail"
    />
  );
};
