import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import * as actions from "../../Pages/Redux/Actions/index";
import './SearchBar.css';
class SearchBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            daoValue: '',
            selectedDao: null,
            alertBox: false,
            decentralizeDao: this.props.daoList,
            clickedOpenDaoSearch: false

        }
        this.box = React.createRef();
    }

    handleClickOutside = (event) => {
        if (this.box && !this.box.current.contains(event.target))
            this.setState({ clickedOpenDaoSearch: false })
    }

    searchDao = (e) => {
        if (this.state.daoValue.trim() === '') {
            alert(`ADD Dao Name`)
        } else {
            this.setState({ clickedOpenDaoSearch: false })
            let selectedDAO = this.props.organisationList.filter((org) =>
                org.data.daoname.toUpperCase() === this.state.daoValue.toUpperCase())
            if (selectedDAO.length > 0)
                this.props.history.push(`/organisation/Shareholeders/${selectedDAO[0].data.id}`)
            else {
                alert(`DAO DOESN'T EXIT's`)
                this.setState({ alertBox: true })
            }
        }
    }

    onChange = (e) => {
        let txtValue = '',
            updatedecentralizeDao = [],
            decentralizeDao = this.props.daoList,
            filter = e.target.value.toUpperCase()

        filter = e.target.value.toUpperCase();

        for (let i = 0; i < decentralizeDao.length; i++) {
            txtValue = decentralizeDao[i].data.daoname
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                updatedecentralizeDao.push(decentralizeDao[i])
            }
        }

        if (e.target.value === '')
            this.setState({ decentralizeDao: this.props.daoList })

        this.setState({ decentralizeDao: updatedecentralizeDao, daoValue: e.target.value })
    }

    onSelectOfDao = async (e, dao) => {
        this.setState({ daoValue: dao.daoname, selectedDao: dao })
        await this.props.setSelectedDAO(dao)
        this.setState({ clickedOpenDaoSearch: false }, () => this.props.history.push(`/organisation/Shareholeders/${dao.id}`))
    }

    handleClickInside = () => {
        console.log("handleClickInside....", this.props)
        if (this.props.activeUser === null)
            alert("Please Connect to Wallet")
        else
            this.setState({ clickedOpenDaoSearch: true })
    }


    componentDidUpdate = (prevProps) => {
        if (prevProps.daoList !== this.props.daoList)
            this.setState({ decentralizeDao: this.props.daoList })

        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentDidMount = () => {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount = () => {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    render() {
        let { clickedOpenDaoSearch, decentralizeDao } = this.state
        return (
            <div className="DI_header_search" ref={this.box} onClick={this.handleClickInside}>
                <div className="input-group DI_search" >
                    <input type="text"
                        disabled={this.props.activeUser === null}
                        className="form-control"
                        onChange={this.onChange}
                        placeholder="Search DAO's"
                        value={this.state.daoValue}
                        onKeyDown={(e) => e.key === 'Enter' && this.searchDao(e)}
                    />
                    <div className="input-group-append">
                        <button
                            type="button"
                            disabled={this.props.activeUser === null}
                            className="btn btn-secondary"
                            onClick={this.searchDao}
                            disabled={this.state.daoValue.trim() === '' ? true : false}>
                            <i className="fa fa-search DI-search"></i>
                        </button>
                    </div>
                </div>
                {clickedOpenDaoSearch &&
                    <div id="myModal" className="modal dao-modal" >
                        <div className="modal-content dao-content-box">
                            {decentralizeDao.length > 0 && decentralizeDao.map((dao, i) =>
                                <div
                                    key={i}
                                    className="dao-list"
                                    onClick={e => this.onSelectOfDao(e, dao.data)}>
                                    {dao.data.daoname}
                                </div>)}
                        </div>
                    </div>}
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        organisationList: state.organisations.organistionList,
        creatorsList: state.organisations.creatorsList,
        selectedDAO: state.organisations.selectedDAO
    };
}
const mapDispatchToProps = dispatch => {
    return {
        setSelectedDAO: (value) => dispatch(actions.setSelectedDAO(value))
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchBar));
