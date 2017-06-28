import fetch from 'isomorphic-fetch';
import urlJoin from 'url-join';
import { pickDefinedProperty as pickBy, handleGoto } from '#/utils';
import { store } from '#/app';
import {API_ROOT_URL,AUTH} from '#/extConstants';

let defaultRoot = API_ROOT_URL;

let defaultHeaders = {};

export function config({root, headers}) {
  if (typeof root === 'string')
    defaultRoot = root;
  if (typeof headers === 'object')
    defaultHeaders = headers;
}

class Endpoint {
  constructor({
    root = defaultRoot,
    path = '/',
    headers = defaultHeaders,
  }) {
    this.root = root;
    this.path = path;
    this.url = urlJoin(root, path);
    this.headers = Object.assign({}, {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      //'Hugo-Api-Token': localStorage.getItem(AUTH),
    }, headers);
  }

  resource(id) {
    return new Endpoint({
      root: this.root,
      headers: this.headers,
      path: urlJoin(this.path, id)
    });
  }

  browse({query, body, headers} = {}) {
    return _get({
      url: urlJoin(this.url, handleQuery(query)),
      headers: Object.assign({}, this.headers, headers),
      body
    });
  }

  read({id, query, body, headers} = {}) {
    return _get({
      url: urlJoin(this.url, id, handleQuery(query)),
      headers: Object.assign({}, this.headers, headers),
      body
    });
  }

  edit({id, query, body, headers} = {}) {
    return _put({
      url: urlJoin(this.url, id, handleQuery(query)),
      headers: Object.assign({}, this.headers, headers),
      body
    });
  }

  add({id, query, body, headers} = {}) {
    return _post({
      url: urlJoin(this.url, id, handleQuery(query)),
      headers: Object.assign({}, this.headers, headers),
      body
    });
  }

  delete({id, query, body, headers} = {}) {
    return _delete({
      url: urlJoin(this.url, id, handleQuery(query)),
      headers: Object.assign({}, this.headers, headers),
      body
    });
  }
}

const aliases = {
  browse: ['list'],
  read: ['retrieve', 'get'],
  add: ['create', 'post'],
  delete: ['destroy'],
  edit: ['modify'],
}

Object.keys(aliases).forEach(key => aliases[key].forEach(alias => Endpoint.prototype[alias] = Endpoint.prototype[key]));

function handleQuery(query) {
  if(!query) return '';
  return '?' + Object.entries(query).map(entry => encodeURIComponent(entry[0]) + '=' + encodeURIComponent(entry[1])).join('&');
}

function _request(url, options) {
  let finalOptions;
  if (typeof options.body !== 'string')
    finalOptions = Object.assign({}, options, {body: JSON.stringify(options.body)});
  finalOptions.headers = pickBy(finalOptions.headers);
  //console.debug(finalOptions, options, pickBy(finalOptions));
  return fetch(url, pickBy(finalOptions))
  .then(handleResponse)
  .catch(handleBadResponse);
}

//TODO: 以后直接返回res， 数据提取交给调用的函数
function handleResponse(res) {
  if (res.status === 204)
    return {};
  if (res.status >= 200 && res.status < 300){
    return res.json();
  }

  else
    return Promise.reject(res);
}

function handleBadResponse(res) {
  if (res.status === 401) {
    localStorage.setItem(AUTH, '');
    handleGoto(store.dispatch, '/login');
  }

  console.log(res);
  return res.json()
  .catch(err => Promise.reject({status: res.status, message: '未知错误 parse error'}))
  .then(data => {
    // ugly response handler
    if (data.message === 'Not Authorized') data.message = '尚未登陆，请先登录';
    return Promise.reject({status: res.status, ...data})
  });
}

function _get({url, headers, body}) {
  return _request(url, {
    method: 'get',
    headers,
    body
  });
}

function _post({url, headers, body}) {
  return _request(url, {
    method: 'post',
    headers,
    body
  });
}

function _put({url, headers, body}) {
  return _request(url, {
    method: 'put',
    headers,
    body
  });
}

function _delete({url, headers, body}) {
  return _request(url, {
    method: 'delete',
    headers,
    body
  });
}

const methods = Object.keys(aliases).map(key => [].concat(aliases[key].concat(key))).reduce((prev, cur) => prev.concat(cur), []);
export default function(config) {
  const endpoint = new Endpoint(config);
  methods.forEach(method => endpoint[method] = endpoint[method].bind(endpoint));
  return endpoint;
}
