import React, { useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';
import './TransactionType.css'
import EOSIOApi from '../../../../common/eosio-apiService';
import config from '../../../../common/config'
import TransactionFund from '../TransactionFund/TransactionFund'
import VotingModal from "../VotingModal/VotingModal";

function TransactionType(props) {
    const eosio = new EOSIOApi(config.REACT_APP_EOSIO_CONTRACT_ACCOUNT, props.activeUser)
    const eosioDaoToken = new EOSIOApi('daotokens123', props.activeUser)

    const [proposeVotes, setVroposeVotes] = useState(null);
    const [clickedOpenModal, setclickedOpenModal] = useState(false);
    const [clickedSubModal, setclickedSubModal] = useState(false);
    const [modalData, setcModalData] = useState({});
    const [votingmodal, setVotingModal] = useState(false);
    const myRef = useRef();

    const handleClickOutside = e => {
        if (!myRef.current.contains(e.target))
            setclickedOpenModal(false);
    }

    const closeVotingModal = () => setVotingModal(false);

    const handleClose = () => setclickedSubModal(false)

    const handleClickSubModal = (data) => {
        setcModalData(data)
        setclickedSubModal(true)
    }

    const handleClickInside = () => {
        if (props.match.params.menu === 'Voting') {
            setVotingModal(true)
        } else
            setclickedOpenModal(true)
    }

    const transferToken = async (tokenList, index) => {
        let data = [], tokenInfp = {}
        for (let i = 0; i < tokenList.length; i++) {
            if (index === 1) {
                tokenInfp = {
                    daoid: props.selectedDAO.id,
                    creator: props.activeEosAccount,
                    user: tokenList[i].shareholderAccount,
                    amount: (`${tokenList[i].balance} `).concat(props.selectedDAO.token.split(' ')[1])
                }
                data.push(await eosio.transaction(props.activeEosAccount, 'crttokenprp', { ...tokenInfp }))
            } else if (index === 2) {
                tokenInfp = {
                    from: props.activeEosAccount,
                    to: tokenList[i].shareholderAccount,
                    quantity: (`${tokenList[i].balance} `).concat(props.selectedDAO.token.split(' ')[1]),
                    memo: 'memo'
                }
                data.push(await eosioDaoToken.transaction(props.activeEosAccount, 'transfer', { ...tokenInfp }))
            }
            if (i === tokenList.length - 1) {
                try {
                    let result = await Promise.all(data)
                    if (!(result && result.length > 0 && result[0].isError)) {
                        setclickedSubModal(false)
                        window.location.reload();
                    }
                } catch (error) {
                    console.log("ERROR BLCOK")
                    console.log(error)
                    alert(error)
                    this.props.history.push('/')
                }
            }
        }
    }

    const proposeVote = async (question) => {
        let questionData = { daoid: props.selectedDAO.id, creator: props.activeEosAccount, question }
        try {
            await eosio.transaction(props.activeEosAccount, 'crtvotingprp', { ...questionData })
            window.location.reload();
        } catch (error) {
            console.log("error...MSG")
            console.log(error)
        }
        setVotingModal(false)
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={myRef} onClick={handleClickOutside}>
            <div className="DI_Edit_Organisation" onClick={handleClickInside}>
                <i className="fa fa-plus" style={{ fontSize: '22px' }}></i>
                {clickedOpenModal &&
                    <div id="myModal" className="modal dao-modal transaction-type-modal"  >
                        <div className="modal-content dao-content-box transactionType">
                            {props.data.map((obj, i) =>
                                <span key={i} >
                                    <div
                                        disabled={!obj.live}
                                        className={`transactionTypeContent ${!obj.live && ' transactionTypeContentDeActive'}`}
                                        onClick={() => handleClickSubModal(obj.content)}>
                                        {!obj.live && <i className="fa fa-lock lock"></i>}{obj.title}
                                    </div>
                                </span>)}
                        </div>
                    </div>}
            </div>

            {votingmodal &&
                <VotingModal
                    handleClose={closeVotingModal}
                    show={votingmodal}
                    proposeVote={proposeVote}
                    openFundModalDtls={modalData} />}

            {clickedSubModal &&
                <TransactionFund
                    handleClose={handleClose}
                    show={clickedSubModal}
                    selectedDAO={props.selectedDAO}
                    transferToken={(tokenList, index) => transferToken(tokenList, index)}
                    unallocatedSharesAmt={props.unallocatedSharesAmt}
                    activeEosAccountBal={props.activeEosAccountBal}
                    activeEosAccount={props.activeEosAccount}
                    openFundModalDtls={modalData} />}
        </div>
    );
}

export default withRouter(TransactionType);