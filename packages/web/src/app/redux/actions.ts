import {
  LOGOUT,
  SET_AUTHENTICATED,
  SET_CURRENT_USER,
  SET_HOME_ID,
} from './actionTypes';

import { GetCurrentUserResult } from '@tinybox/jsonrpc';

export const setAuthenticated = (authenticated: boolean) => ({
  type: SET_AUTHENTICATED,
  payload: authenticated,
});

export const setCurrentUser = (user: GetCurrentUserResult) => ({
  type: SET_CURRENT_USER,
  payload: user,
});

export const logout = () => ({
  type: LOGOUT,
  payload: {},
});

export const setHomeId = (homeId: string | null) => ({
  type: SET_HOME_ID,
  payload: homeId,
});
