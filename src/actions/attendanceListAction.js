import { ADD_ATTENDANCE, DELETE_ATTENDANCE, EDIT_ATTENDANCE, INITIAL_ATTENDANCE } from './types';

export const addStudent = (info) => (
    {
        type: ADD_ATTENDANCE,
        data: info
    }
);

export const deleteStudent = (info) => (
    {
        type: DELETE_ATTENDANCE,
        data: info
    }
)

export const editStudent = (info) => (
    {
        type: EDIT_ATTENDANCE,
        data: info
    }
)

export const initialStudent = () => (
    {
        type: INITIAL_ATTENDANCE,
    }
)