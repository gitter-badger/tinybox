import auth from './auth';
import { combineReducers } from 'redux';
import home from './home';

export const rootReducer = combineReducers({ auth, home });

export type RootState = ReturnType<typeof rootReducer>;
