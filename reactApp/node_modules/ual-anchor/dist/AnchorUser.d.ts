import { SignTransactionResponse, User } from 'universal-authenticator-library';
import { APIClient } from '@greymass/eosio';
import { JsonRpc } from 'eosjs';
export declare class AnchorUser extends User {
    client: APIClient;
    rpc: JsonRpc;
    session: any;
    signerKey?: string;
    signerProof?: string;
    signerRequest?: any;
    private signatureProvider;
    private chainId;
    private accountName;
    private requestPermission;
    constructor(rpc: any, client: any, identity: any);
    objectify(data: any): any;
    signTransaction(transaction: any, options: any): Promise<SignTransactionResponse>;
    signArbitrary(publicKey: string, data: string, _: string): Promise<string>;
    verifyKeyOwnership(challenge: string): Promise<boolean>;
    getAccountName(): Promise<string>;
    getChainId(): Promise<string>;
    getKeys(): Promise<any>;
    isAccountValid(): Promise<boolean>;
    extractAccountKeys(account: any): never[];
}
