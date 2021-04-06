
import React from 'react';
import { Table } from 'reactstrap';
import SingleTransferTableRow from './SingleTransferTableRow';


const TransfersTable = (props) => {
    return (
        <Table responsive>
            <thead>
                <tr>
                    <th className="transfersTable_heading" width="15%">Date</th>
                    <th className="transfersTable_heading" width="20%">Source / Recipient</th>
                    <th className="transfersTable_heading" width="15%">Reference</th>
                    <th className="transfersTable_heading transfersTable_amount" width="50" >Amount</th>
                </tr>
            </thead>
            <tbody className="DI_FP_Table_BODY">
                {props.tempData.map((TData, i) => {
                    return (
                        <SingleTransferTableRow TData={TData} key={i} />
                    )
                })
                }
            </tbody>
        </Table>
    )
}

export default TransfersTable;