# Sciuridae
## UC CMS based on Ant Design

### CLI

``` shell
# develop
npm run dev
# export
npm run build
```

articleType ~ document_type
post_type ~ information_type

## Deprecated
```
  node ./tools/font2svg.js
```

## sagas format for opeation chain

```
  {
    type: 'article/save[/(success|failed)]',
    payload: {
      id,
      data: {
        ...
        title,
        content,
        ...
      },
      articleType,
      workflowEvent,
      topicSelected,
      reason,
    }
  }
```

### sample: a controlled flow for each article related operation
```
import { takeLatest } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { push } from 'redux-router';

import { routerInEdit, payloadExtender } from '../utils';
import flowRunner from '../flowRunner';

export function* articleReject() {
  yield* takeLatest('article/reviewed/reject', reviewedAsync);
}

function* reviewedAsync({type, payload}) {
  // step0 save if it is in Edit
  // step1 reject reason modal show
  // step2 workflow_event `reject` requests
  const eventSave = 'helper/post/save';
  const eventRejectReason = 'helper/post/reject_reason';
  const eventReject = 'helper/post/reject';

  const typedOpinion = type.split('/').reverse()[0];

  const flow = [eventRejectReason, eventReject];
  const inEdit = yield routerInEdit();
  if (inEdit) flow.unshift(eventSave);

  payload = payloadExtender(payload, {
    workflowEvent: typedOpinion === 'discard'
      ? 'discard'
      : 'reject'
  });

  const successCb = function* () {
    const eventGoto = 'helper/post/go_to';
    const nextPath = typedOpinion === 'discard'
      ? '/workshop/reviewing/list'
      : '/workshop/rejected/list';

    yield put({
      type: 'notify/info',
      payload: `成功${typedOpinion === 'discard' ? '弃用' : '退回'}`
    });
    yield put(push({
      pathname: nextPath
    }));
    yield put({
      type: eventGoto,
      payload: nextPath
    });
  }

  yield flowRunner(flow, payload, successCb);
}
```

## special operation list for information in page UC
information.state: '已发布'
* 编辑 (修改、更新) modify/update
* 修改话题 choose_topic [information_type: 'normal' only]
* 修改区块 choose_block
* 下线 offline

information.state: '已下线'
* 编辑 (修改) modify/update
* 上线 online
 * information_type: 'normal': 选择话题再上线
 * information_type: 'external': 选择区块再上线

## operation config

### document 稿件库(待更新)
* [list]: /
* [preview]: '编辑'
* [edit]: '保存', '提交审核', '直接发布', '预览', '取消'
### article 草稿箱
* [list]: '新建', '删除',
* [preview]: '编辑'
* [edit]: '保存', '提交审核', '直接发布', '预览', '取消'

### article 待审核
* [list]: /
* [preview]: '编辑', '发布', '退回', '弃用',
* [edit]: '保存', '预览', '取消'

### article 待主编审核
* [list]: /
* [preview]: '编辑', '发布', '退回', '弃用',
* [edit]: '保存', '直接发布', '预览', '取消'

### article 退回
* [list]: /
* [preview]: '编辑'
* [edit]: '保存', '提交审核', '预览', '取消'

### information UC-信息流
* [list]: '栏目管理'
* [preview]: '修改(不改变发布时间)', '调整栏目信息', '推送至区块', '更新(改变发布时间)', '下线'
* [edit]: '修改(不改变发布时间)', '更新(改变发布时间)', '下线', '推送至区块', '创建新版本'

### information UC-商业频道
* [list]: /
* [preview]: '修改(不改变发布时间)', '推送至区块', '更新(改变发布时间)', '下线'
* [edit]: '修改(不改变发布时间)', '更新(改变发布时间)', '下线', '推送至区块'

### information 展示页面
* [list]: '推送排序'
* [preview]: '下架', '置顶'

### live_article 直播流
* [list]: '新建直播稿件'
* [preview]: '修改(不改变发布时间)', '下线'
* [edit]: '发布', '取消'

from PM
```
列表页信息
  分发池
    文章标题
    图片信息
    敏感词信息
    文章出处
    文章作者
    发布状态
    发布时间
  过滤稿件
    分发频道
    文章标题
    图片信息
    查看交换地址
    文章出处
    作者
    编辑
    发布时间
    签发状态
    操作
      修改
      调整栏目信息
      推送至展示页面
      更新
      下线
  UC商业频道
    分发频道
    文章标题
    图片信息
    查看交换地址
    文章出处
    作者
    编辑
    发布时间
    签发状态
    操作
      修改
      更新
      推送至展示页面
      下线
  展示页面
    顺序
    文章标题
    文章出处
    发布时间
    操作
      置顶
      下架
```
