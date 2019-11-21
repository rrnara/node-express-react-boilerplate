import { HTTP_GET, HTTP_POST, makeRequest } from '../../utils/api';

export const userEntity = 'USER';

export const getUser = () =>
  makeRequest('users/me', HTTP_GET, userEntity);
  
export const createUser = ({ email }) =>
  makeRequest('users/', HTTP_POST, userEntity, { email });
