import { ADD_FOLLOW, DELETE_FOLLOW, EDIT_FOLLOW, INITIAL_FOLLOW } from './types';

export const addInfo = (info) => (
    {
        type: ADD_FOLLOW,
        data: info
    }
);

export const deleteInfo = (info) => (
    {
        type: DELETE_FOLLOW,
        data: info
    }
)

export const editInfo = (info) => (
    {
        type: EDIT_FOLLOW,
        data: info
    }
)

export const initialInfo = () => (
    {
        type: INITIAL_FOLLOW,
    }
)