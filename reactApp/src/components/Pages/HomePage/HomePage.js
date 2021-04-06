import React from 'react';
import TitleTextButton from './TitleTextButton/TitleTextButton'
import { withRouter } from 'react-router-dom';
import './HomePage.css'
import { componentList, featuresList1, featuresList2 } from '../../ComponentData'
import FeatureItemRow from './FeatureComponents/FeatureItemRow';
import BottomDesign from './BottomDesign/BottomDesign';
const HomePage = (props) => {
    return (
        <div className="DI_homePage_main" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 84.6%, #FAFAFA 100%)' }}>

            {componentList.map((data, i) => {
                return (
                    // {
                    data.title === 'Welcome to Dao Bull'
                        ?
                        <div key={i} id='' style={{ display: 'flex', paddingTop: '80px', height: '650px', overflowX: "hidden",
                        overflowY: "hidden" }}>
                            <div className="div1" >
                                {/* <img src={lefthanddots} style={{width:'450',height:'549'}}/> */}
                            </div>
                            <TitleTextButton key={i} {...data} createOrganisation={() => props.history.push('./CreateOrganisation')} />

                            <div className="div2" >
                                {/* <img src={righthanddots} /> */}
                            </div>
                        </div>
                        :
                        <TitleTextButton key={i} {...data} createOrganisation={() => props.history.push('./CreateOrganisation')} />

                    // }
                )
            })
            }
            <div className="DI_HP_Feature_wrapper">
                <FeatureItemRow featuresList={featuresList1} />
                <FeatureItemRow featuresList={featuresList2} />
            </div>
            <div  style={{ paddingBottom: '97px' }}>
                <div className="DI_HP_SubCompo_Button"
                    onClick={() => props.history.push('./CreateOrganisation')}>
                    Create Now
            </div>
            </div>

            {/* <div className="DI_HP_Bottom_wrapper">
                <BottomDesign />
            </div> */}
        </div>
    )
}

export default withRouter(HomePage);