import { ADD_ATTENDANCE, DELETE_ATTENDANCE, EDIT_ATTENDANCE, INITIAL_ATTENDANCE} from '../actions/types';


const initialState = {
    infoStudentList: []
}

const followReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ATTENDANCE:
            return {
                ...state,
                infoStudentList: state.infoStudentList.concat({
                    key: Math.random(),
                    data: action.data
                })   
            }
        case DELETE_ATTENDANCE:
            return {
                ...state,
                infoStudentList: state.infoStudentList.filter((item) => 
                    item.key !== key
                )  
            }

        case EDIT_ATTENDANCE:
            return {
                ...state,
                infoStudentList: state.infoStudentList
            }
        
        case INITIAL_ATTENDANCE:
            return {    
                infoStudentList: [],
            }
        default:
            return state;
    }
}

export default followReducer;