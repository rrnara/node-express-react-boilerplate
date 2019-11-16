import { pick, isEmpty } from 'lodash';

export const formToObject = function(submitEvent, keys = null) {
  const obj = Object.fromEntries(new FormData(submitEvent.target));
  return isEmpty(keys) ? obj : pick(obj, keys);
};
