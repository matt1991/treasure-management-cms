export const timeDesc = (data) => {
  const time = new Date(data).getTime();
  const now = Date.now();
  const timeDiff = now - time;
  if (timeDiff < 60*1000) {
    return '几秒前';
  } else if (timeDiff < 60*60*1000) {
    return `${~~(timeDiff/(60*1000))}分钟前`;
  } else if (timeDiff < 24*60*60*1000) {
    return `${~~(timeDiff/(60*60*1000))}小时前`;
  } else if (timeDiff < 30*24*60*60*1000) {
    return `${~~(timeDiff/(24*60*60*1000))}天前`;
  } else if (timeDiff < 12*30*24*60*60*1000) {
    return `${~~(timeDiff/(30*60*60*1000))}月前`;
  } else {
    return `${~~(timeDiff/(12*30*60*60*1000))}年前`;
  }
}

export function timeStamp(time) {
  const dateData = new Date(time);
  let hh = dateData.getHours();
  if (hh < 10)
    hh += '0';
  let mm = dateData.getHours();
  if (mm < 10)
    mm += '0';
  let ss = dateData.getSeconds();
  if (ss < 10)
    ss += '0';
  return `${time.slice(0,10)} ${hh}:${mm}:${ss}`;
};

export function toYYYYMMDD(date) {
  return new Date(date).toISOString().slice(0, 10).replace(/-/g, '');
};

export function toDateInstance(data) {
  // speical for YYYYMMDD to a Date instance
  return new Date(data.slice(0, 4), Number(data.slice(4, 6)) - 1, data.slice(6, 8));
}
