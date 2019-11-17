import { LOGOUT_EVENT } from '../Actions/Auth';
import { UPDATE_DARK_THEME_EVENT } from '../Actions/UiState';

const initialState = { darkTheme: false };

export default function uiState(state = initialState, action) {
  if (action.type === LOGOUT_EVENT) {
    const newState = Object.assign({}, initialState);
    return newState;
  }
  if (action.type === UPDATE_DARK_THEME_EVENT) {
    const newState = Object.assign({}, state);
    newState.darkTheme = action.darkTheme;
    return newState;
  }

  return state;
}
