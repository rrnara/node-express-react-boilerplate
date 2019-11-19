const twoParamAsyncMiddleware = function(fn) {
  return (param, next) => {
    Promise.resolve(fn(param, next))
      .catch(next);
  };
};

const threeParamAsyncMiddleware = function(fn) {
  return (param1, param2, next) => {
    Promise.resolve(fn(param1, param2, next))
      .catch(next);
  };
};

const fourParamAsyncMiddleware = function(fn) {
  return (param1, param2, param3, next) => {
    Promise.resolve(fn(param1, param2, param3, next))
      .catch(next);
  };
};

module.exports = {
  twoParamAsyncMiddleware,
  threeParamAsyncMiddleware,
  fourParamAsyncMiddleware
};
