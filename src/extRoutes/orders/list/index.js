import ExtPage from '#/extContainer';
import { redirectToLogin } from '#/extRoutes/utils';


export default {
  path: 'list',
  component: ExtPage.Orders.List,
  breadcrumbName: '列表',
  showInNav: true,
}
