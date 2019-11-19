export const CLEAR_REQUEST_STATE = `CLEAR_REQUEST_STATE`;

export const clearRequestState = (httpMethod, entityName, suffxName = undefined) => {
  return { type: LOGOUT_EVENT, payload: { httpMethod, entityName, suffxName } };
};