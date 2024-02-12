import { ZeroSSLErrorData } from './types';
export declare class ZeroSSLError extends Error {
    code: number | undefined;
    details: import("./types").ZeroSSLErrorDetail | undefined;
    status: number;
    type: string | undefined;
    constructor(status: number, data: ZeroSSLErrorData);
}
export declare const ZeroSSLErrorMap: {
    [key: number]: ZeroSSLErrorData;
};
export declare function findZeroSSLError(code: number): ZeroSSLErrorData;
