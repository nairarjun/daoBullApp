import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import './TransactionFund.css'
import { Modal } from "react-bootstrap";
import { REACT_APP_EOSIO_CONTRACT_ACCOUNT } from "../../../../common/config";
import CommonTooltip from '../../../Tooltip/CommonTooltip';


function TransactionFund(props) {
    const [shareHolderCount, addShareHolderCount] = useState(1);
    const [shareHoldersAccount, addShareHoldersAccount] = useState([
        {
            shareholderAccount: '',
            balance: '',
            balanceError: '',
            errMsg: ''
        }]);

    let insufititentBalance = false,
        subHeading = props.openFundModalDtls.subHeading

    if (props.openFundModalDtls.subHeading.includes('9900')) {
        if (props.unallocatedSharesAmt === 0)
            insufititentBalance = true
        subHeading = subHeading.replace('9900', props.unallocatedSharesAmt)
    } if (props.openFundModalDtls.subHeading.includes('20 FRST')) {
        if (props.activeEosAccountBal === 0)
            insufititentBalance = true
        subHeading = subHeading.replace('20 FRST', `${props.activeEosAccountBal} FRST`).replace("#activeEosAccountBal#", localStorage.getItem('activeEosAccount'))
    }

    const shareHolderFormFromat = () => {
        let shareHoldersList = []
        for (let i = 0; i < shareHolderCount; i++) {
            shareHoldersList.push(
                <span key={i}>
                    <div className="flexContainer">
                        <div className="errMsg" style={{ marginBottom: '0px', width: '424px', marginRight: '16px' }}>{shareHoldersAccount[i].errMsg}</div>
                        <div className="errMsg" style={{ marginBottom: '0px', width: '100px' }}>{shareHoldersAccount[i].balanceError}</div>
                    </div>
                    <div className="flexContainer">
                        <input type="text"
                            className='organisations-TextBox org-txtBox-col-1'
                            onChange={(event, newValue) => onShareNameAccountChange(event, newValue, 'shareholderAccount', i)}
                            placeholder={props.openFundModalDtls.placeholder} />
                        <input type="text"
                            className='organisations-TextBox org-txtBox-col-2'
                            onChange={(event, newValue) => onShareNameAccountChange(event, newValue, 'balance', i)}
                            placeholder={'-'} />
                    </div>
                </span>
            )
        }
        return shareHoldersList
    }


    const addMoreShares = () => {
        shareHoldersAccount.push({ shareholderAccount: '', balance: '' })
        addShareHolderCount(shareHolderCount + 1)
        addShareHoldersAccount(shareHoldersAccount)
    }

    const onShareNameAccountChange = (event, value, contentType, i) => {
        shareHoldersAccount[i][contentType] = event.target.value
        if (shareHoldersAccount[i].errMsg !== '' && event.target.value !== '')
            shareHoldersAccount[i].errMsg = ''
        if (shareHoldersAccount[i].balanceError !== '' && event.target.value !== '')
            shareHoldersAccount[i].balanceError = ''
        addShareHoldersAccount(shareHoldersAccount)
    }


    const transfer = (index) => {
        let isError = false,
            token = props.selectedDAO.token.split(' ')[1],
            myshareHoldersAccount = JSON.parse(JSON.stringify(shareHoldersAccount))

        for (let i = 0; i < myshareHoldersAccount.length; i++) {
            const regex = /[^a-z0-5]/gm;
            var regex1 = new RegExp('(\\d+(?:\\.\\d+)?\\s' + token + ')')
            if (!(regex1.exec(myshareHoldersAccount[i].balance))) {
                isError = true
                myshareHoldersAccount[i].balanceError = `Symbol:${token}`
            } else if (myshareHoldersAccount[i].balance.split(' ')[0] > props.activeEosAccountBal) {
                isError = true
                myshareHoldersAccount[i].balanceError = 'overdrawn balance'
            } else {
                myshareHoldersAccount[i].balanceError = ''
            }

            if (regex.exec(myshareHoldersAccount[i].shareholderAccount) != null || myshareHoldersAccount[i].shareholderAccount.length < 12 || regex.exec(myshareHoldersAccount[i].shareholderAccount) != null || myshareHoldersAccount[i].shareholderAccount.length > 14 || myshareHoldersAccount[i].shareholderAccount === '') {
                isError = true
                myshareHoldersAccount[i].errMsg = 'Account names must be 12 characters long and only include the characters 12345abcdefghijklmnopqrstuvwxyz'
            } else if (myshareHoldersAccount[i].shareholderAccount === props.activeEosAccount) {
                isError = true
                myshareHoldersAccount[i].errMsg = `Cann't transfer to self`

            } else {
                myshareHoldersAccount[i].errMsg = ''
            }
        }
        if (isError) {
            addShareHoldersAccount(myshareHoldersAccount)
        } else {
            addShareHoldersAccount(myshareHoldersAccount)
            props.transferToken(myshareHoldersAccount, index)
        }
    }

    return (
        <>
            <Modal show={props.show} onHide={props.handleClose} animation={false}>
                <Modal.Header>
                    <Modal.Title>{props.openFundModalDtls.heading}</Modal.Title>
                    <div className="modal-close" onClick={props.handleClose}> <i className="fa fa-close DI-close"></i></div>
                </Modal.Header>
                <div className="modal-subheader">{subHeading}</div>
                {insufititentBalance && <div style={{ color: 'red', fontSize: '10px' }}> Insuffitient Shares</div>}
                <Modal.Body>
                    <div className="flexContainer">
                        <div className='share-col-1 fundtransfer-account'>{props.openFundModalDtls.fund} <i data-tip data-for="CO_TF_Shareholder_Id" className="fas fa-question-circle toolTipQuestion"></i>
                            <CommonTooltip tooltipId="CO_TF_Shareholder_Id" tooltipName="Shareholders"></CommonTooltip>
                        </div>
                        <div className='share-col-2'>Balances  <i data-tip data-for="CO_TF_Balances_Id" className="fas fa-question-circle toolTipQuestion"></i>
                            <CommonTooltip tooltipId="CO_TF_Balances_Id" tooltipName="Balances"></CommonTooltip>
                        </div>
                    </div>
                    <div className="errMsg" style={{ marginBottom: '0px' }}></div>
                    {shareHolderFormFromat()}
                    <button className="organisation-btn next-btn addMore-share-btn addMore-fundTransfer-btn"
                        onClick={addMoreShares} disabled={insufititentBalance} >Add More</button>
                    <button className="fundtransfer-btn" onClick={() => transfer(props.openFundModalDtls.index)} disabled={insufititentBalance}>{props.openFundModalDtls.btn}</button>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default withRouter(TransactionFund);