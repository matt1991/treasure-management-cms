import { admin, timelyLotteries } from '#/extApis';
import { put, call, apply, cancelled, select } from 'redux-saga/effects';
import { push } from 'redux-router';
import { AUTH } from '#/extConstants';

export default {
  namespace : 'timelyLottery',
  state     : {
    list:[],
    settingList:[{"id":"1058","name":"时时彩","period":300,"rule":"1","number":0,"face_img":"http://172.20.2.169:9998/img/317e1c547ca99d74afb523bba49f272f/icon/c380f5e6c5e370ca66a1f8ab512be701f4c31cd01499152726.png","modify_time":1499167517000,"create_time":1499167517000,"auto_open":1,"auto_renew":1,"number":0,"unit_price":1,"interval":50,"total_amount":0,"lucky_rate":0.95}],
    total:0,
    updated:true,
  },
  reducers  : {
    //TODO: 添加不同的api状态的reducer
    ['timelyLottery/list/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['timelyLottery/setting/list/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['timelyLottery/setting/add/succeeded'] (state, {payload}) {
      let settingList = state.settingList;
      settingList.unshift(payload);
      return {...state, ...{settingList}};
    },
    ['timelyLottery/setting/update/succeeded'] (state, {payload}) {
      let settingList = [];
      state.settingList.map((setting) =>{
        if (setting.id == payload.id) {
          settingList.push(payload);
        } else {
          settingList.push(setting);
        }
      })
      return {...state, ...{settingList}};
    },


  },

  effects : {
    //api id : 201
    *['timelyLottery/list']({payload}){
      try{
        console.log('TODO: timelyLottery/list is sent to server', payload);
        const endpoint = yield call(timelyLotteries);
        console.log(endpoint);
        const res = yield call(
          endpoint['get'],
          {
            id : '',
            query:{
              curPage:payload.curPage?payload.curPage:1,
              pageSize:payload.pageSize?payload.pageSize:10
            }
          }
        );
        console.log(res);
        yield put({
          type:'timelyLottery/list/succeeded',
          payload:{list:res.data, total:res.meta.total, updated:true}
        });
      }catch(err){
        console.warn('timelyLottery/list', 'failed to call.');
        console.log(err);
        yield put({
          type: 'timelyLottery/list/succeeded',
          payload: {updated:true},
        });
        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    },

    *['timelyLottery/setting/list']({payload}){
      try{
        console.log('TODO: timelyLottery/setting/list is sent to server');
        const endpoint = yield call(timelyLotteries);
        const res = yield call(
          endpoint['get'],
          {
            id : 'settings',
            // body: {
            //   uid  : yield select(state => state.user.getAccount()),
            //   token  : yield select(state => state.user.getToken()),
            // }
          }
        );
        yield put({
          type:'timelyLottery/setting/list/succeeded',
          payload:{settingList:res.data}
        });
      }catch(err){
        console.warn('timelyLottery/setting/list/succeeded', 'failed to call.');
        console.log(err);
        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    },

    //back 201
    *['timelyLottery/setting/add']({payload}){
      try{
        console.log('TODO: timelyLottery/setting/add is sent to server');
        const endpoint = yield call(timelyLotteries);
        const res = yield call(
          endpoint['post'],
          {
            id : '/settings/add',
            body: {
              uid  : yield select(state => state.user.getAccount()),
              token  : yield select(state => state.user.getToken()),
              ...payload
            }
          }
        );

        yield put({
          type:'timelyLottery/setting/add/succeeded',
          payload:res
        });
      }catch(err){
        console.warn('timelyLottery/setting/add', 'failed to call.');
        console.log(err);
        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    },

    //back 202
    *['timelyLottery/setting/update']({payload}){
      try{
        console.log('TODO: timelyLottery/settings/update is sent to server');
        const endpoint = yield call(timelyLotteries);
        const res = yield call(
          endpoint['post'],
          {
            id : 'settings/update',
            body: {
              // uid  : yield select(state => state.user.getAccount()),
              // token  : yield select(state => state.user.getToken()),
              ...payload
            }
          }
        );

        yield put({
          type:'timelyLottery/setting/update/succeeded',
          payload:res
        });
      }catch(err){
        console.warn('timelyLottery/setting/update', 'failed to call.');
        console.log(err);
        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    },

    *['timelyLottery/id/search']({payload}){
      try{
        console.log('TODO: timelyLottery/search is sent to server');
        const endpoint = yield call(timelyLotteries);
        const res = yield call(
          endpoint['get'],
          {
            id : payload.id,
          }
        );
        yield put({
          type: 'timelyLottery/list/succeeded',
          payload: {list : [res], total:1, updated:true},
        });

      }catch(err){
        console.warn('timelyLottery/search', 'failed to call.');
        yield put({
          type: 'timelyLottery/list/succeeded',
          payload: {list : [], total:0, updated:true},
        });
        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    },

  }
}
