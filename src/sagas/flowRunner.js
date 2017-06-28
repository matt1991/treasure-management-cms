import { put, take, race, cancelled } from 'redux-saga/effects';
import { payloadExtender } from './utils';

function* sthAndThen(type, payload) {
  yield put({ type, payload });
  const { succeeded, failed } = yield race({
    succeeded: take(`${type}/succeeded`),
    failed: take(`${type}/failed`),
  });
  return succeeded ? succeeded : failed;
}

const flowRunner = function* (flow, payload, successCb, failedCb, finallyCb) {
  /**
   * Run flow in a queue
   * https://yelouafi.github.io/redux-saga/docs/advanced/SequencingSagas.html
   *
   * @param {Array} flow: event flow
   * @param {Object} payload: maybe not the original payload
   * @param {Generator} successCb
   * @param {Generator} failedCb
   * @param {Generator} finallyCb
   */

  try {
    if (!Array.isArray(flow) || !flow.length) return;
    for (let n of flow) {
      const result = yield* sthAndThen(n, payload);
      if (checkSuccess(result))
        payload = payloadExtender(payload, result.payload);
      else throw result.payload;
    }
    // if (flow.length === 1) {
    //   yield put({
    //     type: flow[0],
    //     payload,
    //   });
    // }
    // if (flow.length > 1) {
    //   for (let n of flow) {
    //     const result = yield* sthAndThen(n, payload);
    //     if (checkSuccess(result))
    //       payload = payloadExtender(payload, result.payload);
    //     else throw result.payload;
    //   }
    // }

    // speical rule to close leave_ensure before success callback
    yield put({
      type: 'detail/leave_ensure/off'
    });
    if (successCb) yield successCb(payload);
    payload.resolve && payload.resolve(payload);
  } catch(err) {
    if (failedCb) yield failedCb();
    payload.reject && payload.reject();
    // for debug
    if (process.env.NODE_ENV === 'development') console.log(err, payload);
  } finally {
    if (finallyCb) yield finallyCb();
    if (yield cancelled()) console.log('cancelled');
  }
}

function checkSuccess({type}) {
  return type.endsWith('/succeeded');
}

export default flowRunner;
