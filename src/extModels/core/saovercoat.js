import { delay } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import { PreviewerMode } from '#/extConstants';
import { parseValue } from '#/utils';

export default {
  namespace: 'saovercoat',
  state: {
    changepwdModal:false,
    openConfirmModal:false,
    closeConfirmModal:false,
    openAccountModal:false,
    closeAccountModal:false,
    deleteAccountModal:false,
    createAccountModal:false,
    editAccountModal:false,
    viewImageModal:false,
    editAccount:{},
  },
  reducers: {
    ['sadmin/changepwd_modal/show'] (state, action) {
      return {...state, changepwdModal:true};
    },
    ['sadmin/changepwd_modal/show/failed'] (state, action) {
      return {...state, changepwdModal:false};
    },
    ['sadmin/changepwd_modal/show/succeeded'] (state, action) {
      return {...state, changepwdModal:false};
    },
    ['sadmin/room/openConfirm_modal/show'] (state, action) {
      return {...state, openConfirmModal:true};
    },
    ['sadmin/room/openConfirm_modal/show/succeeded'] (state, action) {
      return {...state, openConfirmModal:false};
    },
    ['sadmin/room/openConfirm_modal/show/failed'] (state, action) {
      return {...state, openConfirmModal:false};
    },
    ['sadmin/room/closeConfirm_modal/show'] (state, action) {
      return {...state, closeConfirmModal:true};
    },
    ['sadmin/room/closeConfirm_modal/show/succeeded'] (state, action) {
      return {...state, closeConfirmModal:false};
    },
    ['sadmin/room/closeConfirm_modal/show/failed'] (state, action) {
      return {...state, closeConfirmModal:false};
    },
    ['sadmin/manage/openAccount_modal/show'] (state, action) {
      return {...state, openAccountModal:true};
    },
    ['sadmin/manage/openAccount_modal/show/failed'] (state, action) {
      return {...state, openAccountModal:false};
    },
    ['sadmin/manage/openAccount_modal/show/succeeded'] (state, action) {
      return {...state, openAccountModal:false};
    },
    ['sadmin/manage/closeAccount_modal/show'] (state, action) {
      return {...state, closeAccountModal:true};
    },
    ['sadmin/manage/closeAccount_modal/show/failed'] (state, action) {
      return {...state, closeAccountModal:false};
    },
    ['sadmin/manage/closeAccount_modal/show/succeeded'] (state, action) {
      return {...state, openAccountModal:false};
    },
    ['sadmin/manage/deleteAccount_modal/show'] (state, action) {
      return {...state, closeAccountModal:true};
    },
    ['sadmin/manage/deleteAccount_modal/show/failed'] (state, action) {
      return {...state, closeAccountModal:false};
    },
    ['sadmin/manage/deleteAccount_modal/show/succeeded'] (state, action) {
      return {...state, openAccountModal:false};
    },
    ['sadmin/manage/createAccount_modal/show'] (state, action) {
      return {...state, createAccountModal:true};
    },
    ['sadmin/manage/createAccount_modal/show/failed'] (state, action) {
      return {...state, createAccountModal:false};
    },
    ['sadmin/manage/createAccount_modal/show/succeeded'] (state, action) {
      return {...state, createAccountModal:false};
    },
    ['sadmin/manage/editAccount_modal/show'] (state, action) {
      console.log("********", action);
      return {...state, ...{editAccount:action.payload.editAccount}, editAccountModal:true};
    },
    ['sadmin/manage/editAccount_modal/show/failed'] (state, action) {
      return {...state, editAccountModal:false};
    },
    ['sadmin/manage/editAccount_modal/show/succeeded'] (state, action) {
      return {...state, editAccountModal:false};
    },
    ['sadmin/room/viewImage_modal/show'] (state, {payload}) {
      return {...state, viewImageModal:true, ...payload};
    },
    ['sadmin/room/viewImage_modal/show/failed'] (state, {payload}) {
      return {...state, viewImageModal:false, ...payload};
    },

  },
  effects: {
    * ['*'] ({type}) {
      if (type.endsWith('modal/ensure'))
        yield put({type: 'previewer/persist'});
      if (type.endsWith('modal/ensure/succeeded') || type.endsWith('modal/ensure/failed'))
        yield put({type: 'previewer/closable'});
    },
    *['previewer/mode'] ({payload}) {
      yield put({
        type: 'previewer/mode/changed',
        payload,
      });
      localStorage.setItem(PreviewerMode, payload);
    },
    *['previewer/show'] ({payload}) {
      yield put({type: 'previewer/show/succeeded'});
      yield put({
        type: 'detail/get',
        payload,
      });
    },
    *['previewer/hide'] () {
      yield put({
        type: 'previewer/hide/succeeded'
      });
    },
  }
}
