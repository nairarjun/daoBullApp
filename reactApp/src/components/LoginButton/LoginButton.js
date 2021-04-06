import React, { useState } from 'react';
import WalletList from "../WalletList/WalletList";
import './LoginButton.css'
// import FontAwesome from 'react-fontawesome';

const LoginButton = (props) => {

    const [openWalletBlock, openWalletList] = useState(false);

    const openWallet = () => openWalletList(true)
    const closeWallet = () => openWalletList(false)

    return (
        <div className='DI_Login_Button_wrapper'>
            {openWalletBlock &&
                <div className="modal ModalLoginConnect" id="openWalletListModal" tabIndex="-1" role="dialog" style={{backgroundColor: "rgba(0, 0, 0, .5)"}}>
                    <div className="modal-dialog modal-dialog-centered ModalDailogLoginConnect" role="document">
                        <style>{"\
                        .modal-backdrop.show {\
                            opacity: .5;\
                          }\
                        body {\
                            overflow-Y: hidden;\
                        }\
                        "                     
                        }</style>
                        <div className="modal-content">
                            <div className='cardContainer cardContainerLoginConnect' style={{ backgroundColor: 'white', zIndex: 1 }}>
                                <div className="Orgnisation-container">
                                    <WalletList {...props} onClick={props.ual.showModal} />
                                </div>
                                <div className="closeWalletListModal" >
                                    <i className="fa fa-times" onClick={() => closeWallet()} ></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {<div onClick={() => openWallet()}
                className='DI_Login_Button'>
                {/* <i className="fas fa-wallet DI_Login_Button_Icon" /> */}
                {/* <FontAwesome name="fa fa-wallet DI_Login_Button_Icon" /> */}
                <span className="DI_Login_Button_Text">Connect</span>
            </div>}
        </div>
    )
}

export default LoginButton