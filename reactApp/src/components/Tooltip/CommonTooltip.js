import React from 'react';
import ReactTooltip from 'react-tooltip';

const getTooltipText = (name) => {
    switch (name) {
        case "Support %":
            return "% of total votes needed to approve a proposal. In this alpha “hackathon” version support is locked at 50% + 1 vote.";
        case "Minimal Approval %":
            return "% of total circulating tokens needed to approve a proposal for the proposal to pass. In this alpha “hackathon” version minimal approval is set locked at 0%.";
        case "Vote Duration":
            return "Duration of the voting period";
        case "Symbol":
            return "Symbol is an all uppercase string of 7 or less characters from [A-Z]";
        case "Amount of Shares":
            return "Also known as hardcap, or fully diluted supply,  this is the total amount of tokens/shares that can be ever minted by the DAO.";
        case "Shareholders":
            return "List of EOS account names you want to assign tokens to. Please check carefully the account names and the balance you want to assign to each one.";
        case "Balances":
            return "Amount of tokens from the total supply that you want to assign to each shareholder.";
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