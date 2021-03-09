import { AsyncStorage } from 'react-native'
import { ADD_USER, DELETE_USER, GET_USER } from '../actions/types';
import axios from 'axios';
import host from '../assets/host'

const initialState = {
    user: {}
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_USER:
            return {
                data: action.data   
            }
        case DELETE_USER:
            const key = action.key;
            return {
                data: null
            }
        default:
            return state;
    }
}

export default userReducer;