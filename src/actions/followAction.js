import { ADD_FOLLOW } from './types';

export const addInfo = (info) => (
    {
        type: FOLLOW,
        data: info
    }
);
