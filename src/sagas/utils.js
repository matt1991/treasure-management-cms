import { put, take, call, race, select } from 'redux-saga/effects';

export function payloadExtender(payload, obj = {}) {
  // modify payload only with new properties
  // or fill its empty properties
  const keys = Object.keys(obj);
  keys.map(key => {
    if (payload[key]) {
      console.warn(
        `Dangerous: the payload you passed back has the key '${key}', it will override the original payload`
      );
    }
    payload[key] = obj[key];
  });
  return payload;
};

export function* getListPath() {
  let nextPath = '/';

  const { routes, location } = yield select(state => state.router);
  if (routes[routes.length - 1].path === 'edit/:postType/:id') {
    const routesShallow = routes.map(n => n.path);
    routesShallow.pop();
    routesShallow.shift();
    nextPath = `/${routesShallow.join('/')}`
  }
  return nextPath;
}

export function* checkRouterNow() {
  const { routes } = yield select(state => state.router);
  return routes[routes.length - 1].path;
}

export function* routerWhere() {
  const result = yield checkRouterNow();
  const location = ['list', 'edit/:postType/:id', 'new', 'new_external'];
  return location.find(result);
}

export function* routerInList() {
  const result = yield checkRouterNow();
  return result === 'list';
}

export function* routerInEdit() {
  const result = yield checkRouterNow();
  return result === 'edit/:postType/:id'
    || result === 'new'
    || result === 'new_external';
}

export function* routerInNew() {
  const result = yield checkRouterNow();
  return result === 'new' || result === 'new_external';
}

export function* transfer2Helper({ type, payload }) {
  const operation = type.split('/')[1];
  yield put({
    type: `helper/post/${operation}`,
    payload,
  });
}

export const typedApis = {
  information: 'information',
  document: 'documents',
  article: 'articles',
  live_article: 'live_articles'
};

export function checkSuccess({type}) {
  return type.endsWith('/succeeded');
}

export function* getResult(event) {
  const { succeeded, failed } = yield race({
    succeeded: take(`${event}/succeeded`),
    failed: take(`${event}/failed`),
  });
  return succeeded ? succeeded : failed;
}

export function* sthAndThen(type, payload) {
  yield put({ type, payload });
  return yield getResult(type);
}

// sthAndThen merge getResult
// function* sthAndThen(type, payload) {
//   yield put({
//     type,
//     payload,
//   });

//   const { succeeded, failed } = yield race({
//     succeeded: take(`${type}/succeeded`),
//     failed: take(`${type}/failed`),
//   });

//   return succeeded;
// }
