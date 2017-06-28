import { admin } from '#/extApis';
import { put, call, apply, cancelled, select } from 'redux-saga/effects';
import { push } from 'redux-router';
import { AUTH } from '#/extConstants';
import { cleanAdminLoginToken, getMsgByStatus } from '#/extModels/utils';

export default {
  namespace : 'admin',
  state     : {
    newRoom : {
      // name  : 'xxx',
      // desc  : 'XXXX',
    },
    roomList: [
    //  {
      // id          : -1,
      // p_id        : 'unknown',
      // lag_room_id : 'unknown',
      // lag_login_id: 'unknown',
      // lag_login_password : 'unkonwn',
      // title       : 'unknown',
      // description : 'unknown',
      // status      : '2'
  //  },
  ],
    detailRoom : {
      //字段同上
    },

    msgHistory : [
    //   {
    //         "msgid" : 123123131313,
    //         "uid":10044,//user id
    //         "un":"张三",   //user name
    //         "rid":"9001",   //room id
    //         "t": 1748382726,  //time in millionsecond
    //         "c":"美女好",    //Content
    // }
    // {
    //   "rid":9001,
    //   "msgid":"123123123123", //'list'+uid+Date.now())
    //   "uid":123123123,
    //   "un":"张三",
    //   "rid":9001,
    //   "avr":"www.baidu.com/test.png" ,//头像
    //   "t":1723123123123, //time in millionsecond
    //   "c":"http://www.desktopwallpaperhd.net/wallpapers/10/6/bawoopeng-star-cartoon-bawoop-tupian-109430.jpg",
    //   "r":1, //1:会员;3:游客;11:主播;12:助理
    //   "tp":3, //1:普通文本消息  3:图片 4: 系统消息，
    //   "med":[{
    //     "un":"dasfasdfsadf",
    //     "uid":"asdfasdf"
    //     }],
    //   "om":{    //如果是回复 才有这条
    //         "uid":3,//询问者ID,
    //         "nickname":'sdfsdf',//询问者昵称,
    //         "tp":1,
    //         "c":"嘻嘻嘻嘻"
    //   }
    // }
  ],
  shareLink : '',
  },
  reducers  : {
    //TODO: 添加不同的api状态的reducer
    ['admin/createroom/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },

    ['admin/createMUser/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },

    ['admin/detailroom/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['admin/editroom/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['admin/listroom/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['admin/deleteroom/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['admin/changeroomstatus/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['admin/receivemsg/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['admin/receivemsg100/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['admin/deletemsgfromlist/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['admin/updatemsgstatusinlist/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },
    ['admin/clearMsgHistory/succeeded'] (state, {payload}) {
      return {...state, ...payload};
    },


  },

  effects : {
    //更改密码使用user中的changepwd， admin 和 superadmin都是
    //api id : 203
    *['admin/createroom']({payload}){
      try{
        console.log('TODO: admin/createroom is sent to server', payload, payload.imageUrl || "unknown");
        const endpoint = yield call(admin);
        const res = yield call(
          endpoint['post'],
          {
            id : 'createRoom',
            body: {
              u  : yield select(state => state.user.getAccount()),
              t  : yield select(state => state.user.getToken()),
              rt       : payload.name,
              img      : payload.imageUrl || "unknown",
              imgs     : payload.thumbUrl || 'unknown',
              d        : payload.desc || "unknown",//展开field
            }
          }
        );
        if (res.status == -1) {
          res.list = [];
        }
        // else if(res.status == -4) {
        //   cleanAdminLoginToken();
        //   yield put(push('/login'));
        // }
        if(res.status < 0) {
          throw getMsgByStatus(res.status);
        }

        yield put(push({
          pathname: '/room/list'
        }));
      }catch(err){
        console.warn('admin/createroom', 'failed to call.');
        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    },

    //api id : 204
    *['admin/detailroom']({payload}){
      try{
        console.log('TODO: admin/detailroom is sent to server');
        const endpoint = yield call(admin);
        const res = yield call(
          endpoint['post'],
          {
            id : 'listRoom',
            body: {
              u  : yield select(state => state.user.getAccount()),
              t  : yield select(state => state.user.getToken()),
              id : payload.roomId,
            }
          }
        );
        if (res.status == -1) {
          res.list = [];
        }
        if(res.status < 0) {
          throw getMsgByStatus(res.status);
        }
        yield put({
          type: 'admin/detailroom/succeeded',
          payload: {detailRoom : res.list},
        });

      }catch(err){
        console.warn('admin/detailroom', 'failed to call.');
        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    },

    //api id : 205
    *['admin/editroom']({payload}){
      try{
        console.log('TODO: admin/editroom is sent to server');
        const endpoint = yield call(admin);
        const res = yield call(
          endpoint['post'],
          {
            id : 'updateRoom',
            body: {
              u  : yield select(state => state.user.getAccount()),
              t  : yield select(state => state.user.getToken()),
              rt : payload.title,
              img: payload.imageUrl,
              imgs : payload.thumbUrl,
              d  : payload.desc,
              id : payload.id,
            }
          }
        );
        if (res.status == -1) {
          res.list = [];
        }
        // else if(res.status == -4) {
        //   cleanAdminLoginToken();
        //   yield put(push('/login'));
        // }
        if(res.status < 0) {
          throw getMsgByStatus(res.status);
        }
        yield put(push(`/room/info/${payload.id}`));
      }catch(err){
        console.warn('admin/editroom', 'failed to call.');

        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    },

    //api id : 确实 list
    *['admin/listroom']({payload}){
      try{
        //console.log('TODO: admin/listroom is sent to server');
        const endpoint = yield call(admin);
        const res = yield call(
          endpoint['post'],
          {
            id : 'listRoom',
            body: {
              u  : yield select(state => state.user.getAccount()),
              t  : yield select(state => state.user.getToken()),
              p        : 1, //分页页数 -1 希望是全部
            }
          }
        );
        if (res.status == -1) {
          res.list = [];
        }
        // else if (res.status == -4) {
        //   cleanAdminLoginToken();
        //   yield put(push('/login'));
        // }
        if(res.status < 0) {
          throw getMsgByStatus(res.status);
        }
        yield put({
          type: 'admin/listroom/succeeded',
          payload: {roomList : res.list.length > 0 ? res.list : []},
        });
      }catch(err){
        console.warn('admin/listroom', 'failed to call.');
        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    },

    *['admin/changeroomstatus']({payload}){
      try{
        console.log('TODO: admin/changeroomstatus is sent to server');
        const endpoint = yield call(admin);
        const res = yield call(
          endpoint['post'],
          {
            id : 'changeRoomStatus',
            body: {
              u  : yield select(state => state.user.getAccount()),
              t  : yield select(state => state.user.getToken()),
              id : payload.roomId,
              c  : payload.c,
            }
          }
        );
        if (res.status == -1) {
          res.list = [];
        }
        // else if(res.status == -4) {
        //   cleanAdminLoginToken();
        //   yield put(push('/login'));
        // }
        if(res.status < 0) {
          throw getMsgByStatus(res.status);
        }
        const roomList = yield select(state => state.admin.roomList);
        roomList.forEach((item) =>{
          if (item.id == payload.roomId){
            item.status = payload.c == 9 ? 1 : 0;
          }
        });
        const toPass = {roomList : roomList};
        yield put({
          type: 'admin/changeroomstatus/succeeded',
          payload: toPass,
        });
      }catch(err){
        console.warn('admin/changeRoomStatus', 'failed to call.');
        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    },

    *['admin/receivemsg']({payload}){
      const msgHistory = yield select(state => state.admin.msgHistory);
      msgHistory.unshift(payload);
      const toPass = {msgHistory : msgHistory};
      yield put({
        type: 'admin/receivemsg/succeeded',
        payload: toPass,
      });
    },

    *['admin/receivemsg100']({payload}){
      console.debug('admin/receivemsg100 payload', payload);
      const msgHistory = yield select(state => state.admin.msgHistory);
      msgHistory.unshift(payload);
      const toPass = {msgHistory : msgHistory};
      yield put({
        type: 'admin/receivemsg100/succeeded',
        payload: toPass,
      });
    },

    *['admin/deletemsgfromlist']({payload}){
      const {msgId} = payload;
      const msgHistory = yield select(state => state.admin.msgHistory);
      let toRemove = -1;
      for(var i in msgHistory){
        if(msgHistory[i].msgid == msgId){
          toRemove = i;
          break;
        }
      }
      //console.debug('########### to remove', toRemove);
      toRemove != -1 && msgHistory.splice(toRemove, 1);
      const toPass = {msgHistory : msgHistory};

      yield put({
        type: 'admin/deletemsgfromlist/succeeded',
        payload: toPass,
      });
    },

    *['admin/updatemsgstatusinlist']({payload}){
      console.debug('admin/updatemsgstatusinlist', payload);
      const {msgId} = payload;
      const msgHistory = yield select(state => state.admin.msgHistory);
      let index = -1;
      for(var i in msgHistory){
        if(msgHistory[i].msgid == msgId){
          index = i;
          break;
        }
      }
      console.debug(index, payload);
      if (index != -1 ) {
        msgHistory[index] = {...msgHistory[index], status : payload.status}
      };
      const toPass = {msgHistory : msgHistory};

      yield put({
        type: 'admin/updatemsgstatusinlist/succeeded',
        payload: toPass,
      });
    },

    *['admin/createMUser']({payload}){
      try{
        console.log('TODO: admin/createMUser is sent to server');
        const endpoint = yield call(admin);
        const res = yield call(
          endpoint['post'],
          {
            id : 'createMuser',
            body: {
              u  : yield select(state => state.user.getAccount()),
              t  : yield select(state => state.user.getToken()),
              n  : payload.loginName,
              time : parseInt(payload.expireTime/1000),
            }
          }
        );
        // if (res.status == -4){
        //   cleanAdminLoginToken();
        //   yield put(push('/login'));
        // }
        if(res.status < 0) {
          throw getMsgByStatus(res.status);
        }
        const domain = window.location.protocol+'//'+window.location.hostname
          +(window.location.port ? ':'+window.location.port: '');
        const p_id = res.p_id ? res.p_id : 'unknown';
        console.log('sdffffffffffffffff', p_id);
        const toPass = {shareLink : `${domain}/guestmonitor/${p_id}/${res.token}`};
        yield put({
          type: 'admin/createMUser/succeeded',
          payload: toPass,
        });
        yield put({type:'notify/info', payload : '更多监控开启成功，于管理更多监控列表查看'})

      }catch(err){
        console.warn('admin/createMUser', 'failed to call.');
        // yield put({
        //   type: 'notify/error',
        //   payload: err
        // });
      }
    },

    *['admin/clearMsgHistory']({payload}){
      console.log('TODO: admin/clearMsgHistory is sent to server', payload);
      const msgHistory = yield select((state) => (state.admin.msgHistory));
      const location = payload.location;
      const size = payload.size;
      if(size == -1) {
        msgHistory.splice(0, msgHistory.length);
      }
      else{
        msgHistory.splice(location, size);
      }

      yield put({type : 'admin/clearMsgHistory/succeeded', payload : {msgHistory : msgHistory}});
    },

    *['admin/changeRoomTopStatus']({payload}){
      try{
        console.log('TODO: admin/changeRoomTopStatus is sent to server payload', payload);
        const endpoint = yield call(admin);
        const res = yield call(
          endpoint['post'],
          {
            id : 'changeRoomTopStatus',
            body: {
              u  : yield select(state => state.user.getAccount()),
              t  : yield select(state => state.user.getToken()),
              base_room_id  : payload.id,
              s  : payload.is_top ? 0 : 1,
            }
          }
        );
        if(res.status < 0) {
          throw getMsgByStatus(res.status);
        }
        yield put({type: 'admin/listroom'});
      }catch(err){
        console.warn('admin/changeRoomTopStatus', 'failed to call.');
        yield put({
          type: 'notify/error',
          payload: '房间置顶失败'
        });
      }
    },
  }
}
