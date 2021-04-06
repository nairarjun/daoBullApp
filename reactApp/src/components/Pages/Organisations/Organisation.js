import React, { Component } from 'react'
import FinancialsPage from '../Financials/FinancialsPage';
import Voting from './Voting/Voting'
import Shareholder from './Shareholders/Shareholder';
import './Organisation.css'
import EOSIOApi from '../../../common/eosio-apiService';
import Transaction from "./TransactionType/TransactionType";
import { REACT_APP_EOSIO_CONTRACT_ACCOUNT } from "../../../common/config";
import { organisationEditBtnData, sideMenu, upcommingFeautre } from "./organisationData";
import * as actions from "../Redux/Actions";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';
import Loading from '../../Loading/Loading1'

const pageSize = 5

class Organisation extends Component {
    constructor(props) {
        super(props)
        let activeMenuId = 0, activeSubMenu = sideMenu.filter(menu => menu.mainMenu === this.props.match.params.menu)
        if (this.props.match.params.menu && activeSubMenu.length > 0)
            activeMenuId = activeSubMenu[0].id
        this.state = {
            loading: Object.keys(this.props.selectedDAO).length === 0 ? true : false,
            lower_bound: 0,
            activeEosAccountBal: 0,
            unallocatedSharesAmt: 0,
            upper_bound: pageSize - 1,
            activeSubMenu: activeMenuId,
            callShareHolders: true,
            pageSize: pageSize,
            openFundTransaction: false,
            contractAccount: REACT_APP_EOSIO_CONTRACT_ACCOUNT,
            eosio: new EOSIOApi(REACT_APP_EOSIO_CONTRACT_ACCOUNT),
            accountName: props.activeUser && props.activeUser.accountName ? props.activeUser.accountName : '',
            shareHoldersList: [],
            ShareholderList: [
                { account: 'Adamsmith123', balance: 40 },
                { account: 'Alexbeeston7', balance: 40 },
                { account: 'Callumhd2020', balance: 40 },
                { account: 'John Fisher', balance: 40 },
                { account: 'Chris Bidton', balance: 40 }],
            organisationList: this.props.organisationList,
            selectedDAO: this.props.selectedDAO,
            sideMenu,
            upcommingFeautre
        }
    }


    componentDidMount = async () => {
        this.state.sideMenu.map((menu, i) => {
            if (menu.mainMenu === this.props.match.params.menu) {
                this.setState({ activeSubMenu: i })
            }
            return menu;
        })
        if (Object.keys(this.state.selectedDAO).length > 0)
            await this.getShareHolderList(this.state.selectedDAO)
    }

