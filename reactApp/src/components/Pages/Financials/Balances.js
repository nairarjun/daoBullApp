import React from 'react';

const Balances = (props) => {
    const { balancesData } = props;
    return (
        <div className="DI_FP_Balances_main">
            {balancesData && balancesData.length > 0 && balancesData.map((data, i) => {
                return (
                    <div key={i} className="DI_FP_Balances" onClick={() => {
                    }}>
                        <div className="DI_FP_Balance_name_wrapper" >
                            <div className="Balance_dot"></div>
                            <div className="Balance_name">{data.balanceName}</div>
                        </div>
                        <div className="DI_FP_Balances_quantity" >
                            {data.quantity}
                        </div>
                        <div className="DI_FP_Balances_Value" >
                            {"$"}{data.value}
                        </div>
                    </div>)
            })}
        </div>
    )
}

export default Balances;