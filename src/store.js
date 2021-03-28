import { createStore, combineReducers } from 'redux';
import userReducer from './reducers/userReducer';
import followReducer from './reducers/followReducer';

const rootReducer = combineReducers({
    userReducer,
    followReducer
})

const configureStore = () => createStore(rootReducer);

export default configureStore
