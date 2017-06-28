import { admin } from '#/extApis';
import { put, call, apply, cancelled, select } from 'redux-saga/effects';
import { push } from 'redux-router';
import { AUTH } from '#/extConstants';

export default {
  namespace : 'sadmin',
  state     : {
    newRoom : {
      name  : 'xxx',
      desc  : 'XXXX',
    },
    roomList: [{
      id          : -1,
      p_id        : 'unknown',
      lag_room_id : 'unknown',
      lag_login_id: 'unknown',
      lag_login_password : 'unkonwn',
      title       : 'unknown',
      description : 'unknown',
      status      : '2'
    },],
    detailRoom : {
      //字段同上
    },
  },
  reducers  : {
    //TODO: 添加不同的api状态的reducer
    ['admin/createroom/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },

    ['admin/detailroom/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['admin/editroom/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['admin/listroom/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['admin/deleteroom/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
  },

  effects : {
    //更改密码使用user中的changepwd， admin 和 superadmin都是
    //api id : 203
    *['admin/createroom']({payload}){
      try{
        console.log('TODO: admin/createroom is sent to server');
        const endpoint = yield call(admin);
        const res = yield call(
          endpoint['post'],
          {
            id : 'createRoom',
            body: {
              u  : yield select(state => state.user.getAccount()),
              t  : yield select(state => state.user.getToken()),
              rt       : payload.name,
              img      : payload.img || "unknown",
              d        : payload.desc || "unknown",//展开field
            }
          }
        );
        if (res.status == -1) throw res.msg;

        yield put(push({
          pathname: '/room/list'
        }));
      }catch(err){
        console.warn('admin/createroom', 'failed to call.');
        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    },

    //api id : 204
    *['admin/detailroom']({payload}){
      try{
        console.log('TODO: admin/detailroom is sent to server');
        const endpoint = yield call(admin);
        const res = yield call(
          endpoint['post'],
          {
            id : 'listRoom',
            body: {
              u  : yield select(state => state.user.getAccount()),
              t  : yield select(state => state.user.getToken()),
              id : payload.roomId,
            }
          }
        );
        if (res.status == -1) throw "没有更多数据。";
        yield put({
          type: 'admin/detailroom/succeeded',
          payload: {detailRoom : res.list},
        });

      }catch(err){
        console.warn('admin/detailroom', 'failed to call.');
        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    },

    //api id : 205
    *['admin/editroom']({payload}){
      try{
        console.log('TODO: admin/editroom is sent to server');
        const endpoint = yield call(admin);
        const res = yield call(
          endpoint['post'],
          {
            id : 'updateRoom',
            body: {
              u  : yield select(state => state.user.getAccount()),
              t  : yield select(state => state.user.getToken()),
              rt : payload.title,
              img: payload.img,
              d  : payload.desc,
              id : payload.id,
            }
          }
        );
        if (res.status == -1) throw "没有更多数据。";
        yield put(push(`/room/info/${payload.id}`));
      }catch(err){
        console.warn('admin/editroom', 'failed to call.');

        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    },

    //api id : 确实 list
    *['admin/listroom']({payload}){
      try{
        console.log('TODO: admin/listroom is sent to server');
        const endpoint = yield call(admin);
        const res = yield call(
          endpoint['post'],
          {
            id : 'listRoom',
            body: {
              u  : yield select(state => state.user.getAccount()),
              t  : yield select(state => state.user.getToken()),
              p        : 1, //分页页数 -1 希望是全部
            }
          }
        );
        if (res.status == -1) throw "没有更多数据。";
        yield put({
          type: 'admin/listroom/succeeded',
          payload: {roomList : res.list.length > 0 ? res.list : {}},
        });
      }catch(err){
        console.warn('admin/listroom', 'failed to call.');
        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    }
  }
}
