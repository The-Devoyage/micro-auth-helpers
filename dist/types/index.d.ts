import jwt from 'jsonwebtoken';
export interface AuthContext {
    decodedToken?: DecodedToken;
    isAuth: boolean;
    error?: string;
}
export interface Context extends Record<string, any> {
    auth: AuthContext;
}
export interface DecodedToken extends jwt.JwtPayload {
    account?: {
        _id: string;
        email: string;
    };
    user?: {
        _id: string;
        role: number;
        email: string;
    };
}
