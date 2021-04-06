import React from 'react';
import VoteResult from './VoteResult';
import VotingPercentage from './VotingPercentage';

const VotingCard = (props) => {
    let vote = props.voteQuestionDtls
    return (
        <div className="voting-card"
            style={(props.id + 1) % 4 === 0 ? { marginRight: '0%' } : { marginRight: '2%' }}
            onClick={() => props.openVotingDtls(props)}>
            <div className="vote-header">{vote.type}</div>
            <div style={{ height: '61.5px' }}>
                <div className="vote-content">
                    #{(vote.contentId)} {vote.title}: {vote.question && (vote.question)}
                </div>
            </div>
            <VotingPercentage perc={vote.yesPerc} text={'Yes'} />
            <VotingPercentage perc={vote.noPerc} text={'No'} />
            <VoteResult status={vote.outcome} />
        </div>
    )
}

export default VotingCard;