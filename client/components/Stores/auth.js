import { authEntity, LOGOUT_EVENT } from '../Actions/Auth';
import { HTTP_PUT, HTTP_POST, isRequestSuccess } from '../../utils/api';

const initialState = { bearerToken: null };

export default function auth(state = initialState, action) {
  if (action.type === LOGOUT_EVENT) {
    const newState = Object.assign({}, initialState);
    return newState;
  }
  if (isRequestSuccess(action, HTTP_POST, authEntity) || isRequestSuccess(action, HTTP_PUT, authEntity)) {
    const newState = Object.assign({}, state);
    newState.bearerToken = action.payload.token;
    return newState;
  }
  return state;
}
