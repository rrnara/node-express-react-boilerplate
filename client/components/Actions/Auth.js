import { HTTP_GET, HTTP_POST, HTTP_PUT, makeRequest } from '../../utils/api';

export const facebookEntity = 'FACEBOOK';

export const facebookAuth = ({ accessToken }) =>
  makeRequest('auth/facebook', HTTP_POST, facebookEntity, { access_token: accessToken });

export const authEntity = 'AUTH';

export const login = ({ email, password }) =>
  makeRequest('auth/login', HTTP_POST, authEntity, { email, password });

// Using verification or reset password token to set the user password
export const setPassword = ({ type, token, email, password }) =>
  makeRequest('auth/register', HTTP_PUT, authEntity, { [type]: token, email, password }, type);

export const tokenEntity = 'TOKEN';

export const validateToken = ({ type, token, email }) =>
  makeRequest('auth/validateToken', HTTP_POST, tokenEntity, { [type]: token, email }, type);

export const generateToken = ({ type, email }) =>
  makeRequest('auth/generateToken', HTTP_PUT, tokenEntity, { type, email }, type);

export const LOGOUT_EVENT = `${authEntity}_DELETE`;

export const logout = () => {
  return { type: LOGOUT_EVENT };
};
