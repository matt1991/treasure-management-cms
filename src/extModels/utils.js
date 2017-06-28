import {AUTH, ACCOUNT, ROLE, ROLE_ADMIN, ROLE_SADMIN,
  BROADCAST_ROLE_HOST_STR, BROADCAST_ROLE_ASSIST_STR} from '#/extConstants';
import { store } from '#/app';
import { logoutSuadmin, logoutAssistHost } from '#/extRoutes/utils';
import {getLogoutRedirectPathByRole} from '#/utils';
/*
 * I am a supervisor to control available operations in each pages
 * You can call me `supervisor`!
 */

// filter enchance fn for taskmaster below
// specifically for those default field is empty
// which means each can access it without limited
function filterEnhanced(targetKey, current) {
  return n => (n[targetKey] && ~n[targetKey].indexOf(current)) || !n[targetKey];
}

export function handlersFilter({ router, user }) {
  const { routes } = router;
  const { role } = user;

  let initialConfig = {};

  routes.reduceRight((prev, current) => {
    if (!prev.status && current.status) prev.status = current.status;
    if (!prev.box && current.box) prev.box = current.box;
    return prev;
  }, initialConfig);

}

export function queryDropAll(query = {}) {
  Object.keys(query).map(n => {
    if (query[n] === 'all') delete query[n];
  });
  return query;
}

export function cleanAdminLoginToken(toRedirect = true){
  localStorage.removeItem(AUTH);
  localStorage.removeItem(ACCOUNT);
  localStorage.removeItem(ROLE);
  toRedirect ? window.location = '/login' : null;
}

export function getMsgByStatus(code, role = 'admin'){
  code = parseInt(code);
  console.debug(code, role);
  if (code == -2 || code == -4 || code == -5){
    let path = '/login';
  //  role = localStorage.getItem(ROLE);
    path = getLogoutRedirectPathByRole(role);
    window.setTimeout(() => {
      cleanAdminLoginToken(false);
      logoutSuadmin();
      logoutAssistHost();
      window.location = path;
    }, 1500);
  }

  if (code)
  switch(code){
    case -1:
      return '用户(组)无登陆权限';//'对不起，您没有权限';
    case -2:
      return '请登录';
    case -3:
      return '用户权限有误';
    case -4:
      return '请求参数错误';
    case -5:
      return '帐号或密码错误';
    case -6:
      return '数据库出错';
    case -7:
      return '用户不存在或用户账号密码错误';
    case -8:
      return '已存在该公司';
    case -9:
      return '没有数据';
    case -10:
      return '请求id不存在';
    case -11:
      return '用户已存在';
    case -12:
      return '房间已存在';
    case -13:
      return '远端房间已存在';
    case -14:
      return '已存在该管理员';
    case -15:
      return '文件格式不正确';
    case -16:
      return '错误的ID';
    case -17:
      return '数据重复';
    case -18:
      return '组别已重置';
    case -19:
      return 'IP格式错误';
    case -20:
      return 'IP已经屏蔽';
    case -21:
      return '用户为游客，无签名';
    case -902:
      return 'Tain连接不上';
    default:
      return '未知错误';
  }
}

export function get_param_p(role) {
  switch(role){
    case BROADCAST_ROLE_ASSIST_STR:
    case BROADCAST_ROLE_HOST_STR:
      return 2;
    case ROLE_ADMIN:
      return 1;
    default:
      return 1;
  }
}

export function getRoleStr(roleMap, role_num){
  const realRoleMap = {
    11 : BROADCAST_ROLE_ASSIST_STR,
    12 : BROADCAST_ROLE_HOST_STR,
  }
  return realRoleMap[role_num];
}

export function getRoleIntegerFromRoleStr(roleStr){
  let ret = -1;
  switch(roleStr){
    case BROADCAST_ROLE_ASSIST_STR:
      ret = 11;
      break;
    case BROADCAST_ROLE_HOST_STR:
      ret = 12;
      break;
    case 'guest':
      ret = 3;
      break;
    case 'putong':
      ret = 1;
      break;
  }
  return ret;
}

export function getRoleStr_CN(role_num){
  const realRoleMap = {
    11 : '助理',
    12 : '主播',
    3  : '游客',
    1  : '普通',
  };
  const {groupList} = store.getState().clubmember;

  let roleStr = '未知';
  roleStr = realRoleMap[role_num] ? realRoleMap[role_num] : roleStr;

  groupList.forEach((item)=>{
    if(item.type == role_num){
      roleStr = item.name;
    }
  });
  return roleStr;
}

export function isRoleManager(role_in){
  console.debug('isRoleManager');
  return role_in == 0;
}
