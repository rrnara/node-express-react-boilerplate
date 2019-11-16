import { updateDarkThemeEvent } from '../Actions/UiState';

const initialState = { darkTheme: false };

export default function uiState(state = initialState, action) {
  if (action.type === updateDarkThemeEvent) {
    const newState = Object.assign({}, state);
    newState.darkTheme = action.darkTheme;
    return newState;
  }

  return state;
}
