import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { parse } from 'query-string';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormHelperText from '@material-ui/core/FormHelperText';
import { tokenEntity, validateToken, authEntity, setPassword } from '../../Actions/Auth';
import { pick, isEmpty } from 'lodash';
import { formToObject } from './utils';
import AuthPage from './AuthPage';
import { HTTP_POST, HTTP_PUT, getRequestState } from '../../utils/api';

const mapStateToProps = (state, ownProps) => {
  return {
    validateRequestState: getRequestState(state, HTTP_POST, tokenEntity, ownProps.type),
    passwordRequestState: getRequestState(state, HTTP_PUT, tokenauthEntityEntity, ownProps.type)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    doValidateRequest: data => dispatch(validateToken(data)),
    doSetPasswordRequest: data => dispatch(validateToken(data))
  };
};

const ValidateTokenPage = ({ validateRequestState, passwordRequestState, doValidateRequest, doSetPasswordRequest, type, location, ...props }) => {
  const params = pick(parse(location.search, { parseBooleans: true, parseNumbers : true}), ['email', 'token']);
  const submit = event => {
    event.preventDefault();
    const data = Object.assign(formToObject(event, ['password']), params);
    data.type = type;
    return doSetPasswordRequest(data);
  };

  if (isEmpty(params.email) || isEmpty(params.token)) {
    return (
      <FormHelperText error>
        Bad Link: Need email and token provided
      </FormHelperText>
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


  if (!validateRequestState.done) {
    return <CircularProgress />;
  } else if (validateRequestState.error) {
    return <FormHelperText error>Error occured: {validateRequestState.error.error}</FormHelperText>;
  }

  return (
    <AuthPage
      {...props}
      onSubmit={submit}
      updatePasswordFor={params.email}
      submitting={passwordRequestState.done}
      error={passwordRequestState.error}
    />
  );
};

const ValidateTokenPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ValidateTokenPage);

export { ValidateTokenPageContainer as default };
