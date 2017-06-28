import { admin } from '#/extApis';
import { put, call, apply, cancelled, select } from 'redux-saga/effects';
import { push } from 'redux-router';
import {AUTH, P_ID, SOCKET_SERVER, SOCKET_RETRY_MAX, BROADCAST_ROLE_HOST_STR, ROLE_ADMIN,
  BROADCAST_ROLE_ASSIST_STR} from '#/extConstants';
import { cleanAdminLoginToken } from '#/extModels/utils';
import { handleWsLoginResponse, handleProtocolStatus, openHandler, closeHandler, errorHandler,
  messageHandler,delay } from '#/extModels/wsutils';

/**
*** 使用
    在componentDidMount中，将协议，注册到该模块中就可以了，例如：
    const registerTable = {
      协议号         处理函数（成功，失败），最好使用::将this绑定;
      1 : {success : ::this.handleWsLoginResponse, fail : null},
      2 : {success : ::this.handleWsSpecificRoomResponse, fail : null},
      3 : {success : ::this.handleWsReceiveMsgResponse, fail : null},
      4 : {success : ::this.handleWsDelMsgResponse, fail : null},
      5 : {success : ::this.handleWsBanUserResponse, fail : null},
    }
    this.props.dispatch({type : 'wsconn/registerFuncs', payload :registerTable });
*/

