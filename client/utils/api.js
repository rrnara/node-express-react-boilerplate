import { RSAA } from 'redux-api-middleware';
import { stringify } from 'query-string';
import { isFunction, isObject, trim, isEmpty } from 'lodash';

export const HTTP_GET = 'GET';
export const HTTP_POST = 'POST';
export const HTTP_PUT = 'PUT';

export function hostUrl() {
  const { location } = window;
  return `${location.protocol}//${location.host}`;
}

export function apiUrl(relativeUrl) {
  return `${hostUrl()}/api/${relativeUrl}`;
}

const actionNamespace = '@@api/';
const actionRegex = /@@api\/(GET|POST|PUT)_([a-zA-Z0-9]+)(_[a-zA-Z0-9]+)?_(REQUEST|SUCCESS|FAILURE)/;

export function requestStateName(httpMethod, entityName, suffixName = undefined) {
  return isEmpty(suffixName) || isEmpty(trim(suffixName)) ? `${httpMethod}_${entityName}` : `${httpMethod}_${entityName}_${suffixName}`;
}

export function getRequestState(state, httpMethod, entityName, suffxName = undefined) {
  const stateName = requestStateName(httpMethod, entityName, suffxName);
  let result = { done: null };
  if (state.requests[stateName]) {
    result.done = state.requests[stateName].stage === 'SUCCESS';
    if (state.requests[stateName].stage === 'FAILURE') {
      result = {
        done: true,
        error: state.requests[stateName].error,
      };
    }
  }
  return result;
}

export function makeRequest(relativeUrl, httpMethod, entityName, params = undefined, suffxName = undefined) {
  const stateName = requestStateName(httpMethod, entityName, suffxName);
  let httpBody;
  let urlToUse = relativeUrl;
  if (httpMethod === HTTP_POST || httpMethod === HTTP_PUT) {
    httpBody = !isObject(params) || isFunction(params) || (params instanceof FormData) ? params : JSON.stringify(params);
  } else {
    const queryString = stringify(params);
    if (queryString !== '') {
      urlToUse = `${urlToUse}?${queryString}`;
    }
  }
  
  return {
    [RSAA]: {
      endpoint: apiUrl(urlToUse),
      method: httpMethod,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: httpBody,
      types: [
        `${actionNamespace}${stateName}_REQUEST`,
        `${actionNamespace}${stateName}_SUCCESS`,
        `${actionNamespace}${stateName}_FAILURE`
      ],
    },
  };
}

export function parseRequest(action) {
  return actionRegex.exec(action.type);
}

export function isRequestSuccess(action, httpMethod, entityName, suffxName = undefined) {
  return action.type === `${actionNamespace}${requestStateName(httpMethod, entityName, suffxName)}_SUCCESS`;
}
