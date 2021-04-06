import React from 'react';
import ReactTooltip from 'react-tooltip';

const getTooltipText = (name) => {
    switch (name) {
        case "Support %":
            return "Support Percentage";
        case "Minimal Approval %":
            return "Minimal Approval Percentage";
        case "Vote Duration":
            return "Voting expiry time";
        case "Symbol":
            return "Symbol is an all uppercase string of 7 or less characters from [A-Z]";
        case "Amount of Shares":
            return "Total amount of Shares";
        case "Shareholders":
            return "Account names must be 12 characters long and only include the characters 12345abcdefghijklmnopqrstuvwxyz";
        case "Balances":
            return "Balances example: 120 ABC";
        case "Question":
            return "Question";
        default: return "NA";
    }
}

const CommonTooltip = (props) => {
    return (
        <ReactTooltip id={props.tooltipId}>
            <div className="Daobull_tooltip_content">
                {getTooltipText(props.tooltipName)}
            </div>
        </ReactTooltip>
    )
}

export default CommonTooltip