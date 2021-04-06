import React from 'react';

const VotingPercentage = (props) => {
    return (
        <div className={`vote-${props.text === 'Yes' ? 'green' : 'red'}`}>
            <div className={`vote-green-value`}>
                <span className="">{props.text}</span>
                <span className="" style={{ float: 'right' }}>{props.perc}%</span>
            </div>
            <div id="myProgress">
                <div id={`myProgress${props.text === 'Yes' ? 'Green' : 'Red'}Bar`} style={{ width: `${props.perc}%` }}></div>
            </div>
        </div>
    )
}

export default VotingPercentage;