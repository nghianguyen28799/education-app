import { ADD_FOLLOW } from '../actions/types';


const initialState = {
    info: {}
}

const followReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_FOLLOW:
            return {
                data: action.data   
            }
        default:
            return state;
    }
}

export default followReducer;