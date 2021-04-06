import * as actionTypes from '../Actions/actionTypes';

const initialState = {
    organistionList: [],
    creatorsList: [],
    selectedDAO: {},
    activeEosAccount: '',
    daotokensList: []
};

const setActiveEosAccount = (state, action) => {
    return {
        ...state,
        activeEosAccount: action,
    }
}

const setOrganisationList = (state, action) => {
    return {
        ...state,
        organistionList: action,
    }
}

const setCreatorsList = (state, action) => {
    return {
        ...state,
        creatorsList: action,
    }
}

const setDaotokensList = (state, action) => {
    return {
        ...state,
        daotokensList: action,
    }
}

const setSelectedDAO = (state, action) => {
    return {
        ...state,
        selectedDAO: action,
    }
}


const organisationReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_ORGANISATION_LIST:
            return setOrganisationList(state, action.payLoad)
        case actionTypes.SET_CREATORS_LIST:
            return setCreatorsList(state, action.payLoad)
        case actionTypes.SET_DAO:
            return setSelectedDAO(state, action.payLoad)
        case actionTypes.SET_ACTIVE_EOS_ACCOUNT:
            return setActiveEosAccount(state, action.payLoad)
        case actionTypes.SET_DAOTOKENS_LIST:
            return setDaotokensList(state, action.payLoad)
        default:
            return state;
    }
};

export default organisationReducer;