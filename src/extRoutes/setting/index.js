import ExtPage from '#/extContainer';
import { redirectToAccountProfile  } from '#/extRoutes/utils';
export default {
  path: 'login',
  component: ExtPage.Login,
  onEnter :redirectToAccountProfile,
  showInNav: false,
}
