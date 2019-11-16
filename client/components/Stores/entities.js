import { authEntity } from '../Actions/Auth';
import { userEntity } from '../Actions/User';
import { HTTP_GET, HTTP_POST, HTTP_PUT, isRequestSuccess } from '../../utils/api';

const initialState = { user: null };

export default function entities(state = initialState, action) {
  if (isRequestSuccess(action, HTTP_GET, userEntity)) {
    const newState = Object.assign({}, state);
    newState.user = action.payload;
    return newState;
  }
  if (isRequestSuccess(action, HTTP_POST, authEntity) || isRequestSuccess(action, HTTP_PUT, authEntity)) {
    const newState = Object.assign({}, state);
    newState.user = Object.assign({}, action.payload);
    delete newState.user.token; // Token gets stored in auth store
    return newState;
  }
  return state;
}
