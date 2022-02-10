import { Context } from 'src/types';
export declare const CheckAuth: (options: {
    context: Context;
    requireUser?: boolean;
    errorMessage?: string;
}) => void;
