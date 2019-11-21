import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { routes } from '../../Core/constants';
import { tokenEntity, generateToken } from '../../Actions/Auth';
import { formToObject } from './utils';
import Template from './Template';
import AuthForm from './AuthForm';
import { HTTP_PUT, getRequestState } from '../../../utils/api';

const mapStateToProps = (state, ownProps) => {
  return {
    requestState: getRequestState(state, HTTP_PUT, tokenEntity, ownProps.type)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    doRequest: data => dispatch(generateToken(data)),
  };
};

const RequestAuthPage = ({ requestState, doRequest, type, title, ...props }) => {
  const submit = event => {
    event.preventDefault();
    const data = formToObject(event, ['email']);
    data.type = type;
    return doRequest(data);
  };

  if (requestState.done && !requestState.error) {
    history.push(routes.loggedOut.root.path);
  }

  return (
    <Template title={title}>
      <AuthPage
        {...props}
        onSubmit={submit}
        submitting={requestState.done === false}
        error={requestState.error}
      />
    </Template>
  );
};

const RequestAuthPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RequestAuthPage);

export { RequestAuthPageContainer as default };
