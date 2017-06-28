import ExtPage from '#/extContainer';
import { redirectToLogin, indexRedirect } from '#/extRoutes/utils';

export default {
  path: 'fullLotteries',
  component: ExtPage.LeftMenu,
  showInNav: true,
  icon: 'usergroup-add',
  breadcrumbName: '人满即开',
  roles: ['admin'],
  onEnter: redirectToLogin,
  indexRoute: indexRedirect('/fullLotteries/settings'),
  childRoutes: [
    require('./settings').default,
    require('./list').default,
  ]
}
