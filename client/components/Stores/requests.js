import { LOGOUT_EVENT } from '../Actions/Auth';
import { CLEAR_REQUEST_STATE } from '../Actions/Requests';
import { parseRequest, requestStateName } from '../../utils/api';

const initialState = {};

const safeSubstr = (str, start, length = undefined) => {
  if (str) {
    return str.substr(start, length);
  }
  return str;
}

export default function entities(state = initialState, action) {
  if (action.type === LOGOUT_EVENT) {
    const newState = Object.assign({}, initialState);
    return newState;
  }
  if (action.type === CLEAR_REQUEST_STATE) {
    const stateName = requestStateName(...action.payload);
    const newState = Object.assign({}, state);
    delete newState[stateName];
    return newState;
  }

  const requestInfo = parseRequest(action);
  if (requestInfo) {
    const stateName = requestStateName(requestInfo[1], requestInfo[2], safeSubstr(requestInfo[3], 1));
    const requestState = { stage: requestInfo[4] };
    if (action.error) {
      requestState.error = action.payload.response || { error: 'Unexpected' };
    }
    const newState = Object.assign({}, state);
    newState[stateName] = requestState;
    return newState;
  }

  return state;
}
