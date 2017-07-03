//export MENU_URLS from './menu'
export const AUTH = '__AUTH';
export const ACCOUNT = '__ACCOUNT';
export const P_ID = '__P_ID';
export const SU_AUTH = '__SADMIN__AUTH';
export const SU_ACCOUNT = '__SADMIN_ACCOUNT';
export const UID = '__UID';

export const ROLE = '__ROLE';
export const ROLE_ADMIN = 'admin';
export const ROLE_GUEST_ADMIN = 'guest_admin';
export const ROLE_SADMIN = 'sadmin';

export const API_DOMAIN = '172.20.2.169';//'172.20.2.169'; yy.vpcdn.com zbadmin.vpcdn.com

export const UPLOAD_API = '172.20.2.169';


//export const API_ROOT_URL = `http://${API_DOMAIN}:9099`;//'http://172.20.2.181:9099';//'http://172.20.2.181:9099';//

//export const API_ROOT_URL = `http://www.6up.com:8080/bg`;//http://172.20.6.118:8084/bg/rank/list/?XDEBUG_SESSION_START=ECLIPSE_DBGP&KEY=14906022527571
export const API_ROOT_URL = `http://easy-mock.com/mock/592a62cd91470c0ac1fe9894/treasure`;

export const FILE_SERVER_URL = `http://${UPLOAD_API}:9099`;//'http://172.20.2.181:9099';//'http://172.20.2.169:9099';//
export const FILE_UPLOAD_URL = `http://${UPLOAD_API}:9099/admin/upload/`;//'http://172.20.2.181:9099/admin/upload/';
export const FILE_UPLOAD_URL_V2 = `http://${UPLOAD_API}:9998/live/upload/`;//'http://172.20.2.181:9998/live/upload/';
export const FILE_UPLOAD_SU_URL = `http://${UPLOAD_API}:9099/su/upload/`;//'http://172.20.2.181:9099/su/upload/';
export const FILE_PIC_SERVER_URL = `http://${UPLOAD_API}:9998/`;

export const DEBUG_SOCKET_SERVER = 'ws://172.20.6.88:8812';//'ws://172.20.2.169:8812';//
export const DEBUG_SOCKET_SERVER_169 = 'ws://172.20.2.169:8812';//'ws://172.20.2.169:8812';//
export const DEPLOY_SOCKET_SERVER = `ws://${API_DOMAIN}:8812`;//'ws://172.20.2.169:8812';//ws://yy.vpcdn.com:8812
export const SOCKET_SERVER = DEPLOY_SOCKET_SERVER;//'ws://172.20.2.169:8812';//
export const SOCKET_RETRY_MAX = 4;

//"host"主播 "assist"助理的消息, "guest"游客, 给ws的
export const BROADCAST_ROLE_HOST_STR = 'host';
export const BROADCAST_ROLE_ASSIST_STR = 'assist';
export const BROADCAST_ROLE_MEMBER_STR = 'member';
export const BROADCAST_ROLE_MANAGER_STR = 'manager';

//1:普通文本消息   2:主播回复  3:图片 4: 系统消息，
export const CHAT_MSG_TYPE_TEXT = 1;
export const CHAT_MSG_TYPE_HOST_REPLY = 2;
export const CHAT_MSG_TYPE_HOST_PIC = 3;
export const CHAT_MSG_TYPE_HOST_SYSTEM_INFO = 4;

export const NavCollapse = '__NAVCOLLAPSE';
export const PreviewerMode = '__PREVIEWERMODE';

export const CHAT_FORBID_TYPE = {
  BLACK_LIST    : 1,
  TALK          : 2,
  PIC           : 3,
  BOTH_TALK_PIC : 4,
};


//配置
export const LOCATION_MAP = [{key:"index", des:"首页"},{key:"full", des:"人满即开"}];

export const DEVICE_MAP = [{key:"pc", des:"PC端"}, {key:"mobile", des:"移动端"}];
