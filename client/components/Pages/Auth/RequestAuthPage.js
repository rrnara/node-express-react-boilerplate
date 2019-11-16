import React from 'react';
import { connect } from 'react-redux';
import { tokenEntity, generateToken } from '../../Actions/Auth';
import { formToObject } from './utils';
import AuthPage from './AuthPage';
import { HTTP_PUT, getRequestState } from '../../utils/api';

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

const RequestAuthPage = ({ requestState, doRequest, type, ...props }) => {
  const submit = event => {
    event.preventDefault();
    const data = formToObject(event, ['email']);
    data.type = type;
    return doRequest(data);
  };

  return (
    <AuthPage
      {...props}
      onSubmit={submit}
      submitting={requestState.done}
      error={requestState.error}
    />
  );
};

const RequestAuthPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RequestAuthPage);

export { RequestAuthPageContainer as default };
