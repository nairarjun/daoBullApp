import React from 'react';
import decentralised from "../../../../Assets/images/2x/decentralised.png";
import autonomous from "../../../../Assets/images/2x/autonomous.png";
import organization from "../../../../Assets/images/2x/organization.png";
import attractcontributors from "../../../../Assets/images/2x/attractcontributors.png";
import pool from "../../../../Assets/images/2x/pool.png";
import govern from "../../../../Assets/images/2x/govern.png";


const FeatureItem = (props) => {
    let { data } = props
    console.log("Images", props)
    return (
        <div className="DI_HP_featureCard">
            <img className="DI_HP_feature_img" src={
                props.data.img === "decentralised" ? decentralised :
                    props.data.img === "autonomous" ? autonomous : props.data.img === organization ? organization :
                        props.data.img === "attractcontributors" ? attractcontributors :
                            props.data.img === "pool" ? pool : govern
            } alt={data.title + "IMG"} />
            <div className="DI_HP_feature_title">
                {data.title}
            </div>
            <div className="DI_HP_feature_text">
                {data.text}
            </div>
        </div>
    )
}

export default FeatureItem;