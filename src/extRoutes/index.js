import { indexRedirect } from '#/extRoutes/utils';


export const rootChildRoutes = [
  require('#/extRoutes/account').default,
  require('#/extRoutes/login').default,
  require('#/extRoutes/sadmin').default,
  require('#/extRoutes/accumulatedLotteries').default,
  require('#/extRoutes/timelyLotteries').default,
  require('#/extRoutes/fullLotteries').default,
  require('#/extRoutes/orders').default,
];
export default {
  path: '/',
  indexRoute: indexRedirect('/account/profile'),
  childRoutes: rootChildRoutes
}
