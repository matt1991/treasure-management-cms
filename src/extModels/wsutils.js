import {AUTH, ACCOUNT, ROLE} from '#/extConstants';
import { put, call, apply, cancelled, select } from 'redux-saga/effects';
import { store } from '#/app';
import {logoutAssistHost} from '#/extRoutes/utils';

export function openHandler(e){
  console.debug('connection is opend.');
  //TIPS: 如果要在这里发送，请使用this.send();
  console.debug('this in openHandler = ', this)
  //store.dispatch({type : 'wsconn/login'});
  store.dispatch({type:'wsconn/acceptNewConn', payload : {newConn : this}})
}

export function closeHandler(e){
  store.dispatch({type: 'notify/info',payload:`WebSocket 断开连接` });
  console.debug('connection is closed.');
  store.dispatch({type: 'wsconn/onClose', payload:{e : e}});
  //store.dispatch({type: 'wsconn/reconnect'});
}

export function errorHandler(e){
  console.debug('onError', e);
}

export function messageHandler(res){
  const jsonData = JSON.parse(res.data);
  store.dispatch({type : 'wsconn/execute', payload : jsonData});
}

export function handleProtocolStatus(id, r){
  if (r < 0){
    switch(r){
      case -2:
        store.dispatch({type: 'notify/error',payload:`WebSocket: op_id = ${id} 所传参数不正确` });
        break;
      case -4:
        handleWsLoginResponseError();
        if(id == 201){
          console.debug('####################');
          logoutAssistHost();
          window.location = '/liveuserlogin';
        }
        break;
      default:
        store.dispatch({type: 'notify/error',payload:`WebSocket: op_id = ${id} 非法操作` });
        break;
    };
    return false;
  }
  return true;
}

export function handleWsLoginResponse(payload){
  //console.debug('afafafafffffffff', payload, {roomSelect : payload.l ? payload.l : []});
  store.dispatch({type: 'wsconn/login/succeeded', payload : {roomSelect : payload.l ? payload.l : []}})
}

export function handleWsLoginResponseError(){
  store.dispatch({type: 'notify/error', payload:'非法登陆Websocket' });
  store.dispatch({type: 'wsconn/login/failed'})
  //TODO:其他清理操作，断开websocket；
  //this.ws.close();
}

export function handlePayloadStatus(s){
  switch (s){
    case -2:
      store.dispatch({type: 'notify/error',payload:'参数不正确' });
      return false;
    case -3:
      store.dispatch({type: 'notify/error',payload:'帐号密码错误' });
      return false;
    case -4:
      store.dispatch({type: 'notify/error',payload:'非super admin权限' });
      return false;
  }

  return true;
}















export function delay(ms, result = ms) {
  return new Promise(resolve => {
    console.debug(new Date());
    setTimeout(() => {console.debug(new Date()); resolve(result);}, ms)
  })
}

export function wait(ms, result) {
  return call(delay, ms, result)
}
