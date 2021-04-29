import { JsonRpc } from 'eosjs'
import React, { Component } from 'react';
import OrganisationDatePicker from "../Pages/Organisations/OrganisationDatePicker";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from '../Pages/HomePage/HomePage';
import CreateOrganisation from '../Pages/CreateOrganisation/CreateOrganisation';
import ScrollToTop from '../ScrollToTop/ScrollToTop';
import HeaderLayout from '../layouts/Header/HeaderLayout';
import Landing from '../Pages/LandingPage/Landing';
import SideMenuLayout from "../layouts/SideMenu/SideMenuLayout";
import Organisation from "../Pages/Organisations/Organisation";
import EOSIOApi from '../../common/eosio-apiService';
import * as actions from "../Pages/Redux/Actions/index";
import { connect } from "react-redux";


import { REACT_APP_EOSIO_CONTRACT_ACCOUNT, REACT_APP_EOSIO_ACCOUNT, REACT_APP_EOSIO_HOST, REACT_APP_EOSIO_CHAIN_ID, REACT_APP_EOSIO_PROTOCOL, REACT_APP_EOSIO_PORT } from "../../common/config";


const ourNetwork = {
  chainId: REACT_APP_EOSIO_CHAIN_ID,
  rpcEndpoints: [{ protocol: REACT_APP_EOSIO_PROTOCOL, host: REACT_APP_EOSIO_HOST, port: REACT_APP_EOSIO_PORT }]
}
const contract_account = REACT_APP_EOSIO_ACCOUNT;
const defaultState = {
  activeUser: null,
  accountName: '',
  eosio: new EOSIOApi(REACT_APP_EOSIO_CONTRACT_ACCOUNT),
};

class DecentralizeApp extends Component {

  constructor(props) {
    super(props)
    this.state = {
      ...defaultState,
      creatorsList: [],
      daoList: [],
      daotokensList: [],
      totalVotings: 0,
      rpc: new JsonRpc(`${ourNetwork.rpcEndpoints[0].protocol}://${ourNetwork.rpcEndpoints[0].host}${ourNetwork.rpcEndpoints[0].port !== "" ? ":" : ""}${ourNetwork.rpcEndpoints[0].port}`),
    }
  }
  componentDidMount = () => {
  }
  componentDidUpdate = async () => {
    const { ual: { activeUser } } = this.props
    if (activeUser && !this.state.activeUser) {
      await this.updateAccountName(activeUser)
    } else if (!activeUser && this.state.activeUser) {
      this.setState(defaultState)
    }
  }

  updateAccountName = async (activeUser) => {
    try {
      const accountName = await activeUser.getAccountName()
      localStorage.setItem('activeEosAccount', accountName)
      await this.props.setActiveEosAccount(accountName)
      this.setState({ activeUser, accountName })
      let totalVotings = 0,
        tokenprp = await this.state.eosio.getTableScope('bigpicturesw', 'tokenprp', 'bigpicturesw'),
        votingprp = await this.state.eosio.getTableScope('bigpicturesw', 'votingprp', 'bigpicturesw')

      if (tokenprp.rows && tokenprp.rows.length > 0) {
        for (var i = 0; i < tokenprp.rows.length; i++)
          totalVotings += tokenprp.rows[i].count;
      }

      if (votingprp.rows && votingprp.rows.length > 0) {
        for (var i = 0; i < votingprp.rows.length; i++)
          totalVotings += votingprp.rows[i].count;
      }

      let totalData = 0,
        creators = await this.state.eosio.getTableScope('daotokens123', 'accounts', 'bigpicturesw')
      let daotokensList = {}
      if (creators.rows && creators.rows.length > 0) {
        let creatorsCount = creators.rows.filter(obj => obj.scope === accountName)
        daotokensList = await this.state.eosio.getTableRows('daotokens123', accountName, 'accounts', 0, creatorsCount[0].count, creatorsCount[0].count)
        for (var i = 0; i < creators.rows.length; i++)
          totalData += creators.rows[i].count;
        await this.props.setCreatorsList(creators.rows)
      }
      if (Object.keys(daotokensList).length > 0 && daotokensList.data.rows && daotokensList.data.rows.length > 0) {
        for (var i = 0; i < daotokensList.data.rows.length; i++)
          await this.props.setDaotokensList(daotokensList.data.rows)
      }
      let daoList = {}
      if (totalData > 0) {
        daoList = await this.state.eosio.getTableRows(REACT_APP_EOSIO_CONTRACT_ACCOUNT, 'bigpicturesw', 'dao', 0, totalData, totalData)
        await this.props.setOrganisationList(daoList.data.rows)
      }
      this.setState({
        accountName,
        totalVotings,
        creatorsList: creators.rows && creators.rows,
        daoList: daoList.data.rows && daoList.data.rows,
        daotokensList: daotokensList.data && daotokensList.data.rows && daotokensList.data.rows
      }, this.updateAccountBalance)
    } catch (e) {
      console.log(e)
      console.warn(e)
    }
  }

  render() {
    const { ual: { activeUser } } = this.props
    const { accountName, daoList, creatorsList, daotokensList, totalVotings } = this.state
    let propsData = {
      accountName, activeUser, ual: this.props.ual, daoList, creatorsList, daotokensList, totalVotings
    }
    return (
      <div className="DecentralizeApp_main">
        <Router >
          <ScrollToTop>
            <Switch>
              <Route exact path="/updateMe" render={() => <Landing />} />
              <Route exact path="/organisation/:menu/:id" render={(props) => <SideMenuLayout {...propsData}><Organisation {...{ ...props, ...propsData }} /></SideMenuLayout>} />
              <Route exact path="/" render={() => <HeaderLayout {...propsData} ><HomePage /></HeaderLayout>} />
              <Route exact path="/CreateOrganisation"
                render={(props) => <HeaderLayout {...propsData} ><CreateOrganisation {...{ ...props, ...propsData }} />
                </HeaderLayout>} />
            </Switch>
          </ScrollToTop>
        </Router>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    organisationList: state.organisations.organistionList,
    creatorsList: state.organisations.creatorsList,
    daotokensList: state.organisations.daotokensList,
    selectedDAO: state.organisations.selectedDAO,
    activeEosAccount: state.organisations.activeEosAccount
  };
}
const mapDispatchToProps = dispatch => {
  return {
    setDaotokensList: (value) => dispatch(actions.setDaotokensList(value)),
    setCreatorsList: (value) => dispatch(actions.setCreatorsList(value)),
    setOrganisationList: (value) => dispatch(actions.setOrganisationList(value)),
    setActiveEosAccount: (value) => dispatch(actions.setActiveEosAccount(value))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(DecentralizeApp);