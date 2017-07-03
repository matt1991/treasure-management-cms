import ExtPage from '#/extContainer';
import { redirectToLogin, indexRedirect } from '#/extRoutes/utils';

export default {
  path: 'setting',
  component: ExtPage.LeftMenu,
  showInNav: true,
  icon: 'pay-circle-o',
  breadcrumbName: '配置',
  roles: ['admin'],
  onEnter: redirectToLogin,
  indexRoute: indexRedirect('/setting/banner'),
  childRoutes: [
    require('./banner').default,
  ]
}
