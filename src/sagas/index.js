import {takeEvery} from 'redux-saga';
import {call, apply, put, take, select} from 'redux-saga/effects';
import { notification } from 'antd';
import { push } from 'redux-router';

import userSagas from './user';

function* notifyError({payload}) {
  yield call(notification.error, {
    message: payload.message || payload.error || JSON.stringify(payload),
    description: `错误：${payload.status || '未知'}`,
  });
}

function* notifyInfo({type, payload}) {
  yield call(notification.info, {
    message: payload.message || payload || JSON.stringify(payload)
  });
}

function* watchFetchError() {
  yield takeEvery('notify/error', notifyError);
}

function* watchForInfo() {
  yield takeEvery('notify/info', notifyInfo);
}

export default [
  ...userSagas,
  watchFetchError,
  watchForInfo,
];
