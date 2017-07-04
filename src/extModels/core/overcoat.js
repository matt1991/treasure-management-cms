import { put, call, select } from 'redux-saga/effects';
import { PreviewerMode } from '#/extConstants';
import { parseValue } from '#/utils';
import { delay} from '#/extModels/wsutils';

export default {
  namespace: 'overcoat',
  state: {
    createAccumulatedSettingModal:false,
    editAccumulatedSettingModal:false,
    createTimelySettingModal:false,
    editTimelySettingModal:false,
    createFullSettingModal:false,
    editFullSettingModal:false,
    createBannerModal:false,
    editBannerModal:false,
    editFullSetting:{},
    editTimelySetting:{},
    editAccumulatedSetting:{},
    editBanner:{},
  },
  reducers: {
    ['overcoat/createAccumulatedSetting_modal/show'] (state, {payload}) {
      return { ...state, createAccumulatedSettingModal: true, ...payload };
    },
    ['overcoat/createAccumulatedSetting_modal/close'] (state, {payload}) {
      return { ...state, createAccumulatedSettingModal: false,...payload };
    },
    ['overcoat/editAccumulatedSetting_modal/show'] (state, {payload}) {
      return { ...state, editAccumulatedSettingModal: true,...payload };
    },
    ['overcoat/editAccumulatedSetting_modal/close'] (state, {payload}) {
      return { ...state, editAccumulatedSettingModal: false,...payload };
    },



    ['overcoat/createTimelySetting_modal/show'] (state, {payload}) {
      return { ...state, createTimelySettingModal: true,...payload };
    },
    ['overcoat/createTimelySetting_modal/close'] (state, {payload}) {
      return { ...state, createTimelySettingModal: false ,...payload};
    },
    ['overcoat/editTimelySetting_modal/show'] (state, {payload}) {
      return { ...state, editTimelySettingModal: true ,...payload};
    },
    ['overcoat/editTimelySetting_modal/close'] (state, {payload}) {
      return { ...state, editTimelySettingModal: false,...payload };
    },



    ['overcoat/createFullSetting_modal/show'] (state, {payload}) {
      return { ...state, createFullSettingModal: true,...payload };
    },
    ['overcoat/createFullSetting_modal/close'] (state, {payload}) {
      return { ...state, createFullSettingModal: false,...payload };
    },
    ['overcoat/editFullSetting_modal/show'] (state, {payload}) {
      return { ...state, editFullSettingModal: true,...payload };
    },
    ['overcoat/editFullSetting_modal/close'] (state, {payload}) {
      return { ...state, editFullSettingModal: false,...payload };
    },

    ['overcoat/createBanner_modal/show'] (state, {payload}) {
      return { ...state, createBannerModal: true,...payload };
    },
    ['overcoat/createBanner_modal/close'] (state, {payload}) {
      return { ...state, createBannerModal: false,...payload };
    },
    ['overcoat/editBanner_modal/show'] (state, {payload}) {
      return { ...state, editBannerModal: true,...payload };
    },
    ['overcoat/editBanner_modal/close'] (state, {payload}) {
      return { ...state, editBannerModal: false,...payload };
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
    *['overcoat/start/loading'] ({payload}) {
      console.log("overcoat/start/loading");
      let loadingPercent = payload.loadingPercent;
      if (loadingPercent < 100) {
        loadingPercent = loadingPercent+10;
        yield call(delay, 100);
        console.log("overcoat/start/loaded")
        yield put({
          type:"overcoat/start/loaded",
          payload:{
            loadingPercent:loadingPercent
          }
        });
      } else {
        return;
      }
    }
  }
}
