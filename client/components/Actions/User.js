import { HTTP_GET, makeRequest } from '../../utils/api';

export const userEntity = 'USER';

export const getUser = () =>
  makeRequest('users/get_current_user', HTTP_GET, userEntity);
