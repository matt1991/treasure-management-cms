import { takeLatest } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { push } from 'redux-router';

import { routerInEdit, payloadExtender } from '../utils';
import flowRunner from '../flowRunner';

export function* userDelete() {
  yield* takeLatest('user/delete', deleteAsync);
}

function* deleteAsync({type, payload}) {
  const eventDelete = 'delete_modal/ensure';
  const eventUserDelete = 'helper/user/delete';
  const flow = [eventDelete, eventUserDelete];

  payload = payloadExtender(payload, {
    deleteInfo: '确定删除该用户?',
  });

  const successCb = function* () {
    yield put({
      type: 'notify/info',
      payload: '删除成功',
    });
  }

  yield flowRunner(flow, payload, successCb);
}
