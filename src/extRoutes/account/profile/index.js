import ExtPage from '#/extContainer';

import { redirectToLogin } from '#/extRoutes/utils';


export default {
  path: 'profile',
  component: ExtPage.ProfilePane,
  breadcrumbName: '个人资料',
  showInNav: true,
}
