import Page from '#/extContainer';
import { redirectToLoginSadmin, indexRedirect } from '#/extRoutes/utils';

export default {
  path: 'sadmin',
  component: Page.Base,
  indexRoute: indexRedirect('/sadmin/account'),
  icon: '',
  showInNavFilterFn: false,
  childRoutes: [
    require('./account').default,
    require('./login').default,
    require('./manage').default,
  ],
}
