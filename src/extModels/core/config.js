import { put, call, apply, cancelled, select, take } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import { push } from 'redux-router';

import { taskmaster, getArgFromRouter, fileHelper } from '#/utils';
import { store } from '#/app';

import { handlersFilter } from '../utils';

export default {
  namespace: 'config',
  state: {
    handlers: [],
    articleType: undefined,
    uptoken: undefined,
  },
  subscriptions: [
    function(dispatch) {
      /*
       * https://github.com/ReactTraining/history/blob/master/docs/BasenameSupport.md
       * plan to use `history.listen` to add a listener to location
       * https://github.com/acdlite/redux-router
       * /blob/dbc0045c299d8df7e83a853903baf292a73579cc/src/reduxReactRouter.js#L26
       * /blob/dbc0045c299d8df7e83a853903baf292a73579cc/src/reduxReactRouter.js#L41
       * redux router use `useRouterHistory(createHashHistory)(...params)` to create and use history
       * this history is mounted to store
       * so we use store here to listen to location changes
       * @params [location]
       * https://github.com/ReactTraining/history/blob/5cc83c15127a757eb40d92e9a97e36881785ab92/docs/Location.md
       */

      store.history.listen(location => {
        if (window.__debug_mode) {
          // console.table([
          //   ['event', 'action', 'pathname'],
          //   ['route/changed', location.action, location.pathname]
          // ]);
        }

        if (~['PUSH', 'REPLACE', 'POP'].indexOf(location.action)) {
          /* @param `action` One of PUSH, REPLACE, or POP */
          dispatch({
            type: 'router/changed',
          });
        }
      });
    }
  ],
  reducers: {
    ['config/changed'] (state, {payload}) {
      const { handlers, articleType } = payload;
      return { ...state, handlers, articleType };
    },
    ['config/uptoken/get/succeeded'] (state, {payload}) {
      return { ...state, uptoken: payload };
    }
  },
  effects: {
    *['router/changed'] ({payload}) {
      const router = yield select(state => state.router);
      const { routes } = router;
      if (routes[routes.length -1].status) {
        let user = yield select(state => state.user);
        if (!user.role) {
          const action = yield take('user/get/succeeded');
          user = action.payload;
        }

        // get articleType from router config
        const articleType = yield call(getArgFromRouter, routes, 'articleType');
        const handlers = yield call(handlersFilter, {router, user});
        yield put({
          type: 'config/changed',
          payload: { handlers, articleType },
        });
      }
    },
    *['config/uptoken/get'] ({payload}) {
      const uptoken = yield fileHelper.getUpToken();
      yield put({
        type: 'config/uptoken/get/succeeded',
        payload: uptoken,
      });
    }
  }
}
