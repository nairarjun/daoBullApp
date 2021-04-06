import { UALError, UALErrorType } from 'universal-authenticator-library';
import { APIError } from '@greymass/eosio';
export declare class UALAnchorError extends UALError {
    constructor(message: string, type: UALErrorType, cause: APIError | null);
}
