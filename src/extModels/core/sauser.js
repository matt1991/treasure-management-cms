import { login, admin, rootapi, userAdmin} from '#/extApis';
import { put, call, apply, cancelled, select } from 'redux-saga/effects';
import { push } from 'redux-router';
import { SU_AUTH, SU_ACCOUNT } from '#/extConstants';
import { getMsgByStatus } from '#/extModels/utils';

export default {
  namespace: 'sauser',
  state: {
    id: -1,//uid
    account : '',
    app_id  : '',
    company_name : '',
    email: '',//账户email
    status : '', //账户状态
    token : '',
    getToken: ()=>(localStorage.getItem(SU_AUTH)),//临时方法
    getAccount : ()=>(localStorage.getItem(SU_ACCOUNT)),//临时方法
    //name: '', //帐户名
    //role: '',//角色
  },
  reducers: {
    ['sauser/login/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['sauser/self/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['sauser/login/failed'] () {
      return {
        name: '',
        email: '',
        role: '',
        id: '',
        token: '',
      }
    },
  },
  effects: {
    * ['sauser/changepwd'] ({payload}) {
      try {

        const endpoint = yield call(admin);
        console.log('sauser/changepwd is sending');
        const res = yield call(
          endpoint['post'],
          {
            id : 'changePassword',
            body: {
              op : payload.password,
              np : payload.new_password,
              u  : yield select(state => state.sauser.getAccount()),
              t  : yield select(state => state.sauser.getToken())
            }
          }
        );
        // if (res.status == -1) throw "请输入正确的旧密码";
        // if (res.status < 0) throw res.msg;
        if (res.status < 0) throw getMsgByStatus(res.status,"sadmin");
        yield put({
          type: 'notify/info',
          payload: '密码修改成功'
        });
        payload.resolve && payload.resolve();
      } catch(err) {
        payload.reject && payload.reject();
        console.log('sauser/changepwd responses error.');
        yield put({
          type: 'notify/error',
          payload: err
        });
      }
    },
    //网络API user  /login 入口
    *['sauser/login'] ({payload}) {
      try {
        const endpoint = yield call(login);
        const res = yield call(endpoint['post'], {body: {
          login : payload.account,
          passwd : payload.password,
        }});
        yield put({
          type: 'sauser/login/succeeded',
          payload: {
            token:res.token,

            account:payload.account,
            getToken: ()=>(localStorage.getItem(SU_AUTH)),
            getAccount : ()=>(localStorage.getItem(SU_ACCOUNT)),
          }
        });
        if (res.status < 0) throw getMsgByStatus(res.status,"sadmin");
        yield apply(localStorage, localStorage.setItem, [SU_AUTH, res.token]);
        yield apply(localStorage, localStorage.setItem, [SU_ACCOUNT, payload.account]);
        const router = yield select(state => state.router);
        let nextPathname = '/sadmin/account';
        // back to last path
        if (router.location.state && router.location.state.nextPathname)
          nextPathname = router.location.state.nextPathname;
        yield put(push(nextPathname));
      } catch(err) {
        yield put({
          type: 'sauser/login/failed',
          payload: err
        });
        yield put({
          type: 'notify/error',
          payload: err
        });
      } finally {
        if(yield cancelled()) {
          yield put({
            type: 'sauser/login/cancelled',
          })
        }
      }
    },
    *['sauser/self'] ({payload}) {
      try {
        yield put({
          type: 'sauser/self/succeeded',
          payload: {account:localStorage.getItem(SU_ACCOUNT), token:localStorage.getItem(SU_AUTH)}
        });
      } catch(err) {
        yield put({
          type: 'sauser/self/failed',
          payload: err
        });
        yield put({
          type: 'notify/error',
          payload: err
        });
      }
    }

  }
}
