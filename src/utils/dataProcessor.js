import moment from 'moment';

export function accumulatedLotterySettingToServerData(payload) {
  let result = {};
  if (payload.id) {
    result.id = payload.id;
  }

  if (payload.name) {
    result.name = payload.name;
  }

  if (payload.period) {
    result.period = parseInt(payload.period);
  }

  if (payload.rule) {
    result.rule = payload.rule;
  }

  if (payload.unit_price) {
    result.unit_price = parseInt(payload.unit_price);
  }

  if (payload.lucky_rate) {
    result.unit_price = parseFloat(payload.lucky_rate);
  }

  if (payload.auto_open !== undefined) {
    result.auto_open = payload.auto_open;
  }

  if (payload.auto_renew !== undefined) {
    result.auto_renew = payload.auto_renew;
  }

  if (payload.effect_time) {
    result.effect_time = payload.effect_time.valueOf();
  }

  if (payload.end_time) {
    result.end_time = payload.end_time.format('HH:mm:ss');
  }

  return result;
};


export function accumulatedLotterySettingToLocalData(payload) {
  let result = {};
  if (payload.id) {
    result.id = payload.id;
  }

  if (payload.name) {
    result.name = payload.name;
  }

  if (payload.period) {
    result.period = payload.period + "";
  }

  if (payload.rule) {
    result.rule = payload.rule;
  }

  if (payload.unit_price) {
    result.unit_price = payload.unit_price+"";
  }

  if (payload.lucky_rate) {
    result.unit_price = payload.lucky_rate+"";
  }

  if (payload.auto_open !== undefined) {
    result.auto_open = payload.auto_open;
  }

  if (payload.auto_renew !== undefined) {
    result.auto_renew = payload.auto_renew;
  }

  if (payload.effect_time) {
    result.effect_time = moment(payload.effect_time);
  }

  if (payload.end_time) {
    result.end_time = moment(payload.end_time, 'HH:mm:ss');
  }

  return result;

};

export function timelyLotterySettingToServerData(payload) {
  let result = {};
  if (payload.id) {
    result.id = payload.id;
  }

  if (payload.name) {
    result.name = payload.name;
  }

  if (payload.period) {
    result.period = parseInt(payload.period);
  }

  if (payload.interval) {
    result.interval = parseInt(payload.interval);
  }

  if (payload.rule) {
    result.rule = payload.rule;
  }

  if (payload.unit_price) {
    result.unit_price = parseInt(payload.unit_price);
  }

  if (payload.lucky_rate) {
    result.lucky_rate = parseFloat(payload.lucky_rate);
  }

  if (payload.auto_open !== undefined) {
    result.auto_open = payload.auto_open;
  }

  if (payload.auto_renew !== undefined) {
    result.auto_renew = payload.auto_renew;
  }

  if (payload.effect_time) {
    result.effect_time = payload.effect_time.valueOf();
  }



  return result;
};


export function timelyLotterySettingToLocalData(payload) {
  let result = {};
  if (payload.id) {
    result.id = payload.id;
  }

  if (payload.name) {
    result.name = payload.name;
  }

  if (payload.period) {
    result.period = payload.period + "";
  }

  if (payload.interval) {
    result.interval = payload.interval + "";
  }

  if (payload.rule) {
    result.rule = payload.rule;
  }

  if (payload.unit_price) {
    result.unit_price = payload.unit_price+"";
  }

  if (payload.lucky_rate) {
    result.unit_price = payload.lucky_rate+"";
  }

  if (payload.auto_open !== undefined) {
    result.auto_open = payload.auto_open;
  }

  if (payload.auto_renew !== undefined) {
    result.auto_renew = payload.auto_renew;
  }

  if (payload.effect_time) {
    result.effect_time = moment(payload.effect_time);
  }



  return result;

};

