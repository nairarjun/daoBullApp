import React from 'react';

const SingleTransferTableRow = (props) => {
    let { TData } = props;  
    return (
        <tr>
            <td className="transfersTable_item">{TData.date}</td>
            <td className="transfersTable_item">{TData.sourceOrRecipient}</td>
            <td className="transfersTable_item">{TData.reference}</td>
            <td className="transfersTable_item transfersTable_amount">{TData.amount} {TData.currency}</td>
        </tr>
    )
}

export default SingleTransferTableRow;