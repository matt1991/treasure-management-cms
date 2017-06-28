import ExtPage from '#/extContainer';
import { redirectToLogin, indexRedirect } from '#/extRoutes/utils';

export default {
  path: 'account',
  component: ExtPage.LeftMenu,
  showInNav: true,
  icon: 'home',
  breadcrumbName: '账户',
  roles: ['admin'],
  onEnter: redirectToLogin,
  indexRoute: indexRedirect('/account/profile'),
  childRoutes: [
    require('./profile').default,
  ]
}