    getShareHolderList = async (selectedDAO) => {
        let shareholders = [],
            shareHoldersList = [],
            unallocatedSharesAmt = 0,
            activeEosAccountBal = 0,
            token = selectedDAO.token.split(' '),
            creatorsList = this.props.creatorsList

        if (creatorsList.length > 0) {
            for (let k = 0; k < creatorsList.length; k++) {
                try {
                    shareholders.push(this.state.eosio.getTableRows('daotokens123', creatorsList[k].scope, 'accounts', 0, creatorsList[k].count, creatorsList[k].count))
                } catch (error) {
                    console.log(error)
                }
                if (k === creatorsList.length - 1) {
                    let shareholdersInfo = await Promise.all(shareholders)
                    for (let i = 0; i < shareholdersInfo.length; i++) {
                        let activeShareholderAccount = shareholdersInfo[i].data.rows
                        if (activeShareholderAccount.length > 0) {
                            for (let l = 0; l < activeShareholderAccount.length; l++) {
                                let bal = (activeShareholderAccount[l].data.balance).split(' ')
                                if (bal[1] === token[1]) {
                                    if (shareholdersInfo[i].scope === 'bigpicturesw') {
                                        unallocatedSharesAmt = Number(bal[0])
                                    }
                                    if (shareholdersInfo[i].scope === localStorage.getItem('activeEosAccount')) {
                                        activeEosAccountBal = Number(bal[0])
                                    }
                                    if (shareholdersInfo[i].scope != 'bigpicturesw')
                                        shareHoldersList.push({ account: shareholdersInfo[i].scope, balance: bal[0] })
                                }

                                if (l === activeShareholderAccount.length - 1 && i === shareholdersInfo.length - 1) {
                                    this.setState({ loading: false, shareHoldersList, unallocatedSharesAmt, activeEosAccountBal })
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.organisationList != this.props.organisationList)
            this.setState({ organisationList: this.props.organisationList })
        if (prevProps.selectedDAO != this.props.selectedDAO) {
            this.setState({ selectedDAO: this.props.selectedDAO })
        }
        if (this.props.match.params.id && this.props.organisationList.length != 0) {
            if (Object.keys(this.props.selectedDAO).length === 0) {
                let selectedDAO = this.props.organisationList.filter(org => String(org.data.id) === this.props.match.params.id)
                if (selectedDAO.length > 0) {
                    await this.props.setSelectedDAO(selectedDAO[0].data)
                    await this.getShareHolderList(selectedDAO[0].data)
                } else {
                    alert(`Dao Doesn't Exits`)
                    // this.props.history.push('/')
                }
            } else if (prevProps.selectedDAO != this.props.selectedDAO) {
                await this.props.setSelectedDAO(this.props.selectedDAO)
                await this.getShareHolderList(this.props.selectedDAO)
            }
        } else {

        }

        // this.setState({ selectedDAO: this.props.selectedDAO })
        if (this.props.activeUser && this.state.accountName != this.props.activeUser.accountName)
            this.setState({ accountName: this.props.activeUser.accountName })
        this.state.sideMenu.map(async (menu, i) => {
            if (menu.mainMenu === this.props.match.params.menu && this.state.activeSubMenu != i) {
                if (this.state.activeSubMenu !== i) {
                    this.setState({ activeSubMenu: i })
                }
            }
            return menu;
        })
    }

    openFundTransaction = () => {
        let openFundTransaction = this.state.openFundTransaction
        this.setState({ openFundTransaction: !openFundTransaction })

    }

    renderSubMenu = () => {
        let { sideMenu, activeSubMenu } = this.state,
            activeSideMenu = sideMenu.filter(menu => menu.mainMenu === this.props.match.params.menu)
        return (
            <div className="DI_Organisation_MainHeader DI_Organisation_SubHeader">
                {activeSideMenu.length > 0 &&
                    activeSideMenu[0].subMenu.map((menu, i) => {
                        return (
                            <div key={i} className="" style={{ display: 'flex' }}>
                                <div
                                    className={`DI_Organisation_SubHeader_Text ${(activeSubMenu === '' && i === 0) || (i === 0) ? 'DI_Organisation_SubHeader_Text_Active' : ''} `}>
                                    {!menu.live && <i className="fa fa-lock" style={{ color: 'white', marginRight: "10px" }}></i>}{menu.name} {!menu.live && <span style={{ fontWeight: 100, marginLeft: "10px", fontSize: '13px' }}>(Coming soon)</span>}</div>
                            </div>)
                    })}
            </div>
        )
    }


    render() {
        let { sideMenu, activeSubMenu, shareHoldersList, unallocatedSharesAmt,
            activeEosAccountBal, selectedDAO, openFundTransaction, show } = this.state,
            loadingStyle = { marginLeft: 'auto', marginRight: 'auto', display: 'block' }
        return (
            <div>
                {localStorage.getItem('activeEosAccount') === null && <Redirect to='/' />}
                {this.state.loading &&
                    <div className="DI_Organisation_Main" style={{ background: 'white', height: '100vh' }}>
                        <Loading styleData={loadingStyle} />
                    </div>}
                {!this.state.loading && sideMenu.map((menu, i) => {
                    return (
                        sideMenu[activeSubMenu].mainMenu === menu.mainMenu &&
                        <div key={i}>
                            <div className="DI_Organisation_Main" >
                                <div className="DI_Organisation_MainHeader">
                                    <div className="DI_Organisation_Title" >{selectedDAO.daoname}</div>
                                    <Transaction
                                        {...{
                                            ...this.props,
                                            ...{ unallocatedSharesAmt, activeEosAccountBal },
                                            ...organisationEditBtnData.filter(obj => obj.type === menu.mainMenu)[0]
                                        }} />
                                </div>
                                {this.renderSubMenu()}
                            </div>
                            {activeSubMenu === 0 && <Shareholder ShareholderList={shareHoldersList} selectedDAO={selectedDAO} unallocatedSharesAmt={unallocatedSharesAmt} />}
                            {activeSubMenu === 2 && <Voting {...this.props} />}
                            {activeSubMenu === 1 && <FinancialsPage />}
                        </div>
                    )
                })}
            </div>
        )

    }
}

function mapStateToProps(state) {
    return {
        selectedDAO: state.organisations.selectedDAO,
        activeEosAccount: state.organisations.activeEosAccount,
        organisationList: state.organisations.organistionList,
        creatorsList: state.organisations.creatorsList,

    };
}
const mapDispatchToProps = dispatch => {
    return {
        setSelectedDAO: (value) => dispatch(actions.setSelectedDAO(value))
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(Organisation);
