import React, { useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Modal, Button } from "react-bootstrap";
import './VotingModal.css';
import CommonTooltip from '../../../Tooltip/CommonTooltip';

function VotingModal(props) {
    const [question, setQuestionValue] = useState('');
    const [errMsg, setErrorMsg] = useState('');

    const setQuestion = (e) => {
        setQuestionValue(e.target.value)
    }

    const proposeVote = (questionData) => {
        if (question.trim() === '')
            setErrorMsg(`Question can't be empty`)
        else
            props.proposeVote(questionData)
    }
    
    return (
        <>
            <Modal className="voting-modal" show={props.show} onHide={props.handleClose} animation={false}>
                <Modal.Header>
                    <Modal.Title>Propose a vote</Modal.Title>
                    <div className="modal-close" onClick={props.handleClose}> <i className="fa fa-close DI-close"></i></div>
                </Modal.Header>
                <div className="voting-modal-body">Your question  <i data-tip data-for="CO_PV_Question_Id" className="fas fa-question-circle toolTipQuestion"></i>
                    <CommonTooltip tooltipId="CO_PV_Question_Id" tooltipName="Question"></CommonTooltip>
                </div>
                <textarea placeholder='Enter your question....' className="voting-modal-textarea" onChange={(e) => setQuestion(e)} />
                {errMsg && <div className="errMsg" style={{ marginBottom: '0px' }}>{errMsg}</div>}
                <div className="propose-vote-btn" onClick={() => proposeVote(question)}>Propose Vote</div>
            </Modal>
        </>
    );
}


export default withRouter(VotingModal);