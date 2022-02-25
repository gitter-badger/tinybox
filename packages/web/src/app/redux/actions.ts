import {
  LOGOUT,
  SET_AUTHENTICATED,
  SET_CURRENT_USER,
  SET_HOME_ID,
} from './actionTypes';

export const setAuthenticated = (authenticated: boolean) => ({
  type: SET_AUTHENTICATED,
  payload: authenticated,
});

export const setCurrentUser = (user: any) => ({
  type: SET_CURRENT_USER,
  payload: user,
});

export const logout = () => ({
  type: LOGOUT,
  payload: {},
});

export const setHomeId = (homeId: string) => ({
  type: SET_HOME_ID,
  payload: homeId,
});
