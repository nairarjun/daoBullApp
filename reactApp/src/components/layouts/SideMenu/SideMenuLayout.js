import React from 'react';
import './SideMenu.css'
import SideMenu from './SideMenu'
import LoginButton from '../../LoginButton/LoginButton';
import LogoutButton from '../../LogoutButton/LogoutButton';
import Header from '../Header/Header'

const SideMenuLayout = (props) => {
    let modalButton = !props.activeUser && LoginButton(props)
    const logoutBtn = LogoutButton(props)
    let style={position:'relative'}
    return (
        <div className="DI_Flex_row" style={{ flexDirection: 'column' }}>
            <div><Header {...props} style={style} /></div>
            <div className="DI_Flex_row">
                <SideMenu {...props } />
                <div className="DI_Side_Menu_Col2">
                    <div>
                        {props.children}
                    </div>


                </div>

            </div>

        </div>
    )
}

export default SideMenuLayout;


{/* <SideMenu {...props} />
<div className="DI_Side_Menu_Col2">
    <div>
        {props.children}
    </div>


</div> */}
