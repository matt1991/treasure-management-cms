import { admin, timelyLotteries } from '#/extApis';
import { put, call, apply, cancelled, select } from 'redux-saga/effects';
import { push } from 'redux-router';
import { AUTH } from '#/extConstants';

export default {
  namespace : 'timelyLottery',
  state     : {
    list:[],
    settingList:[],
    total:0,
    updated:true,
  },
  reducers  : {
    //TODO: 添加不同的api状态的reducer
    ['timelyLottery/list/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['timelyLottery/setting/add/succeeded'] (state, {payload}) {
      let settingList = state.settingList;
      settingList.unshift(payload);
      return {...state, ...{settingList}};
    },
    ['timelyLottery/setting/update/succeeded'] (state, {payload}) {
      let settingList = state.settingList;
      settingList.map((setting) =>{
        if (setting.id == payload.id) {
          return payload;
        } else {
          return setting;
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
          payload: {list : [], total:0, updated:true},
        });
        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    },

    *['timelyLottery/settings/list']({payload}){
      try{
        console.log('TODO: timelyLottery/settings/list is sent to server');
        const endpoint = yield call(timelyLotteries);
        const res = yield call(
          endpoint['post'],
          {
            id : 'settings/list',
            body: {
              uid  : yield select(state => state.user.getAccount()),
              token  : yield select(state => state.user.getToken()),
            }
          }
        );
        yield put({
          type:'timelyLottery/settings/list/succeeded',
          payload:{settingList:res}
        });
      }catch(err){
        console.warn('timelyLottery/settings/list/succeeded', 'failed to call.');
        console.log(err);
        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    },

    //back 201
    *['timelyLottery/settings/add']({payload}){
      try{
        console.log('TODO: timelyLottery/settings/add is sent to server');
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
          type:'timelyLottery/settings/add/succeeded',
          payload:res
        });
      }catch(err){
        console.warn('timelyLottery/settings/add', 'failed to call.');
        console.log(err);
        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    },

    //back 202
    *['timelyLottery/settings/update']({payload}){
      try{
        console.log('TODO: timelyLottery/settings/update is sent to server');
        const endpoint = yield call(timelyLotteries);
        const res = yield call(
          endpoint['post'],
          {
            id : 'settings/update',
            body: {
              uid  : yield select(state => state.user.getAccount()),
              token  : yield select(state => state.user.getToken()),
              ...payload
            }
          }
        );

        yield put({
          type:'timelyLottery/settings/update/succeeded',
          payload:res
        });
      }catch(err){
        console.warn('timelyLottery/settings/update', 'failed to call.');
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
