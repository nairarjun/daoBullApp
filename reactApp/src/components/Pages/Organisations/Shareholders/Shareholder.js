import React from 'react';
import './Shareholder.css'
const Shareholder = (props) => {
    return (
        <div>
            <ShareholderTable tableData={[{ account: 'Unallocated shares', balance: props.unallocatedSharesAmt }]} col1={props.selectedDAO.daoname} col2={'FRST Balance'} />
            <ShareholderTable tableData={props.ShareholderList} col1={'Shareholder Accounts'} col2={'FRST Balance'} />
        </div>
    )
}
const ShareholderTable = (props) => {
    return (
        <div className="DI_Table">
            <table border="0" cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th className="DI_sharholder_th" style={{ width: '80%' }}>{props.col1}</th>
                        <th className="DI_sharholder_th" style={{ width: '25%', paddingRight: '20px', textAlign: 'right' }}>{props.col2}</th>
                        {/* <th className="DI_sharholder_th" style={{ width: '15%'}}></th> */}
                    </tr>
                    <tr>
                        <td className="lineBreak"></td>
                        <td className="lineBreak"></td>
                        {/* <td className="lineBreak"></td> */}
                    </tr>
                </thead>
                <tbody>
                    {
                        props.tableData.map((users, i) => {
                            return (
                                <tr style={{ height: '68px' }} key={i}>
                                    <td className="lineBreak DI_sharholder_td" >{users.account}</td>
                                    <td className="lineBreak DI_sharholder_td" style={{ textAlign: 'right' }}>{users.balance}</td>
                                    {/* <td className="lineBreak DI_sharholder_td">
                                        <div style={{ height: '22px', width: '74px', backgroundColor: '#EDEDED' ,float:'right'}}></div>
                                    </td> */}
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Shareholder;