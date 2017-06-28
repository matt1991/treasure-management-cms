export * as format from './format';
export * as check from './check';
export validate from './validate';
export msgMulti from './msgMulti';
export handleGoto from './handleGoto';

import {AUTH, ACCOUNT, ROLE, ROLE_ADMIN, ROLE_SADMIN, BROADCAST_ROLE_HOST_STR, BROADCAST_ROLE_ASSIST_STR} from '#/extConstants';

// filter enchance fn for taskmaster below
// specifically for those default field is empty
// which means each can access it without limited
export function filterEnhanced(targetKey, current) {
  return n => (n[targetKey] && ~n[targetKey].indexOf(current)) || !n[targetKey];
}

export function parseValue(val) {
  try {
    return JSON.parse(val);
  } catch (e) {
    return val;
  }
};

export function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    let context = this, args = arguments;
    let later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export function pickDefinedProperty(obj) {
  const newObj = {};
  const keys = Object.keys(obj);
  keys.map(key => {
    const property = obj[key];
    if (property) newObj[key] = property;
  });
  return newObj;
}

export function selectFiles(callback, options = {}) {
  const uploadInput = document.createElement('input');
  uploadInput.setAttribute('value', '');
  uploadInput.setAttribute('type', 'file');
  // if (options.accept) {
  //   uploadInput.setAttribute('accept', options.accept);
  // }
  // if (options.multiple) {
  //   uploadInput.multiple = true;
  // }
  uploadInput.onchange = function() {
    // for next tick to do blew callback
    setTimeout(() => {
      if (this.files && this.files.length) {
        callback(options.multiple ? this.files : this.files[0]);
      }
    });
  }

  uploadInput.setAttribute('style', 'display: none');
  document.body.appendChild(uploadInput);

  uploadInput.click();
  document.body.removeChild(uploadInput);
};

/*
 * get single argument from @routes[Array]
 * because sometimes we need read the property
 * that mounted at the @router[Object]
 * more detail in routes config folder
 */
export function getArgFromRouter(routes, arg) {
  const tmp = {};

  routes.reduceRight((prev, current) => {
    if (!prev[arg] && current[arg]) prev[arg] = current[arg];
    return prev;
  }, tmp);

  return tmp[arg];
}

export function isPromise(val) {
  return val && typeof val.then === 'function';
}

export function isFunction(val) {
 return val && {}.toString.call(val) === '[object Function]';
}

export function checkOfflineText(text) {
  return text === '已下线';
}


export function getLogoutRedirectPathByRole(role){
  let path = '/login';
  switch(role){
    case ROLE_ADMIN:
      path = '/login';
      break;
    case ROLE_SADMIN:
      path = '/sadmin/login';
      break;
    case BROADCAST_ROLE_HOST_STR:
    case BROADCAST_ROLE_ASSIST_STR:
      path = '/liveuserlogin';
      break;
    case 'agent':
      path = '/alogin';
      break;
  }
  return path;
}
