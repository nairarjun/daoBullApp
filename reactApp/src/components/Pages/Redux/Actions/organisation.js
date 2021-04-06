import * as actionTypes from './actionTypes'

export const setOrganisationList = value => {
    return {
        type : actionTypes.SET_ORGANISATION_LIST,
        payLoad : value
    }
};

export const setSelectedDAO = value => {
    return {
        type : actionTypes.SET_DAO,
        payLoad : value
    }
};

export const setCreatorsList = value => {
    return {
        type : actionTypes.SET_CREATORS_LIST,
        payLoad : value
    }
};

export const setActiveEosAccount = value => {
    return {
        type : actionTypes.SET_ACTIVE_EOS_ACCOUNT,
        payLoad : value
    }
};

export const setDaotokensList = value => {
    return {
        type : actionTypes.SET_DAOTOKENS_LIST,
        payLoad : value
    }
};
