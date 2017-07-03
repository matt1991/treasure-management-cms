import ExtPage from '#/extContainer';
import { redirectToLogin } from '#/extRoutes/utils';


export default {
  path: 'banner',
  component: ExtPage.Setting.Banner,
  breadcrumbName: 'Banner',
  showInNav: true,
}
