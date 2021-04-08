import { ADD_DESTINATION } from './types';

export const addDestination = (info) => (
    {
        type: ADD_DESTINATION,
        data: info
    }
);