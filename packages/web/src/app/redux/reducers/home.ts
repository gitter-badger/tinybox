import { LOGOUT, SET_HOME_ID } from '../actionTypes';

const initialState = {
  homeId: null,
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case LOGOUT:
      return {
        ...state,
        homeId: null,
      };
    case SET_HOME_ID:
      return {
        ...state,
        homeId: action.payload,
      };
    default:
      return state;
  }
}
