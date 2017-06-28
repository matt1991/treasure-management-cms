import Page from '#/extContainer';
import { redirectToLoginSadmin, indexRedirect } from '#/extRoutes/utils';

export default {
  path: 'account',
  component: Page.Sadmin.Overcoat,
  onEnter: redirectToLoginSadmin,
  indexRoute: indexRedirect('/sadmin/account/info'),
  icon: '',
  showInSadminNav: true,
  breadcrumbName:'个人资料',
  childRoutes: [
    {
      path: 'info',
      component: Page.Sadmin.Account,
      status: 'list',
    },
  ],
}
