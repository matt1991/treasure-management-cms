import { admin, order } from '#/extApis';
import { put, call, apply, cancelled, select } from 'redux-saga/effects';
import { push } from 'redux-router';
import { AUTH } from '#/extConstants';

export default {
  namespace : 'banner',
  state     : {
    list:[],
    total:0,
    updated:true
  },
  reducers  : {
    //TODO: 添加不同的api状态的reducer
    ['order/list/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
  },

  effects : {
    //更改密码使用user中的changepwd， admin 和 superadmin都是
    //api id : 203
    *['order/list']({payload}){
      try{
        console.log('TODO: order/list is sent to server');
        const endpoint = yield call(order);
        const res = yield call(
          endpoint['get'],
          {
            id : '',
            query:{
              curPage:payload.curPage?payload.curPage:1,
              pageSize:payload.pageSize?payload.pageSize:10,
              ...payload
            }
          }
        );

        console.log(res);
        yield put({
          type:'order/list/succeeded',
          payload:{list:res.data, total:res.meta.total, updated:true}
        });

      }catch(err){
        console.warn('order/list', 'failed to call.');
        console.log(err);

        yield put({
          type: 'order/list/succeeded',
          payload: {list : [], total:0, updated:true},
        });
      }
    },

    *['order/id/search']({payload}){
      try{
        console.log('TODO: order/search is sent to server');
        const endpoint = yield call(order);
        const res = yield call(
          endpoint['get'],
          {
            id : payload.id,
          }
        );
        yield put({
          type: 'order/list/succeeded',
          payload: {list : [res], total:1, updated:true},
        });

      }catch(err){
        console.warn('order/search', 'failed to call.');
        yield put({
          type: 'order/list/succeeded',
          payload: {list : [], total:0, updated:true},
        });
      }
    },

  }
}
