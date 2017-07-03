import { admin, banner } from '#/extApis';
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
    ['banner/list/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['banner/add/succeeded'] (state, {payload}) {
      let list = state.list;
      list.unshift(payload);
      return {...state, ...{list}};
    },
    ['banner/update/succeeded'] (state, {payload}) {
      let list = state.list;
      list.map((banner) =>{
        if (banner.id == payload.id) {
          return payload;
        } else {
          return banner;
        }
      })
      return {...state, ...{list}};
    },
    ['banner/delete/succeeded'] (state, {payload}) {
      let list = state.list;
      let i = -1;
      list.forEach((item, index)=>{
        if (item.id == payload.id){
          i = index;
        }
      });
      if (i !== -1) {
        list.splice(i, 1);
      }
      return {...state, ...{list}};
    }
  },

  effects : {
    //更改密码使用user中的changepwd， admin 和 superadmin都是
    //api id : 203
    *['banner/list']({payload}){
      try{
        console.log('TODO: order/list is sent to server');
        const endpoint = yield call(banner);
        const res = yield call(
          endpoint['get'],
          {
            id : '',
            query:{
            //  curPage:payload.curPage?payload.curPage:1,
          //    pageSize:payload.pageSize?payload.pageSize:10,
              ...payload
            }
          }
        );

        console.log(res);
        yield put({
          type:'banner/list/succeeded',
          payload:{list:res.data, total:res.data.length, updated:true}
        });

      }catch(err){
        console.warn('order/list', 'failed to call.');
        console.log(err);

        yield put({
          type: 'banner/list/succeeded',
          payload: {list : [], total:0, updated:true},
        });
      }
    },



    *['banner/add']({payload}){
      try{
        console.log('TODO: banner/settings/add is sent to server');
        const endpoint = yield call(banner);
        const res = yield call(
          endpoint['post'],
          {
            id : '/add',
            body: {
              uid  : yield select(state => state.user.getAccount()),
              token  : yield select(state => state.user.getToken()),
              ...payload
            }
          }
        );

        yield put({
          type:'banner/add/succeeded',
          payload:res
        });
      }catch(err){
        console.warn('banner/add', 'failed to call.');
        console.log(err);
        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    },

    *['banner/update']({payload}){
      try{
        console.log('TODO: banner/settings/add is sent to server');
        const endpoint = yield call(banner);
        const res = yield call(
          endpoint['post'],
          {
            id : '/update',
            body: {
              uid  : yield select(state => state.user.getAccount()),
              token  : yield select(state => state.user.getToken()),
              ...payload
            }
          }
        );

        yield put({
          type:'banner/add/succeeded',
          payload:res
        });
      }catch(err){
        console.warn('banner/add', 'failed to call.');
        console.log(err);
        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    },

    *['banner/delete']({payload}){
      try{
        console.log('TODO: banner/delete is sent to server');
        const endpoint = yield call(banner);
        const res = yield call(
          endpoint['post'],
          {
            id : '/delete',
            body: {
              uid  : yield select(state => state.user.getAccount()),
              token  : yield select(state => state.user.getToken()),
              ...payload
            }
          }
        );

        yield put({
          type:'banner/delete/succeeded',
          payload:res
        });
      }catch(err){
        console.warn('banner/delete', 'failed to call.');
        console.log(err);
        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    },




    *['banner/id/search']({payload}){
      try{
        console.log('TODO: order/search is sent to server');
        const endpoint = yield call(banner);
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
