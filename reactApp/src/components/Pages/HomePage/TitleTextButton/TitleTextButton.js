import React from 'react';
import './TitleTextButton.css'
import daoBull from "../../../../Assets/images/2x/daoBullTitle.png";
const TitleTextButton = (props) => {
    return (
        <div className="DI_HP_SubCompo_Wrapper"
            style={{
                backgroundColor: props.bgColor,
                height: props.height,
                paddingTop: props.paddingTop,
                width:props.width,
                justifyContent:props.justifyContent
            }}>
            {props.daoBullImg &&
                <img src={daoBull} style={{ width: '130px', marginTop: '30px' }} />
            }
            <div className={`DI_HP_SubCompo_Title ${props.className!=='' && ' DaoBull-subHeading'}`}
                style={{
                    fontSize: props.titleFontSize,
                    lineHeight: props.LineHeight,
                    letterSpacing: props.letterSpacing,
                    fontWeight: props.fontWeight,
                    marginTop: props.marginTop,
                }}>
                {props.title}
            </div>
            <div className="DI_HP_SubCompo_Text">
                {props.text}
            </div>
            {
                props.btnText !== '' &&
                <div className="DI_HP_SubCompo_Button" onClick={props.createOrganisation}>
                    {props.btnText}
                </div>
            }

        </div>
    )
}

export default TitleTextButton