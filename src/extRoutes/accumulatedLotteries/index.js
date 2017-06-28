import ExtPage from '#/extContainer';
import { redirectToLogin, indexRedirect } from '#/extRoutes/utils';

export default {
  path: 'accumulatedLotteries',
  component: ExtPage.LeftMenu,
  showInNav: true,
  icon: 'rocket',
  breadcrumbName: '每周一注',
  roles: ['admin'],
  onEnter: redirectToLogin,
  indexRoute: indexRedirect('/accumulatedLotteries/settings'),
  childRoutes: [
    require('./settings').default,
    require('./list').default,
  ]
}
