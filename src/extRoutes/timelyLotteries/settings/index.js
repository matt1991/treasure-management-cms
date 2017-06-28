import ExtPage from '#/extContainer';
import { redirectToLogin } from '#/extRoutes/utils';


export default {
  path: 'settings',
  component: ExtPage.TimelyLotteries.Settings,
  breadcrumbName: '配置',
  showInNav: true,
}
