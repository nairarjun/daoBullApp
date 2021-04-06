import React from 'react';
import Balances from './Balances';
import './FinancialsPage.css'
import TransfersHeading from './TransfersHeading';
import TransfersTable from './TransfersTable';

const balancesData = [
    {
        balanceName: "EOS",
        quantity: 1123,
        value: 11000
    },
    {
        balanceName: "UST",
        quantity: 11,
        value: 1234
    },
    // {
    //     balanceName: "USDC",
    //     quantity: 11000,
    //     value: 11000
    // },
    // {
    //     balanceName: "BTC",
    //     quantity: 11,
    //     value: 1234
    // },
    // {
    //     balanceName: "ETH",
    //     quantity: 112.23,
    //     value: 12234
    // },
    // {
    //     balanceName: "SAI",
    //     quantity: 11,
    //     value: 1234
    // }
]

const FinancialsPage = (props) => {
    return (
        <div className="DI_FinancialsPage_main">
            <Balances balancesData={balancesData} />
            <div className="DI_FP_Transfers_Table_wrapper">
                <TransfersHeading />
                
                <div className="financial-btn">
                    See More
                </div>
            </div>
        </div>
    )
}

export default FinancialsPage;