"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UALAnchorError = void 0;
const universal_authenticator_library_1 = require("universal-authenticator-library");
const interfaces_1 = require("./interfaces");
class UALAnchorError extends universal_authenticator_library_1.UALError {
    constructor(message, type, cause) {
        // Hackery to mimic an eosjs error using @greymass/eosio
        let m = message;
        let e = new Error(message);
        if (cause) {
            if (cause.details && cause.details[0]) {
                m = cause.details[0].message;
                e = new Error(cause.details[0].message);
            }
            e.json = {
                code: 500,
                error: cause.error,
                message: 'Internal Service Error'
            };
        }
        super(m, type, e, interfaces_1.Name);
    }
}
exports.UALAnchorError = UALAnchorError;
