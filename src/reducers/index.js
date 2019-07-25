import {combineReducers} from 'redux';

import responsive from './responsive';
import user from './user';
import error from './error';

const reducers = {
    responsive,
    user,
    error
};

export default combineReducers(reducers);
