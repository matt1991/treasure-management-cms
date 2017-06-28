import ExtPage from '#/extContainer';
import { redirectToLogin, indexRedirect } from '#/extRoutes/utils';

export default {
  path: 'timelyLotteries',
  component: ExtPage.LeftMenu,
  showInNav: true,
  icon: 'clock-circle-o',
  breadcrumbName: '时时彩',
  roles: ['admin'],
  onEnter: redirectToLogin,
  indexRoute: indexRedirect('/timelyLotteries/settings'),
  childRoutes: [
    require('./settings').default,
    require('./list').default,
  ]
}
