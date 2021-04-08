import { createStore, combineReducers } from 'redux';
import userReducer from './reducers/userReducer';
import followReducer from './reducers/followReducer';
import destinationReducer from './reducers/destinationReducer';
import attendanceListReducer from './reducers/attendanceListReducer';

const rootReducer = combineReducers({
    userReducer,
    followReducer,
    destinationReducer,
    attendanceListReducer
})

const configureStore = () => createStore(rootReducer);

export default configureStore
