// reducers.js
import { combineReducers } from 'redux';
import positionReducer from './position';

const rootReducer = combineReducers({
  currentPosition: positionReducer,
});

export default rootReducer;