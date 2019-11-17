import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { apiMiddleware } from 'redux-api-middleware';
import apiMiddlewareInterceptor from 'redux-api-middleware-interceptor';
import storage from 'redux-persist/lib/storage';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import auth from '../Stores/auth';
import entities from '../Stores/entities';
import requests from '../Stores/requests';
import uiState from '../Stores/uiState';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'uiState'],
};

let store;
let persistor;

const initPersistantStore = () => {
  const reducers = combineReducers({
    requests,
    auth,
    entities,
    uiState,
    form: formReducer,
    router: routerReducer
  });
  const persistedReducer = persistReducer(persistConfig, reducers);
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const enhancer = composeEnhancers(applyMiddleware(
    apiMiddlewareInterceptor({
      headers: (origHeaders, state) => {
        if (state.auth.bearerToken) {
          const headers = Object.assign({}, origHeaders);
          headers.Authorization = `Bearer ${state.auth.bearerToken}`;
          return headers;
        }
        return origHeaders;
      }
    }),
    apiMiddleware)
  );
  store = createStore(persistedReducer, enhancer);
  persistor = persistStore(store);

  return { store, persistor };
};

export { initPersistantStore, store, persistor };
