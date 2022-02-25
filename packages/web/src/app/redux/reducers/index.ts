import auth from './auth';
import { combineReducers } from 'redux';
import home from './home';

export default combineReducers({ auth, home });
