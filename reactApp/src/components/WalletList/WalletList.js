import React from 'react';
import "./WalletList.css";
import anchor from "../../Assets/images/1x/anchor.png";
import eosAuth from "../../Assets/images/1x/eosAuth.png";
import ledger from "../../Assets/images/1x/ledger.png";
import trezor from "../../Assets/images/1x/trezor.png";
import lynx from "../../Assets/images/1x/lynx.png";
import scatter from "../../Assets/images/1x/scatter.png";
import simpleEos from "../../Assets/images/1x/simpleEos.png";


const WalletList = (props) => {
    return (
        <div className="wallet">
            <div className="walletType-heading">Wallet Type</div>
            <div className="walletType-subheading">We currently only support Anchor wallet, but we will be adding more soon!</div>
            <div className="walletType-btn" style={{cursor:'pointer'}} onClick={props.ual.showModal}>
                <img src={anchor} style={{ width: '20%', marginTop: '8px' }} />Anchor</div>
            <div className="walletType-cmgSoon">Comming Soon...</div>
            <div className="flexContainer">
                <div className="walletType-btn walletType-disablebtn">
                <img src={scatter} style={{ width: '15%', marginTop: '0px', marginRight: '8px' }} />
                    Scatter
                </div>
                <div className="walletType-btn walletType-disablebtn">
                    <img src={ledger} style={{ width: '15%', marginTop: '0px', marginRight: '3px' }} />
                    Ledger
                </div>
                <div className="walletType-btn walletType-disablebtn">
                    <img src={trezor} style={{ width: '15%', marginTop: '2px', marginRight: '7px' }} />
                    Trezor
                </div>
            </div>
            <div className="flexContainer">
                <div className="walletType-btn walletType-disablebtn">
                    <img src={simpleEos} style={{ width: '15%', marginTop: '2px', marginRight: '7px' }} />
                    SimplEOS
                </div>
                <div className="walletType-btn walletType-disablebtn">
                    <img src={lynx} style={{ width: '20%', marginLeft: '-2px' }} />
                    Lynx
                </div>
                <div className="walletType-btn walletType-disablebtn">
                    <img src={eosAuth} style={{ width: '15%', marginTop: '2px', marginRight: '7px' }} />
                    EOS
                </div>
            </div>
        </div>
    )
}

export default WalletList;