import { combineReducers } from 'redux';
import organisationReducer from './organisationReducer';


const rootReducer = combineReducers({
   organisations: organisationReducer
});

export default rootReducer;
