import React from 'react';
import FeatureItem from './FeatureItem';

const FeatureItemRow = (props) => {
    let { featuresList } = props
    return(
        <div className="DI_HP_FeatureRow_wrapper">
        {featuresList && featuresList.length > 0 && featuresList.map((data, i) => {
            return (
                <FeatureItem key={i} data={data} />
            )
        })
        }
    </div>
    )
}

export default FeatureItemRow;