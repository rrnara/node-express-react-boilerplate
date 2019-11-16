import { HTTP_GET, makeRequest } from '../../utils/api';

export const userEntity = 'USER';

export const getUser = () =>
  makeRequest('users/me', HTTP_GET, userEntity);
