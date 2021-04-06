import React from 'react';
import LoginButton from '../../LoginButton/LoginButton';
import LogoutButton from '../../LogoutButton/LogoutButton';
import './Header.css'
import SearchBar from "./SearchBar";
import { withRouter } from 'react-router-dom';
import daoBull from '../../../Assets/images/2x/daoBullHeader.png'

const Header = (props) => {
    let modalButton = !props.activeUser && LoginButton(props)
    const logoutBtn = LogoutButton(props)
    return (
        <div className="DI_header_main" style={props.style && props.style}>
            <div className="DI_logo"
                // style={{ display: 'flex' }}
                onClick={() => { props.history.push("/") }}>


                <div><img src={daoBull} style={{width:'45px',height:'50px'}}/></div>
                <div style={{paddingLeft:'5px'}}>Dao Bull</div>
            </div>
            <SearchBar {...props} />
            <nav className="DI_nav_main">

                {
                    !props.activeUser &&
                    modalButton
                }
                {props.activeUser &&
                    logoutBtn
                }
            </nav>
        </div>
    )
}

export default withRouter(Header);