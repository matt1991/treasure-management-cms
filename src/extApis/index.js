import Endpoint from './Endpoint';

//注意：在api层，与后台服务端统一使用的都是post方法，使用字段来区分相应操作，
//因此不能使用原来的EndPoint（使用REST结构，利用del，post， put
//等方法来区分操作），

export const login = () => Endpoint({path:'/login'});

//SU 后台
/**
  该api下有：
  createNewCompany, updateCompany, applyList, roomList, verifyRoom, updateRoom
  具体看 http://172.20.2.181:9099/public/about

使用
  const endpoint = yield call(editors);
  const res = yield call(endpoint['universal'], {id: 'updateCompany', body : {所需参数map}});
*/
export const suAdmin = () => Endpoint({path:'/su'});

/**
  该api下有：
  ??????????????
  具体看 http://172.20.2.181:9099/public/about

  使用方法同上
*/
export const admin = () => Endpoint({path : '/admin' });
export const user = () => Endpoint({path : '/user' });
export const userAdmin = () => Endpoint({path: '/user/admin'});


/**
  该api下有：
  userlist get方法, banuser post方法, addremark post方法， unbanuser post方法
  具体看 http://172.20.2.181:9099/public/about

  使用方法同上
*/
export const blacksheet = () => Endpoint({path : '/blacklist' });

export const rootapi = () => Endpoint({path : '/' });

export const liveuserapi = () => Endpoint({path : '/user' });


export const accumulatedLotteries = () => Endpoint({path: '/accumulatedLotteries'});
export const timelyLotteries = () => Endpoint({path: '/timelyLotteries'});
export const fullLotteries = () => Endpoint({path: '/fullLotteries'});

export const order = () => Endpoint({path: '/order'});

export const banner = () => Endpoint({path:'/banners'});



export const notifications = () => Endpoint({path: '/notifications'});
