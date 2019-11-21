import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { parse } from 'query-string';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormLabel from '@material-ui/core/FormLabel';
import { tokenEntity, validateToken, authEntity, setPassword } from '../../Actions/Auth';
import { pick, isEmpty } from 'lodash';
import { routes } from '../../Core/constants';
import { formToObject } from './utils';
import Template from './Template';
import AuthForm from './AuthForm';
import { HTTP_POST, HTTP_PUT, getRequestState } from '../../../utils/api';

const mapStateToProps = (state, ownProps) => {
  return {
    validateRequestState: getRequestState(state, HTTP_POST, tokenEntity, ownProps.type),
    passwordRequestState: getRequestState(state, HTTP_PUT, authEntity, ownProps.type)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    doValidateRequest: data => dispatch(validateToken(data)),
    doSetPasswordRequest: data => dispatch(setPassword(data))
  };
};

const ValidateTokenPage = ({ validateRequestState, passwordRequestState, doValidateRequest, doSetPasswordRequest, type, title, location, history, ...props }) => {
  const params = pick(parse(location.search, { parseBooleans: true, parseNumbers : true}), ['email', 'token']);
  const submit = event => {
    event.preventDefault();
    const data = Object.assign(formToObject(event, ['password']), params);
    data.type = type;
    return doSetPasswordRequest(data);
  };

  if (isEmpty(params.email) || isEmpty(params.token)) {
    return (
      <Template title={title}>
        <FormLabel error>
          Bad Link: Need email and token provided
        </FormLabel>
      </Template>
    );
  }

  const [validateRequested, setValidateRequested] = useState(false);
  useEffect(() => {
    if (!validateRequested) {
      const data = Object.assign({ type }, params);
      doValidateRequest(data);
      setValidateRequested(true);
    }
  });

  if (passwordRequestState.done && !passwordRequestState.error) {
    history.push(routes.loggedOut.root.path);
  }

  let childComponent;
  if (!validateRequestState.done) {
    childComponent = <CircularProgress />;
  } else if (validateRequestState.error) {
    childComponent = <FormLabel error>Error occured: {validateRequestState.error.error}</FormLabel>;
  } else {
    childComponent = (
      <AuthForm
        {...props}
        onSubmit={submit}
        updatePasswordFor={params.email}
        submitting={passwordRequestState.done === false}
        error={passwordRequestState.error}
      />
    );
  }

  return (
    <Template title={title}>
      {childComponent}
    </Template>
  )
};

const ValidateTokenPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(ValidateTokenPage));

export { ValidateTokenPageContainer as default };
