import { admin, accumulatedLotteries } from '#/extApis';
import { put, call, apply, cancelled, select } from 'redux-saga/effects';
import { push } from 'redux-router';
import { AUTH } from '#/extConstants';

export default {
  namespace : 'accumulatedLottery',
  state     : {
    list:[],
    settingList:[],
    total:0,
    updated:true,
  },
  reducers  : {
    //TODO: 添加不同的api状态的reducer
    ['accumulatedLottery/list/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['accumulatedLottery/setting/list/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['accumulatedLottery/setting/add/succeeded'] (state, {payload}) {
      let settingList = state.settingList;
      settingList.unshift(payload);
      return {...state, ...{settingList}};
    },
    ['accumulatedLottery/setting/update/succeeded'] (state, {payload}) {
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
    *['accumulatedLottery/list']({payload}){
      try{
        console.log('TODO: accumulatedLottery/list is sent to server', payload);
        const endpoint = yield call(accumulatedLotteries);
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
          type:'accumulatedLottery/list/succeeded',
          payload:{list:res.data, total:res.meta.total, updated:true}
        });
      }catch(err){
        console.warn('accumulatedLottery/list', 'failed to call.');
        console.log(err);
        yield put({
          type: 'accumulatedLottery/list/succeeded',
          payload: {list : [], total:0, updated:true},
        });
        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    },

    *['accumulatedLottery/setting/list']({payload}){
      try{
        console.log('TODO: accumulatedLottery/setting/list is sent to server');
        const endpoint = yield call(accumulatedLotteries);
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
          type:'accumulatedLottery/setting/list/succeeded',
          payload:{settingList:res.data}
        });
      }catch(err){
        console.warn('accumulatedLottery/setting/list/succeeded', 'failed to call.');
        console.log(err);
        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    },

    //back 201
    *['accumulatedLottery/setting/add']({payload}){
      try{
        console.log('TODO: accumulatedLottery/setting/add is sent to server');
        const endpoint = yield call(accumulatedLotteries);
        const res = yield call(
          endpoint['post'],
          {
            id : '/settings/add',
            body: {
              ...payload
            }
          }
        );

        console.log(payload);

        yield put({
          type:'accumulatedLottery/setting/add/succeeded',
          payload:res
        });
      }catch(err){
        console.warn('accumulatedLottery/setting/add', 'failed to call.');
        console.log(err);
        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    },

    //back 202
    *['accumulatedLottery/setting/update']({payload}){
      try{
        console.log('TODO: accumulatedLottery/settings/update is sent to server', payload);
        const endpoint = yield call(accumulatedLotteries);
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
          type:'accumulatedLottery/setting/update/succeeded',
          payload:res
        });
      }catch(err){
        console.warn('accumulatedLottery/setting/update', 'failed to call.');
        console.log(err);
        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    },

    *['accumulatedLottery/id/search']({payload}){
      try{
        console.log('TODO: accumulatedLottery/search is sent to server');
        const endpoint = yield call(accumulatedLotteries);
        const res = yield call(
          endpoint['get'],
          {
            id : payload.id,
          }
        );
        yield put({
          type: 'accumulatedLottery/list/succeeded',
          payload: {list : [res], total:1, updated:true},
        });

      }catch(err){
        console.warn('accumulatedLottery/search', 'failed to call.');
        yield put({
          type: 'accumulatedLottery/list/succeeded',
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
