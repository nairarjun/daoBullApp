import React, { Component } from 'react';
import $ from 'jquery';
import { withRouter } from 'react-router';
import './landing.css';
import daoBull from "../../../Assets/images/2x/daoBullTitle.png";

class Landing extends Component {
    constructor(props) {
        super(props)
        this.state = {
            updateMe: false,
            email: ''
        }
        // this.box = React.createRef();
    }

    updateMe = () => {
        // this.setState({ updateMe: true })
        window.open('https://twitter.com/daobulls', '_blank');
    }
    submitMe = () => {
        let email = this.state.email,
            lastAtPos = email.lastIndexOf('@'),
            lastDotPos = email.lastIndexOf('.');

        console.log("Submit Me", email)
        if (email === '') {
            alert("Cannot be empty");
        } else if (!(lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') == -1 && lastDotPos > 2 && (email.length - lastDotPos) > 2)) {
            alert("Email is not valid");
        } else {
            console.log("Else")
            this.props.history.push('/')
        }
    }

    onChangeEmail = (e) => {
        console.log("onChangeEmail....", e.target.value)
        this.setState({ email: e.target.value })
    }

    render() {
        var width = $(".dao_landing_header").width();
        console.log("width....", width)
        let subHeaderStyle = { width: `${width}px` }
        let { updateMe } = this.state
        return (
            <div className="dao_landingFlex-col">
                <div>
                    <img src={daoBull} style={{ width: '95px' }} />
                </div>
                <div className={`DI_HP_SubCompo_Title dao_landing_header`}
                >
                    Welcome to DAO Bull
                </div>
                <div className="dao_landing_subheader" style={{ width: `${width}px` }}>
                    Winners of the EOS.IO 2021 Hackathon, currently in stealth mode on a mission to change the world.
                </div>
                {
                    updateMe
                        ?
                        <div className="dao_landingFlex-row" style={{ width: `${width}px` }} >
                            <input type='email' className="dao_landing_email"
                                onChange={(e) => this.onChangeEmail(e)}
                                placeholder="Your Email Address..." />
                            <span className="dao_landing_upToDateBtn"
                                onClick={this.submitMe}
                                style={{ height: '32px', borderRadius: '2px' }}>Submit</span>
                        </div>
                        :
                        <div
                            className="dao_landing_upToDateBtn"
                            onClick={this.updateMe}>
                            Get In Touch
                        </div>
                }

            </div>
        )
    }
}


export default withRouter(Landing);
