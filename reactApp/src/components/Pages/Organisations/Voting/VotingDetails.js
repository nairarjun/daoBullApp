import React from 'react';
import VoteResult from './VoteResult';
import VotingPercentage from './VotingPercentage';
import { withRouter } from 'react-router-dom';
import { Modal } from "react-bootstrap";
import './VotingDetails.css';
import moment from 'moment';

const VotingDetails = (props) => {
    let vote = props.votingDtlsData
    return (
        <>
            <Modal className="voting-Dtls-modal" show={props.show} onHide={props.handleClose} animation={false}>
                <Modal.Header>
                    <Modal.Title><div className="vote-header">{vote.type}</div></Modal.Title>
                    <div className="modal-close" onClick={props.handleClose}>
                        <i className="fa fa-close DI-close"></i>
                    </div>
                </Modal.Header>
                <div className="voting-dtls-subHeader">#{vote.contentId} {vote.type}</div>
                <div className="voting-dtls-result">
                    <VoteResult status={vote.outcome} />
                    <span className='vote-result' style={{ color: '#A7A7A7', paddingLeft: '4px' }}>
                        ({moment(vote.expires).format("DD-MM-YYYY HH:mm")})
                    </span>
                </div>
                <div className='votig-proposer'>Proposed By: {vote.creator}</div>
                <div className="voting-description">
                    {vote.question && <span>{vote.question}</span>}
                </div>
                <VotingPercentage perc={vote.yesPerc} text={'Yes'} />
                <VotingPercentage perc={vote.noPerc} text={'No'} />
                {vote.canIVote &&
                    <div className='voting-crdDtls-footer'>
                        {moment(moment.utc(vote.expires).format()).isAfter(moment.utc().format())
                            ? vote.voted.includes(localStorage.getItem('activeEosAccount'))
                                ? <div></div>
                                //  vote.yes > 0
                                //     ? <div className="voteBtn voteBtn-yesBtn" style={{ width: '267px' }}>You Accepted Proposal</div>
                                //     : <div className="voteBtn voteBtn-noBtn" style={{ width: '267px' }}>You Rejected Proposal</div>
                                : <span className='voting-crdDtls-footer'>
                                    <div className="voteBtn voteBtn-yesBtn"
                                        onClick={() => props.votedQuestion(vote, true)}>Yes
                                     </div>
                                    <div className="voteBtn voteBtn-noBtn"
                                        onClick={() => props.votedQuestion(vote, false)}>No
                                    </div>
                                </span>
                            : <div></div>
                        }
                        {vote.type === 'Shareholders' && vote.outcome === 'Passed' && vote.paid === 0 &&
                            <div
                                className="voteBtn voteBtn-yesBtn"
                                style={{ width: '267px' }}
                                onClick={() => props.enactAmount(vote)}>
                                Enact
                            </div>}
                        {/* <div className="voteBtn voteBtn-yesBtn" style={{ width: '267px' }}>You Accepted Proposal</div>
                            <div className="voteBtn voteBtn-noBtn" style={{ width: '267px' }}>You Rejected Proposal</div> */}
                    </div>
                }
            </Modal>
        </>
    );
}


export default withRouter(VotingDetails);