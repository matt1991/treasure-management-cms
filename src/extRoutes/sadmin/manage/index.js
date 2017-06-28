import Page from '#/extContainer';
import { redirectToLoginSadmin, indexRedirect } from '#/extRoutes/utils';

export default {
  path: 'manage',
  component: Page.Sadmin.Overcoat,
  indexRoute: indexRedirect('/sadmin/manage/list'),
  onEnter: redirectToLoginSadmin,
  icon: '',
  showInSadminNav: true,
  breadcrumbName:'帐号管理',
//  onEnter: redirectToLoginSadmin,
  childRoutes: [
    {
      path: 'list',
      component: Page.Sadmin.Manage.List,
      status: 'list',
    },
    {
      path: 'edit/:id',
      component: Page.Sadmin.Manage.Edit,
      status: 'edit',
    },
    {
      path: 'info/:id',
      component:Page.Sadmin.Manage.Info,
      status: 'list'
    }
  ],
}
