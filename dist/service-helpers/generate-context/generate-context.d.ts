import { Request } from 'express';
import { Context } from 'src/types';
export declare const GenerateContext: (params: {
    req: Request;
    custom?: Record<string, any>;
}) => Context;