export default {
  namespace : 'wsconn',
  state     : {
    conn : null, //ws connection 对象；
    registeredFuncs : { }, //协议号 ： func对象, 各个协议的response处理函数
    registeredOnCloseFuncs : {}, //key : func(e)
    onopen : null, //ws的onopen函数;
    onclose: null, //ws的onclose函数;

    onmessage : null, //ws的onmessage函数;统筹调用各个函数
    retries : 0,
    roomSelect : [],
  },
  reducers  : {
    //TODO: 添加不同的api状态的reducer
    ['wsconn/acceptNewConn/succeeded'] (state, {payload}) {
      //console.debug('zzzzzzzzzzzzzzzzz ',{...state, ...payload});
      return {...state, ...payload};
    },
    ['wsconn/registerFunc/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['wsconn/registerOnCloseFuncs/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['wsconn/reconnect/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['wsconn/reconnect/failed'] (state, {payload}) {
      //const payload = {retries : ++state.retries};
      return {...state, ...{retries : ++state.retries}};
    },
    ['wsconn/login/succeeded'] (state, {payload}) {
      //const payload = {retries : ++state.retries};
      //console.log('wsconn/login/succeeded');
      return {...state, ...payload, ...{retries : 0}};
    },
    ['wsconn/login/failed'] (state, {payload}) {
      //const payload = {retries : ++state.retries};
      return {...state, ...payload, ...{retries : ++state.retries}};
    },
  },

  effects : {
    *['wsconn/acceptNewConn']({payload}){
      console.debug('wsconn/acceptNewConn');
      const conn = payload.newConn;
      //console.debug('################ wsconn/connection is accpeted.', conn);
      if (conn.readyState == WebSocket.OPEN){
        //console.debug('wsconn/connection is opened and accpeted.#########################');
        yield put({type : 'wsconn/acceptNewConn/succeeded', payload : {conn : conn, retries : 0}});
        yield put({type : 'wsconn/registerGlobalFuncs'});
        yield put({type : 'wsconn/login'});
      }
    },

    //只允许call一次，如果连接断开，请使用reconnect
    *['wsconn/createNewConn']({payload}){
      console.debug('wsconn/createNewConn');
      const oldConn = yield select(state => state.wsconn.conn);
      if (!oldConn){
        const ws = new WebSocket(SOCKET_SERVER);
        ws.onopen = openHandler;
        ws.onclose = closeHandler;
        ws.onmessage = messageHandler;
        ws.onerror  = errorHandler;
      }
    },

    *['wsconn/closeConn']({payload}){
      console.debug('wsconn/closeConn');
      const conn = yield select(state => state.wsconn.conn);
      conn.close();
    },

    *['wsconn/registerFuncs']({payload}){
      const registeredFuncs = yield select(state => state.wsconn.registeredFuncs);
      for (let key in payload){
        if (registeredFuncs.hasOwnProperty(key)){
          console.warn(`${key} is registered, now replace with new handler`);
        }
        registeredFuncs[key] = payload[key];
      }


      //registeredFuncs[_id] = func;
      yield put({type : 'wsconn/registerFunc/succeeded', payload : {registeredFuncs : registeredFuncs}});
    },

    *['wsconn/registerOnCloseFuncs']({payload}){
      const registeredOnCloseFuncs = yield select(state => state.wsconn.registeredOnCloseFuncs);
      for (let key in payload){
        if (registeredOnCloseFuncs.hasOwnProperty(key)){
          console.warn(`${key} is registered, now replace with new handler`);
        }
        registeredOnCloseFuncs[key] = payload[key];
      }

      //registeredFuncs[_id] = func;
      yield put({type : 'wsconn/registerOnCloseFuncs/succeeded',
        payload : {registeredOnCloseFuncs : registeredOnCloseFuncs}});
    },

    *['wsconn/registerGlobalFuncs']({payload}){
      const conn = yield select(state => state.wsconn.conn);
      const registerTable = {
        1 : {success : handleWsLoginResponse, fail : null},
        7 : {success : cleanAdminLoginToken, fail : null},
      }
      yield put({type : 'wsconn/registerFuncs', payload :registerTable });
    },

    *['wsconn/reconnect']({payload}){
      console.debug('wsconn/reconnect');
      const oldConn = yield select(state => state.wsconn.conn);
      const retries = yield select(state => state.wsconn.retries);
      console.debug(retries);
      if (!oldConn || oldConn.readyState == WebSocket.CLOSED){
        if (retries >= SOCKET_RETRY_MAX){
          yield put({type:'notify/error', payload : `重连超过${SOCKET_RETRY_MAX}，停止重连。`});
          //TODO: 更具角色来具体操作；
          const yes = window.confirm("你没有权限登录实时监控，是否重新登陆?");
          if(yes){
            cleanAdminLoginToken();
          }

          //window.location = '/login';
        }
        else{
          const ws = new WebSocket(SOCKET_SERVER);
          if(!oldConn){
            ws.onopen = openHandler;
            ws.onclose = closeHandler;
            ws.onmessage = messageHandler;
            ws.onerror  = errorHandler;
          }
          else{
            ws.onopen = oldConn.onopen;
            ws.onclose = oldConn.onclose;
            ws.onmessage = oldConn.onmessage;
            ws.onerror = oldConn.onerror;
          }

          yield put({type : 'wsconn/reconnect/succeeded', payload : {conn : ws, retries : retries + 1}});
        }
      }
    },

    *['wsconn/login']({payload}){
      console.debug('DEBUG : wsconn/login');
      console.warn('DEBUG : ---------------------------------begin ', new Date());
      yield call(delay, 500);//等待pid载入，因为只有在self后再有pid
      const user = yield select(state => state.user);
      let p_id = null, _id = null;
      switch(user.getRole()){
        case  ROLE_ADMIN:
          p_id = user.p_id;
          _id = 1;
          break;
        case  BROADCAST_ROLE_HOST_STR:
        case  BROADCAST_ROLE_ASSIST_STR:
          //p_id = user.p_id;
          p_id = localStorage.getItem(P_ID);
          _id = 201;
          break;
        default:
          p_id = localStorage.getItem(P_ID);
          break;
      }

      if (!p_id){
        console.warn('DEBUG : --------------------------------end', new Date());
        yield put({type : 'wsconn/login'});
      }
      else{
        let payload = {
          _id : _id,
            _payload : {
            "p":  p_id, //pid
            "a":  user.getAccount(),   //account
            "t":  user.getToken(),     //token
          }
        }
        yield put({type : 'wsconn/send', payload:JSON.stringify(payload)});
      }
    },

    *['wsconn/send']({payload}){
      const conn = yield select(state => state.wsconn.conn);

      try{
        if (typeof payload == 'object') conn.send(JSON.stringify(payload));
        if (typeof payload == 'string') conn.send(payload);
      }catch(e){
        console.error('websocket conn has wrong');
      }
    },

    *['wsconn/execute']({payload}){
      const { _id, _payload } = payload;
      const _r = payload._r;
      let registeredFuncs = yield select(state => state.wsconn.registeredFuncs);
      const defaultFunc = (e)=>{console.warn('nothing', e);}

      let success = null, fail = null;

      if (!registeredFuncs[_id]){
        success = fail = defaultFunc;
      }
      else{
        success = registeredFuncs[_id].success ? registeredFuncs[_id].success : defaultFunc;
        fail = registeredFuncs[_id].fail ? registeredFuncs[_id].fail : defaultFunc;
      }

      const wsStatus = handleProtocolStatus(_id, _r);
      if (!wsStatus) {
        return; //不执行;
      }
      else{
        yield call(success, _payload);
      }
    },

    *['wsconn/onClose']({payload}){
      console.debug('wsconn/onClose');
      const { e } = payload;
      let registeredOnCloseFuncs = yield select(state => state.wsconn.registeredOnCloseFuncs);
      for(let key in registeredOnCloseFuncs){
        const func = registeredOnCloseFuncs[key];
        if(func) func(e);
      }
      console.debug('to reconnect');
      yield put({type:'wsconn/reconnect'});
    },
  }
}
