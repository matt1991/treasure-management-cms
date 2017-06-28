import { takeLatest } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { push } from 'redux-router';

import { routerInEdit, payloadExtender } from '../utils';
import flowRunner from '../flowRunner';

export function* userSave() {
  yield* takeLatest('user/save', saveAsync);
}

function* saveAsync({type, payload}) {
  const eventUserModify = 'helper/user/modify';
  const eventUserSave = 'helper/user/save';
  const flow = [eventUserModify, eventUserSave];

  const successCb = function* () {
    yield put({
      type: 'notify/info',
      payload: '保存成功',
    });
  }

  yield flowRunner(flow, payload, successCb);
}
