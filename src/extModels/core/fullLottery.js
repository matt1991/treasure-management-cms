import { admin, fullLotteries } from '#/extApis';
import { put, call, apply, cancelled, select } from 'redux-saga/effects';
import { push } from 'redux-router';
import { AUTH } from '#/extConstants';

export default {
  namespace : 'fullLottery',
  state     : {
    list:[],
    settingList:[],
    total:0,
    updated:true,
  },
  reducers  : {
    //TODO: 添加不同的api状态的reducer
    ['fullLottery/list/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['fullLottery/setting/add/succeeded'] (state, {payload}) {
      let settingList = state.settingList;
      settingList.unshift(payload);
      return {...state, ...{settingList}};
    },
    ['fullLottery/setting/update/succeeded'] (state, {payload}) {
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
    *['fullLottery/list']({payload}){
      try{
        console.log('TODO: fullLottery/list is sent to server', payload);
        const endpoint = yield call(fullLotteries);
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
          type:'fullLottery/list/succeeded',
          payload:{list:res.data, total:res.meta.total, updated:true}
        });
      }catch(err){
        console.warn('fullLottery/list', 'failed to call.');
        console.log(err);
        yield put({
          type: 'fullLottery/list/succeeded',
          payload: {list : [], total:0, updated:true},
        });
        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    },

    *['fullLottery/settings/list']({payload}){
      try{
        console.log('TODO: fullLottery/settings/list is sent to server');
        const endpoint = yield call(fullLotteries);
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
          type:'fullLottery/settings/list/succeeded',
          payload:{settingList:res}
        });
      }catch(err){
        console.warn('fullLottery/settings/list/succeeded', 'failed to call.');
        console.log(err);
        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    },

    //back 201
    *['fullLottery/settings/add']({payload}){
      try{
        console.log('TODO: fullLottery/settings/add is sent to server');
        const endpoint = yield call(fullLotteries);
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
          type:'fullLottery/settings/add/succeeded',
          payload:res
        });
      }catch(err){
        console.warn('fullLottery/settings/add', 'failed to call.');
        console.log(err);
        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    },

    //back 202
    *['fullLottery/settings/update']({payload}){
      try{
        console.log('TODO: fullLottery/settings/update is sent to server');
        const endpoint = yield call(fullLotteries);
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
          type:'fullLottery/settings/update/succeeded',
          payload:res
        });
      }catch(err){
        console.warn('fullLottery/settings/update', 'failed to call.');
        console.log(err);
        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    },

    *['fullLottery/id/search']({payload}){
      try{
        console.log('TODO: fullLottery/search is sent to server');
        const endpoint = yield call(fullLotteries);
        const res = yield call(
          endpoint['get'],
          {
            id : payload.id,
          }
        );
        yield put({
          type: 'fullLottery/list/succeeded',
          payload: {list : [res], total:1, updated:true},
        });

      }catch(err){
        console.warn('fullLottery/search', 'failed to call.');
        yield put({
          type: 'fullLottery/list/succeeded',
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
