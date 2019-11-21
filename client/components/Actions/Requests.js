export const CLEAR_REQUEST_STATE = `CLEAR_REQUEST_STATE`;

export const clearRequestState = (httpMethod, entityName, suffxName = undefined) => {
  return { type: CLEAR_REQUEST_STATE, payload: { httpMethod, entityName, suffxName } };
};