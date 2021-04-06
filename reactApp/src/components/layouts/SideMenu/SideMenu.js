import React from 'react'
import './SideMenu.css'
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";


const sideMenu = [
    { mainMenu: 'Shareholders', locked: false, subMenu: [{ name: 'Holders', live: true }, { name: 'Statistics', live: false }] },
    { mainMenu: 'Voting', locked: false, subMenu: [{ name: 'Holders', live: true }, { name: 'Statistics', live: false }] },
    { mainMenu: 'Financials', locked: true, subMenu: [{ name: 'Holders', live: true }, { name: 'Statistics', live: false }] },
]
const upcommingFeautre = ['Pay Roll', 'Boards', 'Social', 'Fundraising', 'Permissions', 'App Center']

const SideMenu = (props) => {
    return (
        <div className="sidenav">
            {/* <div className="organisation-heading">Forest Fund</div> */}
            <div className="menu">
                {sideMenu.map((menu, i) => {
                    return (<div key={i} className={`sideMenu-parent${props.match.params.menu === menu.mainMenu ? ' sideMenu-parent-active' : ' '}`} onClick={() => {
                        if (menu.locked !== true) {
                            props.history.push(`/organisation/${menu.mainMenu}/${props.selectedDAO.id}`)
                        }
                    }}>
                        <span className={`sidemenu-title${props.match.params.menu === menu.mainMenu ? ' sideMenu-parent-active-title' : ' '}`}>{menu.locked === true ? <i className="fa fa-lock"></i> : null}&nbsp;{menu.mainMenu}
                            {menu.locked === true ? <span className="sidemenu-title_comingSoon">(Comming soon)</span> : null}
                        </span>
                    </div>)
                })}
            </div>
            {/* <div className="lineBreak"> </div> */}
            <div className="menu">
                <div className="sidemenu-title upcomming-feautre upcomming-feautre-content">Upcoming features</div>
                {upcommingFeautre.map((menu, i) => {
                    return (<div key={i} className='sideMenu-parent'>
                        <i className="fa fa-lock lock"></i><span className="sidemenu-title upcomming-feautre">{menu}</span>
                    </div>)
                })}
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        organisationList: state.organisations.organistionList,
        creatorsList: state.organisations.creatorsList,
        selectedDAO: state.organisations.selectedDAO
    };
}

export default withRouter(connect(mapStateToProps, null)(SideMenu));






