// reducers.js
import { combineReducers } from 'redux';
import positionReducer from './position';
import runningReducer from './runningInfo';

const rootReducer = combineReducers({
  currentPosition: positionReducer,
  runningInfo: runningReducer
});

export default rootReducer;