export function fullLotterySettingToServerData(payload) {
  let result = {};
  if (payload.id) {
    result.id = payload.id;
  }

  if (payload.name) {
    result.name = payload.name;
  }

  if (payload.period) {
    result.period = parseInt(payload.period);
  }

  if (payload.rule) {
    result.rule = payload.rule;
  }

  if (payload.unit_price) {
    result.unit_price = parseInt(payload.unit_price);
  }

  if (payload.lucky_rate) {
    result.unit_price = parseFloat(payload.lucky_rate);
  }

  if (payload.auto_open !== undefined) {
    result.auto_open = payload.auto_open;
  }

  if (payload.auto_renew !== undefined) {
    result.auto_renew = payload.auto_renew;
  }

  if (payload.effect_time) {
    result.effect_time = payload.effect_time.valueOf();
  }

  if (payload.end_time) {
    result.end_time = payload.end_time.format('HH:mm:ss');
  }

  return result;
};


export function fullLotterySettingToLocalData(payload) {
  let result = {};
  if (payload.id) {
    result.id = payload.id;
  }

  if (payload.name) {
    result.name = payload.name;
  }

  if (payload.period) {
    result.period = payload.period + "";
  }

  if (payload.rule) {
    result.rule = payload.rule;
  }

  if (payload.unit_price) {
    result.unit_price = payload.unit_price+"";
  }

  if (payload.lucky_rate) {
    result.unit_price = payload.lucky_rate+"";
  }

  if (payload.auto_open !== undefined) {
    result.auto_open = payload.auto_open;
  }

  if (payload.auto_renew !== undefined) {
    result.auto_renew = payload.auto_renew;
  }

  if (payload.effect_time) {
    result.effect_time = moment(payload.effect_time);
  }

  if (payload.end_time) {
    result.end_time = moment(payload.end_time, 'HH:mm:ss');
  }

  return result;

};


export function processLotterySearchForm(payload) {
  let result = {};
  if (payload.id) {
    result.id = payload.id;
  }

  if (payload.name) {
    result.name = payload.name;
  }

  if (payload.start_time && payload.start_time.length > 1) {
    result.from = payload.start_time[0].valueOf();
    result.to = payload.start_time[1].valueOf();
  }

  if (payload.lucky_time && payload.lucky_time.length > 1) {
    result.lucky_from = payload.lucky_time[0].valueOf();
    result.lucky_to = payload.lucky_time[1].valueOf();
  }

  if (payload.number) {
    result.number = payload.number;
  }

  if (payload.state) {
    result.state = payload.state;
  }

  return result;

};

export function processOrderSearchForm(payload) {
  let result = {};
  if (payload.id) {
    result.id = payload.id;
  }

  if (payload.setting_id) {
    result.setting_id = payload.setting_id;
  }

  if (payload.create_time && payload.create_time.length > 1) {
    result.from = payload.create_time[0].valueOf();
    result.to = payload.create_time[1].valueOf();
  }

  if (payload.number) {
    result.number = parseInt(payload.number);
  }

  if (payload.pid) {
    result.pid = payload.pid;
  }

  if (payload.type !== undefined) {
    result.type = parseInt(payload.type);
  }

  if (payload.login_name) {
    result.login_name = payload.login_name;
  }

  if (payload.state) {
    result.state = payload.state;
  }

  if (payload.lucky_time) {
    result.lucky_time_from = payload.lucky_time[0].valueOf();
    result.lucky_time_to = payload.lucky_time[1].valueOf();
  }

  return result;


}


export function bannerToServerData(payload) {
  let result = {};
  if (payload.index) {
    result.index = parseInt(payload.index);
  }

  if (payload.id) {
    result.id = payload.id;
  }

  if (payload.location) {
    result.location = payload.location;
  }

  if (payload.device) {
    result.device = payload.device;
  }

  if (payload.img_url) {
    result.img_url = payload.img_url;
  }

  return result;
}

export function bannerToLocalData(payload) {
  let result = {};
  if (payload.index !== undefined) {
    result.index = payload.index + "";
  }

  if (payload.id) {
    result.id = payload.id;
  }

  if (payload.location) {
    result.location = payload.location;
  }

  if (payload.device) {
    result.device = payload.device;
  }

  if (payload.img_url) {
    result.img_url = payload.img_url;
  }

  return result;
}
