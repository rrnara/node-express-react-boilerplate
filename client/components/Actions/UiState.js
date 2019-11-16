export const updateDarkThemeEvent = 'UPDATE_DARK_THEME';

export const updateDarkTheme = darkTheme => {
  return { type: updateDarkThemeEvent, darkTheme };
};
