import React from 'react';
import Header from './Header'

const HeaderLayout = (props) => {
    return (
        <div>
            <Header {...props}/>
            {props.children}
        </div>
    )    
}

export default HeaderLayout;