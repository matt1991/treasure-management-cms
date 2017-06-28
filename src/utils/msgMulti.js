import React from 'react';
import { notification } from 'antd';
import { MsgMulti } from '#/extComponents';

export default (type = 'error', msg = [], duration = 5) => {
  notification[type]({
    message: React.createElement(MsgMulti, { msg }),
    duration,
  });
}
