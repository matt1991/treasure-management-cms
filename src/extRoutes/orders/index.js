import ExtPage from '#/extContainer';
import { redirectToLogin, indexRedirect } from '#/extRoutes/utils';

export default {
  path: 'orders',
  component: ExtPage.LeftMenu,
  showInNav: true,
  icon: 'pay-circle-o',
  breadcrumbName: '订单管理',
  roles: ['admin'],
  onEnter: redirectToLogin,
  indexRoute: indexRedirect('/orders/list'),
  childRoutes: [
    require('./list').default,
  ]
}
