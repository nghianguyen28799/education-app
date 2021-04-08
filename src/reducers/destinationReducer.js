import { AsyncStorage } from 'react-native'
import { ADD_DESTINATION } from '../actions/types';
import axios from 'axios';
import host from '../assets/host'

const initialState = {
    destination: {}
}

const destinationReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_DESTINATION:
            return {
                data: action.data   
            }
        default:
            return state;
    }
}

export default destinationReducer;