import React from 'react';

const VoteResult = (props) => {
    let status = props.status
    return (
        <div>
            <i
                style={{ paddingRight: '8px' }}
                className={`fa ${status === 'Rejected' ? ' fa-times-circle' : (status === 'Pending' ? "far fa-clock" : ' fa-check-circle')}
                        ${status === 'Rejected' ? ' failedVote ' : (status === 'Pending' ? " pendingVote" : ' passedVote')}`}>
            </i>
            <span
                className={`vote-result${status === 'Rejected' ? ' failedVote' : (status === 'Pending' ? " pendingVote" : ' passedVote')}`}>
                {status}
            </span>
        </div>
    )

}


export default VoteResult;