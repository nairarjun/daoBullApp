import * as React from 'react';
import './CreateOrganisation.css'
import Loading from '../../Loading/Loading';
import EOSIOApi from '../../../common/eosio-apiService';
import config from '../../../common/config'
import { withRouter } from "react-router-dom";
import WalletList from "../../WalletList/WalletList";
import * as actions from "../Redux/Actions/index";
import { connect } from "react-redux";
import { REACT_APP_EOSIO_CONTRACT_ACCOUNT } from "../../../common/config";
import CommonTooltip from '../../Tooltip/CommonTooltip';

const lastStep = 6;

const defultEditVoteConfiguration = {
    supportVote: 50,
    minimalApproval: 0,
    voteDayDuration: 1,
    voteHourDuration: 0,
    voteMinDuration: 0,
}
class CreateOrganisation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            step: props.activeUser ? 3 : 1,
            loading: false,
            shareHolderCount: 1,
            activeUser: null,
            errMsg: '',
            eosio: new EOSIOApi(config.REACT_APP_EOSIO_CONTRACT_ACCOUNT, this.props.activeUser),
            accountName: props.accountName && props.accountName ? props.accountName : '',
            shareHoldersinfo: { shareholderName: '', amount: '', symbol: '', errMsg: '' },
            shareHoldersAccount: [{ shareholderAccount: '', balance: '', errMsg: '', balanceError: '' }],
            selectedOrganisation: '',
            defaultOrganisation: 'Forest Fund',
            editVoteConfiguration: {
                ...defultEditVoteConfiguration
            },
            supportVoteErrorInput: '',
            isEditClick: false,
            votingConfiguration: [
                { name: 'Support %', subName: "(alpha version default 50%)", locked: true, errMsg: '', values: [{ value: 10, abbrevation: '%', name: 'supportVote' }] },
                { name: 'Minimal Approval %', subName: '(alpha version default 0%)', locked: true, errMsg: '', values: [{ value: 10, abbrevation: '%', name: 'minimalApproval', errMsg: '' }] },
                {
                    name: 'Vote Duration', locked: false, errMsg: '', values: [
                        { value: 1, abbrevation: ' Day', name: 'voteDayDuration', errMsg: '' },
                        { value: 0, abbrevation: ' Hours', name: 'voteHourDuration', errMsg: '' },
                        { value: 0, abbrevation: ' Mins', name: 'voteMinDuration', errMsg: '' }]
                }],
            setUpData: ['Name', 'Voting', 'Shareholders']
        }
    }

    componentDidMount() {
    }

    componentDidUpdate() {
        if (this.props.activeUser && this.state.activeUser !== this.props.activeUser) {
            this.setState({ step: 3, activeUser: this.props.activeUser })
        }
    }

    createOrganisation = async () => {
        let { accountName } = this.props
        let { selectedOrganisation, editVoteConfiguration, shareHoldersinfo, shareHoldersAccount } = this.state,
            { voteDayDuration, voteHourDuration, voteMinDuration } = editVoteConfiguration,
            minutesvote = voteDayDuration * 24 * 60 + voteHourDuration * 60 + voteMinDuration;
        let data = {
            creator: accountName,
            daoname: selectedOrganisation,
            support: editVoteConfiguration.supportVote,
            minsupport: editVoteConfiguration.minimalApproval,
            minutesvote,
            token: (`${shareHoldersinfo.amount} `).concat(shareHoldersinfo.symbol),
            users: shareHoldersAccount.map(value => value.shareholderAccount),
            balances: shareHoldersAccount.map(value => value.balance)

        }
        this.setState({ step: 0, loading: true, isEditClick: false })
        try {
            let createdaoData = await new EOSIOApi(config.REACT_APP_EOSIO_CONTRACT_ACCOUNT, this.props.activeUser).transaction(accountName, 'createdao', { ...data })
            if (createdaoData.isError) {
                this.setState({ loading: false, step: 6 })
            } else {
                let creators = await this.state.eosio.getTableScope('daotokens123', 'accounts', 'bigpicturesw')
                let totalData = 0
                if (creators.rows && creators.rows.length > 0) {
                    for (var i = 0; i < creators.rows.length; i++)
                        totalData += creators.rows[i].count;
                    await this.props.setCreatorsList(creators.rows)
                }
                let daoList = await this.state.eosio.getTableRows(config.REACT_APP_EOSIO_CONTRACT_ACCOUNT, 'bigpicturesw', 'dao', 0, totalData, totalData)
                let newSelectedDAO = []
                await this.props.setOrganisationList(daoList.data.rows)
                if (daoList.data && daoList.data.rows && daoList.data.rows.length > 0) {
                    newSelectedDAO = daoList.data.rows.filter(obj => obj.data.daoname === selectedOrganisation)
                }
                if (newSelectedDAO.length > 0)
                    this.props.history.push(`/organisation/Shareholeders/${newSelectedDAO[0].data.id}`)
                else
                    this.props.history.push('/')
            }

        } catch (err) {
            alert(err)
            this.props.history.push('/')
        }
    }

    setOrganisation = () => {
        return (
            <div className="organisationHeading">
                <div className='card-heading'>Creating Organisation</div>
                <Loading />
            </div>
        )
    }

    editVotingConfig = (event, key, symbol) => {
        let editVoteConfiguration = this.state.editVoteConfiguration
        editVoteConfiguration[key] = event.target.value === '' ? defultEditVoteConfiguration[key] : Number(event.target.value)
        this.setState({ editVoteConfiguration: editVoteConfiguration })
    }

    selectOrganisation = (event, value) => {
        this.setState({ selectedOrganisation: event.target.value, errMsg: event.target.value !== '' && '' })
    }

    next = (stateName) => {
        let { step, selectedOrganisation, errMsg = '', votingConfiguration, supportVoteErrorInput = '', shareHoldersinfo, shareHoldersAccount, isError = false } = this.state
        let cloneVotingConfig = [
            { name: 'Support %', subName: "(alpha version default 50%)", locked: true, errMsg: '', values: [{ value: this.state.editVoteConfiguration.supportVote, abbrevation: '%', name: 'supportVote' }] },
            { name: 'Minimal Approval %', subName: '(alpha version default 0%)', locked: true, errMsg: '', values: [{ value: this.state.editVoteConfiguration.minimalApproval, abbrevation: '%', name: 'minimalApproval', errMsg: '' }] },
            {
                name: 'Vote Duration', locked: false, errMsg: '', values: [
                    { value: this.state.editVoteConfiguration.voteDayDuration, abbrevation: ' Day', name: 'voteDayDuration', errMsg: '' },
                    { value: this.state.editVoteConfiguration.voteHourDuration, abbrevation: ' Hours', name: 'voteHourDuration', errMsg: '' },
                    { value: this.state.editVoteConfiguration.voteMinDuration, abbrevation: ' Mins', name: 'voteMinDuration', errMsg: '' }]
            }]
        if (stateName === 'selectedOrganisation') {
            if (selectedOrganisation === '' || selectedOrganisation.length < 5) {
                errMsg = 'Organisation name must be greater than or equal 5 characters.'
                isError = true
            } else if (this.props.daoList.filter((dao) => (dao.data.daoname).toUpperCase().trim() === selectedOrganisation.toUpperCase().trim()).length > 0) {
                errMsg = 'Organisation name already exits'
                isError = true
            } else if (selectedOrganisation.match(/^\d/)) {
                errMsg = `Organisation name can't start with number`
                isError = true
            }
        } else if (stateName === 'votingConfiguration') {
            if (this.state.editVoteConfiguration.supportVote < this.state.editVoteConfiguration.minimalApproval) {
                errMsg = 'Support % should be equal or more than minimal qpproval'
                cloneVotingConfig.filter((obj) => obj.name === 'Support %')[0].errMsg = errMsg
                isError = true
            } else if (this.state.editVoteConfiguration.supportVote > this.state.editVoteConfiguration.minimalApproval) {
                errMsg = ''
                cloneVotingConfig.filter((obj) => obj.name === 'Support %')[0].errMsg = errMsg
            }
            if (this.state.editVoteConfiguration.voteDayDuration === 0
                && this.state.editVoteConfiguration.voteHourDuration === 0
                && this.state.editVoteConfiguration.voteMinDuration === 0) {
                errMsg = `Vote duration can't be 0`
                cloneVotingConfig.filter((obj) => obj.name === 'Vote Duration')[0].errMsg = errMsg
                isError = true
            } else {
                errMsg = ''
                cloneVotingConfig.filter((obj) => obj.name === 'Vote Duration')[0].errMsg = errMsg
            }
        } else if (stateName === 'Configure Shareholders') {
            if (shareHoldersinfo.amount === '') {
                shareHoldersinfo.amountErrMsg = 'Please add amount'
                isError = true
            } else {
                shareHoldersinfo.amountErrMsg = ''
            }
            if (shareHoldersinfo.symbol === '' || shareHoldersinfo.symbol.length > 7 || /^[A-Z]+$/gm.exec(shareHoldersinfo.symbol) === null) {
                shareHoldersinfo.symbolErrMsg = 'Symbol is an all uppercase string of 7 or less characters from [A-Z] '
                isError = true
            } else {
                shareHoldersinfo.symbolErrMsg = ''
            }

            for (let i = 0; i < shareHoldersAccount.length; i++) {
                const regex = /[^a-z0-5]/gm;
                var regex1 = new RegExp('(\\d+(?:\\.\\d+)?\\s' + shareHoldersinfo.symbol + ')')
                if (!(regex1.exec(shareHoldersAccount[i].balance))) {
                    isError = true
                    shareHoldersAccount[i].balanceError = `Balance:100 ${shareHoldersinfo.symbol}`
                } else {
                    shareHoldersAccount[i].errMsg = ''
                }
                if (shareHoldersAccount[i].shareholderAccount.length < 12 || regex.exec(shareHoldersAccount[i].shareholderAccount) != null || shareHoldersAccount[i].shareholderAccount.length > 14 || shareHoldersAccount[i].shareholderAccount === '') {
                    isError = true
                    shareHoldersAccount[i].errMsg = 'Account names must be 12 characters long and only include the characters 12345abcdefghijklmnopqrstuvwxyz'
                } else {
                    shareHoldersAccount[i].errMsg = ''
                }
            }
        }
        this.setState({
            step: isError ? step : this.state.isEditClick ? lastStep : step + 1,
            errMsg: isError ? errMsg : '',
            supportVoteErrorInput,
            shareHoldersinfo,
            shareHoldersAccount,
            votingConfiguration: cloneVotingConfig
        })
    }

    addMoreShares = () => {
        let shareHoldersAccount = this.state.shareHoldersAccount
        shareHoldersAccount.push({ shareholderAccount: '', balance: '', balanceError: '', errMsg: '' })
        let shareHolderCount = this.state.shareHolderCount
        this.setState({ shareHolderCount: shareHolderCount + 1, shareHoldersAccount })
    }

    onShareNameChange = (event, value, contentType, i) => {
        let shareHoldersinfo = this.state.shareHoldersinfo
        shareHoldersinfo[contentType] = (event.target.value).trim()
        this.setState({ shareHoldersinfo })
    }

    onShareNameAccountChange = (event, value, contentType, i) => {
        let shareHoldersAccount = this.state.shareHoldersAccount
        shareHoldersAccount[i][contentType] = event.target.value
        if (shareHoldersAccount[i].errMsg !== '' && event.target.value !== '')
            shareHoldersAccount[i].errMsg = ''
        if (shareHoldersAccount[i].balanceError !== '' && event.target.value !== '')
            shareHoldersAccount[i].balanceError = ''
        this.setState({ shareHoldersAccount })
    }


    renderStepOne = () => {
        return <div>
            <div className='card-heading'>Connect Wallet</div>
            <div className='card-description'>To create an organisation you need to connect your EOS account, please click connect below and follow the instruction to connect.</div>
            <button className="organisation-btn organisation-connectbtn" onClick={() => this.setState({ step: 2 })}>
                {/* <i className="fa fa-copy connectBtnIcon"></i> */}
                Connect</button>
            <div className="card-bottom">
                <div className="card-bottom-container">
                    <i className="fa fa-lock lock"></i><span className="card-bottom-container-heading">Create Wallet (Coming soon) </span>
                    <div className="card-bottom-container-summary">
                        We’re working on a simplfied sign up experience for none blockchain users, check back soon for an update.
                    </div>
                </div>
            </div>
        </div>
    }

    renderStepThree = () => {
        let { selectedOrganisation, errMsg } = this.state
        return <div>
            <div className='card-heading'>Organisation Name</div>
            <div className='Organisations'>Name</div>
            <input type="text" value={selectedOrganisation} className='organisations-TextBox'
                onChange={(event, value) => { this.selectOrganisation(event, value) }}
                placeholder={selectedOrganisation === '' ? 'Select Organisation Name…' : selectedOrganisation} />
            <div className="errMsg">{errMsg}</div>
            <button className="organisation-btn next-btn" onClick={() => this.next('selectedOrganisation')}>Next</button>
        </div>

    }

    renderStepFour = () => {
        let { votingConfiguration, errMsg } = this.state
        return <div>
            <div className='card-heading'>Configure Voting</div>
            <div className='voting-subInfo'>Edit at a later date within voting settings.</div>
            {votingConfiguration.map((config, i) => {
                return (<span key={i}>
                    <div className="voting-txt">{config.locked === true ? <i className="fa fa-lock"></i> : null}&nbsp;{config.name} {config.subName} <i data-tip data-for={`CO_config_${config.name}_Id`} className="fas fa-question-circle toolTipQuestion"></i>
                        <CommonTooltip tooltipId={`CO_config_${config.name}_Id`} tooltipName={config.name}></CommonTooltip>
                    </div>
                    <span className="voting-value-box">
                        {config.values.map((data, k) => {
                            return (
                                <div className={`${data.abbrevation} observtion-suffix`} key={k} >
                                    <input
                                        type="Number"
                                        disabled={config.locked}
                                        className={`voting-value ${data.abbrevation}`}
                                        // value={`${this.state.editVoteConfiguration[data.name]}${data.abbrevation}`}
                                        key={k}
                                        placeholder={`${data.value}${data.abbrevation}`}
                                        onChange={(event) => this.editVotingConfig(event, data.name, data.abbrevation)} />

                                </div>
                            )
                        })}
                    </span>
                    {config.errMsg != '' && <div className="errMsg" style={{ marginBottom: '29px', marginTop: '-22px' }}>{config.errMsg}</div>}

                </span>)
            })}
            <div style={{ display: 'flex', marginTop: '-32px' }}>
                <button className="organisation-btn next-btn voting-next-btn" onClick={() => this.next('votingConfiguration')}>Next</button>
                <button className="organisation-btn next-btn voting-next-btn returnBtn"
                    onClick={() => this.setState({ step: 3 })} >Return</button>
            </div>
        </div>

    }
    onChangeOfAmtShares = (e) => {

    }

    onChangeOfSymbol = (e) => {

    }

    shareHolderFormFromat = () => {
        let shareHoldersList = []
        for (let i = 0; i < this.state.shareHolderCount; i++) {
            shareHoldersList.push(
                <span key={i}>
                    {i === 0 &&
                        <span>
                            <div className="flexContainer">

                                <div className='share-col-1' style={{ width: '160px' }}>Amount of Shares <i data-tip data-for="CO_Amount_Of_Shares_Id" className="fas fa-question-circle toolTipQuestion"></i>
                                    <CommonTooltip tooltipId="CO_Amount_Of_Shares_Id" tooltipName="Amount of Shares"></CommonTooltip>
                                </div>
                                <div className='share-col-2' >Symbol <i data-tip data-for="CO_Symbol_Id" className="fas fa-question-circle toolTipQuestion">
                                    <CommonTooltip tooltipId="CO_Symbol_Id" tooltipName="Symbol"></CommonTooltip>
                                </i></div>
                            </div>


                            <div className="flexContainer">
                                <input type="text"
                                    style={{ width: '160px' }}
                                    type="Number"
                                    className='organisations-TextBox org-txtBox-col-1'
                                    onChange={(event, newValue) => this.onShareNameChange(event, newValue, 'amount', i)}
                                    value={this.state.shareHoldersinfo.amount}
                                    placeholder={'eg: 100,000'} />

                                <input type="text"
                                    value={this.state.shareHoldersinfo.symbol}
                                    className='organisations-TextBox org-txtBox-col-2'
                                    onChange={(event, newValue) => this.onShareNameChange(event, newValue, 'symbol', i)}
                                    placeholder={'eg: ABC'} />

                            </div>
                            <div className="flexContainer" style={{ marginBottom: '10px', marginTop: '-20px' }}>
                                <div className="errMsg" style={{ marginBottom: '0px', width: '160px', marginRight: '16px' }}>{this.state.shareHoldersinfo.amountErrMsg}</div>
                                <div className="errMsg" style={{ marginBottom: '0px' }}>{this.state.shareHoldersinfo.symbolErrMsg}</div>
                            </div>

                        </span>
                    }
                    <div className="flexContainer">
                        <div className='share-col-1'>Shareholders <i data-tip data-for="CO_Shareholders_Id" className="fas fa-question-circle toolTipQuestion"></i>
                            <CommonTooltip tooltipId="CO_Shareholders_Id" tooltipName="Shareholders"></CommonTooltip>
                        </div>
                        <div className='share-col-2'>Balances <i data-tip data-for="CO_Balances_Id" className="fas fa-question-circle toolTipQuestion"></i>
                            <CommonTooltip tooltipId="CO_Balances_Id" tooltipName="Balances"></CommonTooltip>
                        </div>
                    </div>
                    <div className="flexContainer">
                        <div className="errMsg" style={{ marginBottom: '0px', width: '424px', marginRight: '16px' }}>{this.state.shareHoldersAccount[i].errMsg}</div>
                        <div className="errMsg" style={{ marginBottom: '0px', width: '100px' }}>{this.state.shareHoldersAccount[i].balanceError}</div>
                    </div>
                    <div className="flexContainer">
                        <input type="text"
                            className='organisations-TextBox org-txtBox-col-1'
                            value={this.state.shareHoldersAccount[i].shareholderAccount}
                            onChange={(event, newValue) => this.onShareNameAccountChange(event, newValue, 'shareholderAccount', i)}
                            placeholder={'Enter EOS Account Name'} />

                        <input type="text"
                            className='organisations-TextBox org-txtBox-col-2'
                            value={this.state.shareHoldersAccount[i].balance}
                            onChange={(event, newValue) => this.onShareNameAccountChange(event, newValue, 'balance', i)}
                            placeholder={'-'} />

                    </div>
                </span>
            )
        }
        return shareHoldersList
    }

    renderStepFive = () => {
        return <div>
            <div className='card-heading'>Configure Shareholders</div>
            <div className='voting-subInfo'>Edit at a later date within shareholder settings.</div>
            {this.shareHolderFormFromat()}
            {/* {this.state.addMore === 1 && this.shareHolderFormFromat()} */}
            <button className="organisation-btn next-btn addMore-share-btn" onClick={this.addMoreShares}>Add More</button>
            <div style={{ display: 'flex' }}>
                <button className="organisation-btn next-btn voting-next-btn"
                    onClick={() => this.next('Configure Shareholders')} >Next</button>

                <button className="organisation-btn next-btn voting-next-btn returnBtn"
                    onClick={() => this.setState({ step: 4 })} >Return</button>
            </div>
        </div>

    }

    renderStepSix = () => {
        let setUpData = this.state.setUpData
        return <div>
            <div className='card-heading'>Confirm Setup</div>
            <div className='voting-subInfo'>Check your set up & continue when you’re ready.</div>
            {setUpData.map((obj, i) => {
                return (<div className='organisations-TextBox confirmSetup' key={i}>{obj}
                    <span onClick={() => {
                        if (i === 0) {
                            this.setState({ step: 3, isEditClick: true });
                        } else if (i === 1) {
                            this.setState({ step: 4, isEditClick: true });
                        } else {
                            this.setState({ step: 5, isEditClick: true });
                        }
                    }} className="editSetup">Edit</span>
                </div>)
            })}
            <button className="organisation-btn next-btn setup-next-btn" onClick={this.createOrganisation}>Create Organisation</button>
        </div>

    }

    render() {
        let { step } = this.state
        return (
            <div className='cardContainer' style={{ backgroundColor: 'rgb(246, 246, 246)' }}>
                <div className="card">
                    {step !== 0 &&
                        <div className="item">
                            <span className="notify-badge">{step === 6 ? 'Review' : `Step ${step} of 5`}</span>
                        </div>}

                    <div className="Orgnisation-container">
                        {step === 1 && this.renderStepOne()}
                        {step === 2 && <WalletList {...this.props} />}
                        {step === 3 && this.renderStepThree()}
                        {step === 4 && this.renderStepFour()}
                        {step === 5 && this.renderStepFive()}
                        {step === 6 && this.renderStepSix()}
                        {step === 0 && this.setOrganisation()}
                    </div>

                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setDaotokensList: (value) => dispatch(actions.setDaotokensList(value)),
        setCreatorsList: (value) => dispatch(actions.setCreatorsList(value)),
        setOrganisationList: (value) => dispatch(actions.setOrganisationList(value)),
        setActiveEosAccount: (value) => dispatch(actions.setActiveEosAccount(value))
    }
};


export default withRouter(connect(null, mapDispatchToProps)(CreateOrganisation));