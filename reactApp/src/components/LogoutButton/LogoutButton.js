import React from 'react';
import './LogoutButton.css'

const LogoutButton = (props) => {
 
    const { ual: { activeUser, activeAuthenticator, logout } } = props
    const logedOut=()=>{
      localStorage.removeItem('activeEosAccount')
      logout()
    }
    if (!!activeUser && !!activeAuthenticator) {
      return (
        <div className='DI_Logout_Button_wrapper'>
        <div onClick={logedOut}
            className='DI_Logout_Button'>
            {/* <i className="fas fa-wallet DI_Logout_Button_Icon" /> */}
            <span className="DI_Logout_Button_Text">Connected</span>
        </div>
    </div>
      )
    } else {
        return null
    }
}

export default LogoutButton