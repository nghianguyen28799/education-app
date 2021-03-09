import { ADD_USER, DELETE_USER, GET_USER } from './types';

export const addUser = (user) => (
    {
        type: ADD_USER,
        data: user
    }
);

export const deleteUser = (key) => (
    {
        type: DELETE_USER,
    }
);
