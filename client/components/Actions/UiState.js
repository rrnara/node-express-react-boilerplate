export const UPDATE_DARK_THEME_EVENT = 'UPDATE_DARK_THEME';

export const updateDarkTheme = darkTheme => {
  return { type: UPDATE_DARK_THEME_EVENT, darkTheme };
};
