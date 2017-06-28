import { login, suAdmin,userAdmin } from '#/extApis';
import { put, call, apply, cancelled, select } from 'redux-saga/effects';
import { push } from 'redux-router';
import { AUTH, ACCOUNT } from '#/extConstants';
 import { getMsgByStatus } from '#/extModels/utils';


export default {
  namespace: 'samanage',
  state: {
    accountList: [{
      // id:-1,
      // key: 1,
      // pid: "A1",
      // appId:"app-1",
      // company: "company",
      // status:-1,
      // adminAccount:"test",
      // email:"123@123.com",
      // tel:"123123123",
      // lastLoginTime:123123123123,
      // lastLoginIp:"172.20.2.2"
    },],
    deleted:{},
    createdCompany:{},
    currPid : -1,
    detailAccount:{},
  },
  reducers: {
    ['samanage/create/succeeded'] (state, {payload}) {
      let accountList = [];
      accountList.push(payload.createdAccount);
      state.accountList.map((account) => {
          accountList.push(account);
      });
      return {...state, ...{accountList:accountList}, ...payload};
    },
    // ['samanage/delete/succeeded'] (state, {payload}) {
    //   let accountList = [];
    //   state.accountList.map((account) => {
    //     if (!payload.deleted.includes(account.id)) {
    //       accountList.push(account);
    //     }
    //   });
    //   return {...state, ...{accountList:accountList}, ...payload};
    // },
    ['samanage/closeSelected/succeeded'] (state, {payload}) {
      let accountList = [];
      state.accountList.map((account) => {
        if (payload.closeSelected.includes(account.id)) {
          account.status = 0;
        }
        accountList.push(account);
      });
      return {...state, ...{accountList:accountList}, ...payload};
    },

    ['samanage/close/succeeded'] (state, {payload}) {
      let accountList = [];
      state.accountList.map((account) => {
        if (payload.closed == account.id) {
          account.status = 0;
        }
        accountList.push(account);
      });
      return {...state, ...{accountList:accountList}, ...payload};
    },
    ['samanage/open/succeeded'] (state, {payload}) {
      let accountList = [];
      state.accountList.map((account) => {
        if (payload.opened == account.id) {
          account.status = 1 ;
        }
        accountList.push(account);
      });
      return {...state, ...{accountList:accountList}, ...payload};
    },
    ['samanage/list/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['samanage/list/search/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['samanage/detailAccount/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['samanage/edit/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    }

  },
  effects: {
    *['samanage/create']({payload}){
      try{
        console.debug('TODO: samanage/create***** is sent to server');
        console.log(payload);
        const endpoint = yield call(userAdmin);
        let auth_ops = [];
        if (payload.canForbidUser) {
          auth_ops.push(1);
        }
        if (payload.canModifyBalance) {
            auth_ops.push(2);
        }
        console.log(auth_ops);
        const res = yield call(
          endpoint['post'],
          {
            id : 'create',
            body: {
              uid  : yield select(state => state.sauser.getAccount()),
              token  : yield select(state => state.sauser.getToken()),
              userName : payload.username,
              passwd  : payload.password,
              role:2,
              auth_ops:auth_ops,

            }
          }
        );


        console.log("create****",res);

        if (res.status < 0) throw getMsgByStatus(res.status,"sadmin");

        const toPass = {createdAccount : {
          id:res.entity.id,
          key:res.entity.id,
          userName:payload.username,
          auth_ops:auth_ops,
          is_enabled:1,
          canModifyBalance:auth_ops.indexOf(2)!==-1?true:false,
          canForbidUser:auth_ops.indexOf(1)!==-1?true:false,
        }};
        yield put({
          type: 'sadmin/manage/createAccount_modal/show/succeeded'
        })
        yield put({
          type: 'samanage/create/succeeded',
          payload: toPass,
        });

      }catch(err){
        console.log("create222",res);
        console.log("create222",err);
        console.warn('samanage/create/failed', 'failed to call.');
        yield put({
          type: 'notify/error',
          payload: err
        });
      }
    },

    *['samanage/edit']({payload}){
      try{
        console.debug('TODO: saroom/create is sent to server');
        const endpoint = yield call(userAdmin);
        let auth_ops = [];
        if (payload.canModifyBalance) {
            auth_ops.push(2);
        }
        if (payload.canForbidUser) {
          auth_ops.push(1);
        }
        const res = yield call(
          endpoint['post'],
          {
            id : 'modify',
            body: {
              uid  : yield select(state => state.sauser.getAccount()),
              token  : yield select(state => state.sauser.getToken()),
              userId:payload.id,
              userName : payload.username,
              passwd  : payload.password,
              auth_ops:auth_ops,
            }
          }
        );

        if (res.status < 0) throw getMsgByStatus(res.status,"sadmin");

        const toPass = {editedAccount : {
          id:res.id,
          key:res.id,
          userName:payload.username,
          auth_ops:auth_ops,
        }};
        yield put({
          type: 'sadmin/manage/editAccount_modal/show/succeeded'
        })
        yield put({
          type: 'samanage/edit/succeeded',
          payload: toPass,
        });

      }catch(err){
        console.warn('samanage/edit/failed', 'failed to call.');
        yield put({
          type: 'notify/error',
          payload: err
        });
      }
    },

    *['samanage/delete']({payload}){
      try{
        console.log('TODO: samanage/delete is sent to server', payload);
        const endpoint = yield call(suAdmin);
        for (let i in payload) {
          let body = {
            u  : yield select(state => state.sauser.getAccount()),
            t  : yield select(state => state.sauser.getToken()),
            c  :"d",
            id :payload[i]
          };
          const res = yield call(
            endpoint['post'],
            {
              id : 'updateCompany',
              body: body,
            }
          );

          if (res.status < 0) throw getMsgByStatus(res.status,"sadmin");
        }
        yield put({
          type: 'samanage/delete/succeeded',
          payload: {deleted:payload},
        });
      }catch(err){
        console.warn('samanage/delete', 'failed to call.');
        yield put({
          type: 'notify/error',
          payload: err
        });
      }
    },
    *['samanage/closeSelected']({payload}) {
      try{
        console.log('TODO: samanage/closeSelected is sent to server', payload);
        const endpoint = yield call(suAdmin);
        for (let i in payload) {
          let body = {
            u  : yield select(state => state.sauser.getAccount()),
            t  : yield select(state => state.sauser.getToken()),
            c  :"b",
            id :payload[i]
          };
          const res = yield call(
            endpoint['post'],
            {
              id : 'updateCompany',
              body: body,
            }
          );

          if (res.status < 0) throw getMsgByStatus(res.status,"sadmin");
        }
        yield put({
          type: 'samanage/closeSelected/succeeded',
          payload: {closeSelected:payload},
        });
      }catch(err){
        console.warn('samanage/closeSelected', 'failed to call.');
        yield put({
          type: 'notify/error',
          payload: err
        });
      }
    },
    *['samanage/open']({payload}) {
      try {
        console.log('TODO: samanage/open is sent to server', payload);
        const endpoint = yield call(suAdmin);
        let body = {
          u  : yield select(state => state.sauser.getAccount()),
          t  : yield select(state => state.sauser.getToken()),
          c :"r",
          id:payload.id
        };
        const res = yield call(
          endpoint['post'],
          {
            id:'updateCompany',
            body: body,
          }
        );
        if (res.status < 0) throw getMsgByStatus(res.status,"sadmin");

        yield put({
          type: 'samanage/open/succeeded',
          payload: {opened:payload.id}
        })
      } catch (err  ) {
        console.warn('samanage/open', 'failed to call.');
        yield put({
          type: 'notify/error',
          payload: err
        });

      }
    },
    *['samanage/close']({payload}) {
      try {
        console.log('TODO: samanage/close is sent to server', payload);
        const endpoint = yield call(suAdmin);
        let body = {
          u  : yield select(state => state.sauser.getAccount()),
          t  : yield select(state => state.sauser.getToken()),
          c :"b",
          id:payload.id
        };
        const res = yield call(
          endpoint['post'],
          {
            id:'updateCompany',
            body: body,
          }
        );
        if (res.status < 0) throw getMsgByStatus(res.status,"sadmin");

        yield put({
          type: 'samanage/close/succeeded',
          payload: {closed:payload.id}
        })
      } catch (err) {
        console.warn('samanage/close', 'failed to call.');
        yield put({
          type: 'notify/error',
          payload: err
        });
      }
    },
    *['samanage/list']({payload}) {
      try {
        console.log('TODO: samanage/list is sent to server', payload);
        const endpoint = yield call(userAdmin);
        let body = {
          uid  : yield select(state => state.sauser.getAccount()),
          token  : yield select(state => state.sauser.getToken()),
          userName:undefined,
          size:1000,
          page:0
        };
        const res = yield call(
          endpoint['post'],
          {
            id:'list',
            body: body,
          }
        );
        if (res.status < 0) throw getMsgByStatus(res.status,"sadmin");
        let result = [];
        for (let i in res.entities) {
          let account = {
            id:res.entities[i].id,
            key: res.entities[i].id,
            email:res.entities[i].email,
            userName:res.entities[i].username,
            role:res.entities[i].role,
            canModifyBalance:res.entities[i].auth_ops.indexOf(2)!==-1?true:false,
            canForbidUser:res.entities[i].auth_ops.indexOf(1)!==-1?true:false,
            auth_ops:res.entities[i].auth_ops,
            is_enabled:res.entities[i].is_enabled,
          }
          result.push(account);
        }
        yield put({
          type: 'samanage/list/succeeded',
          payload: {accountList:result}
        })
      } catch (err) {
        console.warn('samanage/list/succeeded', 'failed to call.');
        yield put({
          type: 'notify/error',
          payload: err
        });
      }
    },
    *['samanage/list/search']({payload}) {
      try {
        console.log('TODO: samanage/list is sent to server', payload);
        const endpoint = yield call(userAdmin);
        let body = {
          uid  : yield select(state => state.sauser.getAccount()),
          token  : yield select(state => state.sauser.getToken()),
          userName:undefined,
          size:1000,
          page:0
        };
        const res = yield call(
          endpoint['post'],
          {
            id:'list',
            body: body,
          }
        );
        if (res.status < 0) throw getMsgByStatus(res.status,"sadmin");
        let result = [];
        for (let i in res.entities) {
          if (!res.entities[i].username.includes(payload.username)) {
            continue;
          }
          let account = {
            id:res.entities[i].id,
            key: res.entities[i].id,
            email:res.entities[i].email,
            username:res.entities[i].username,
            role:res.entities[i].role,
            canModifyBalance:res.entities[i].auth_ops.indexOf(2)!==-1?true:false,
            canForbidUser:res.entities[i].auth_ops.indexOf(1)!==-1?true:false,
            auth_ops:res.entities[i].auth_ops
          }
          result.push(account);
        }
        yield put({
          type: 'samanage/list/succeeded',
          payload: {accountList:result}
        })
      } catch (err) {
        console.warn('samanage/list/search/succeeded', 'failed to call.');
        yield put({
          type: 'notify/error',
          payload: err
        });
      }
    },
    *['samanage/detailAccount']({payload}) {
      try {
        console.log('TODO: samanage/detailAccount is sent to server', payload);
        const endpoint = yield call(suAdmin);
        let body = {
          u  : yield select(state => state.sauser.getAccount()),
          t  : yield select(state => state.sauser.getToken()),
          id :payload.id
        };
        const res = yield call(
          endpoint['post'],
          {
            id: 'applyList',
            body:body
          }
        );
        if (res.status < 0) throw getMsgByStatus(res.status,"sadmin");

        let account = {
          id:res.list.id,
          key: res.list.id,
          pid: res.list.p_id,
          appId:res.list.app_id,
          company: res.list.company_name,
          desKey: res.list.desKey,
          status:res.list.status,
          adminAccount:res.list.username,
          // email:res.list.email,
          // tel:res.list.tel,
          lastLoginTime:res.list.last_login_time,
          lastLoginIp:res.list.last_login_ip,
        }


        yield put({
          type: 'samanage/detailAccount/succeeded',
          payload:{detailAccount: account}
        })

      } catch (err) {
        console.warn('samanage/list/search/succeeded', 'failed to call.');
        yield put({
          type: 'notify/error',
          payload: err
        });

      }
    },
    *['samanage/edit']({payload}) {
      try {
        const endpoint = yield call(suAdmin);
        let body = {
          u  : yield select(state => state.sauser.getAccount()),
          t  : yield select(state => state.sauser.getToken()),
          c :"u",
          id :payload.id,
          n :payload.adminAccount,
          // e:payload.email,
          // tel:payload.tel
        };
        if (payload.pass) {
          body.p = payload.pass;
        }
        const res = yield call(
          endpoint['post'],
          {
            id: 'updateCompany',
            body:body
          }
        );
        if (res.status < 0) throw getMsgByStatus(res.status,"sadmin");

        yield put({
          type: 'samanage/edit/succeeded',
          payload:{detailAccount: payload}
        })

        yield put(push(`/sadmin/manage/info/${payload.id}`));

      } catch (err) {

      }
    },

  }
}
