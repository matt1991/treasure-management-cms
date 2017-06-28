import { login, admin,member,rootapi,agent} from '#/extApis';
import { put, call, apply, cancelled, select } from 'redux-saga/effects';
import { push } from 'redux-router';
import { AUTH, ACCOUNT, ROLE, P_ID, FILE_PIC_SERVER_URL ,UID} from '#/extConstants';
import { cleanAdminLoginToken, getMsgByStatus, getRoleStr, get_param_p } from '#/extModels/utils';

export default {
  namespace: 'user',
  state: {
    id: -1,//uid
    account : '',
    app_id  : 'unknown',
    company_name : 'unknown',
    email: 'unknown',//账户email
    status : 'unknown', //账户状态
    token : '',
    role: 'unknown',//角色, 'admin', 'sadmin', 'public', 12 = 主播， 这里设计有点乱
    roleStr : '', //用于将主播等的int role类型转换host， 用于与ws通讯；
    roleMap : {}, //角色metadata
    uid:'',
    getToken: ()=>(localStorage.getItem(AUTH)),//临时方法
    getAccount : ()=>(localStorage.getItem(ACCOUNT)),//临时方法
    getRole : ()=>(localStorage.getItem(ROLE) || 'PUBLIC'),//临时方法
    getRoleStr : ()=>(getRoleStr(localStorage.getItem(ROLE) || 'PUBLIC')),
    getUid: ()=>(localStorage.getItem(UID)),
    //name: '', //帐户名

  },
  reducers: {
    ['user/login/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['user/self/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['user/checkIn/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['user/login/failed'] () {
      return {
        name: '',
        email: '',
        role: '',
        id: '',
        token: '',
        getToken: ()=>(localStorage.getItem(AUTH)),//临时方法
        getAccount : ()=>(localStorage.getItem(ACCOUNT)),//临时方法
        getRole : ()=>(localStorage.getItem(ROLE) || 'PUBLIC'),//临时方法
        getUid: () => (localStorage.getItem(UID)),
      }
    },
  },
  effects: {
    * ['user/changepwd'] ({payload}) {
      try {
        const endpoint = yield call(admin);
        console.log('user/changepwd is sending');
        const res = yield call(
          endpoint['post'],
          {
            id : 'changePassword',
            body: {
              op : payload.password,
              np : payload.new_password,
              u  : yield select(state => state.user.getAccount()),
              t  : yield select(state => state.user.getToken())
            }
          }
        );
        if (res.status == -1) throw "请输入正确的旧密码";
        if(res.status < 0) {
          throw getMsgByStatus(res.status);
        }
        yield put({
          type: 'notify/info',
          payload: '密码修改成功'
        });
        payload.resolve && payload.resolve();
      } catch(err) {
        payload.reject && payload.reject();
        console.log('user/changepwd responses error.');
        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    },
    //网络API user  /login 入口
    *['user/login'] ({payload}) {
      try {
        const endpoint = yield call(login);
        // const res = yield call(endpoint['post'], {body: {
        //   login : payload.account,
        //   passwd : payload.password,
        // //  t : 2
        // }});

        const res = {
          status:1,
          token:"test_token",
          entity:{
            email:"mattmiao@yeah.net",
            uid:"1",
          }
        }

        console.log("************ login");

        if(res.status < 0) {
          throw getMsgByStatus(res.status);
        }
        yield put({
          type: 'user/login/succeeded',
          payload: {
            token: res.token,
            email:res.entity.email,
            account:payload.account,
            uid:res.entity.uid,
            role : 'admin',
            getToken: ()=>(localStorage.getItem(AUTH)),
            getAccount : ()=>(localStorage.getItem(ACCOUNT)),
            getRole : ()=>(localStorage.getItem(ROLE) || 'PUBLIC'),//临时方法
          }
        });
        yield apply(localStorage, localStorage.setItem, [AUTH, res.token]);
        yield apply(localStorage, localStorage.setItem, [ACCOUNT, payload.account]);
        yield apply(localStorage, localStorage.setItem, [ROLE, 'admin']);
        yield apply(localStorage, localStorage.setItem, [UID, res.entity.uid]);

        //获取自身信息
        yield put({type :'user/self', payload :{
          account : payload.account,
          token   : res.token,
          role:res.entity.role,
          username:res.entity.username,
        }});

        const router = yield select(state => state.router);
        let nextPathname = '/account';
        // back to last path
        if (router.location.state && router.location.state.nextPathname)
          nextPathname = router.location.state.nextPathname;
        yield put(push(nextPathname));
      } catch(err) {
        yield put({
          type: 'user/login/failed',
          payload: err
        });
        yield put({
          type: 'notify/error',
          payload: err
        });
      } finally {
        if(yield cancelled()) {
          yield put({
            type: 'user/login/cancelled',
          })
        }
      }
    },




    *['user/self'] ({payload}) {
      return;
      try {
        const endpoint = yield call(rootapi);
        const res = yield call(endpoint['post'], {id : 'self', body: {
        //  uid : payload.account,
          token : payload.token,
    //      p: get_param_p(yield select(state => state.user.getRole())),
        }});

        if(res.status < 0) {
          throw getMsgByStatus(res.status);
        }
        yield put({
          type: 'user/self/succeeded',
          payload: {
            account : res.entity.username,
            role:res.entity.role,
            username:res.entity.username,
            auth_ops:res.entity.auth_ops,
            canModifyBalance:res.entity.auth_ops.indexOf(2)!==-1?true:false,
            canForbidUser:res.entity.auth_ops.indexOf(1)!==-1?true:false,
          }
        });
        //console.log(res);
      } catch(err) {
        yield put({
          type: 'user/self/failed',
          payload: err
        });
        yield put({
          type: 'notify/error',
          payload: err
        });
      }
    },

    *['user/agent/self'] ({payload}) {
      try {
        const endpoint = yield call(agent);
        const res = yield call(endpoint['post'], {id : 'own/detail', body: {
          token : payload.token,
        }});

        if(res.status < 0) {
          throw getMsgByStatus(res.status);
        }
        yield put({
          type: 'user/agent/self/succeeded',
          payload: {
            account : res.username,
            role:'agent',
            link:res.link,
            email:res.email,
            phone:res.phone,
            group:res.group,
          }
        });
      } catch(err) {
        yield put({
          type: 'user/agent/self/failed',
          payload: err
        });
        yield put({
          type: 'notify/error',
          payload: err
        });
      }
    },
  }
}
