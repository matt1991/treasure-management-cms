import ExtPage from '#/extContainer';
import { redirectToLogin } from '#/extRoutes/utils';


export default {
  path: 'list',
  component: ExtPage.FullLotteries.List,
  breadcrumbName: '列表',
  showInNav: true,
}
