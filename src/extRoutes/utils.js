import {P_ID, AUTH, ACCOUNT, ROLE, SU_AUTH, SU_ACCOUNT, ROLE_ADMIN, ROLE_GUEST_ADMIN} from '#/extConstants';
const checkAuth = () => localStorage.getItem('__AUTH');

const checkSadminAuth = () => localStorage.getItem('__SADMIN__AUTH');

const checkAdminAuth = () => {
    const auth = localStorage.getItem('__AUTH');
    const role = localStorage.getItem(ROLE);

    console.debug('checkAdminAuth', auth, role)
    if(!auth || role != ROLE_ADMIN){
      return false;
    }

    return true;
};

const checkGuestAdminAuth = () => {
    const auth = localStorage.getItem('__AUTH');
    const role = localStorage.getItem(ROLE);

    console.debug('checkGuestAdminAuth', auth, role)
    if(!auth || role != ROLE_GUEST_ADMIN){
      return false;
    }

    return true;
};

export function indexRedirect(redirectUrl) {
  return {
    onEnter: (nextState, replace) => replace(redirectUrl)
  }
}

export function redirectToLogin(nextState, replace) {
  if (!checkAuth()) {
    replace({
      pathname: '/login',//'/login',
      state: {
        nextPathname: nextState.location.pathname
      }
    })
  }
}

export function redirectToAgentLogin(nextState, replace) {
  if (!checkAuth()) {
    replace({
      pathname: '/alogin',//'/login',
      state: {
        nextPathname: nextState.location.pathname
      }
    })
  }
}



export function redirectToLoginSadmin(nextState, replace) {
  if (!checkSadminAuth()) {
    replace({
      pathname: '/sadmin/login',
      state: {
        nextPathname: nextState.location.pathname
      }
    })
  }
}

export function redirectToAccountProfile(netxtState, replace){
  if (checkAuth() && localStorage.getItem(ROLE) == 'admin'){
    replace('/account');
  }
}

export function redirectToAgentProfile(netxtState, replace){
  if (checkAuth() && localStorage.getItem(ROLE) == 'agent'){
    replace('/agent');
  }
}

export function redirectToDashboard(nextState, replace) {
  if (checkAuth()) {
    replace('/');
  }
}

export function logoutSuadmin() {
  localStorage.removeItem(SU_AUTH);
  localStorage.removeItem(SU_ACCOUNT);
}

export function logoutAdmin() {
  localStorage.removeItem(AUTH);
  localStorage.removeItem(ACCOUNT);
}

export function logoutAssistHost() {
  localStorage.removeItem(AUTH);
  localStorage.removeItem(ACCOUNT);
  localStorage.removeItem(P_ID);
  localStorage.removeItem(ROLE);
}
