import React, { Component, Fragment } from "react";
import {Redirect} from 'react-router-dom';
import Contact from '../Contact'
import History from '../History'
import isLoggedIn from '../../utils/isLoggedIn'

class Container extends Component{
  constructor(props) {
    super(props);
    this.state = {
      value:'select'
    }
  }

  handleLogout = () => {
    window.sessionStorage.removeItem("loginInfo")
    this.props.history.push('/login')
  }

  handleChangeSelect = (event) => {
    this.setState({value: event.target.value});
  }

  render(){
    if(!isLoggedIn()) {
        return <Redirect to="/login"/>
    }
    return(
        <Fragment>
            <nav className="navbar navbar-light bg-light px-3">
                <a className="navbar-brand">Client information</a>
                <form className="form-inline">
                  <button className="btn btn-outline-secondary my-2 my-sm-0" type="button" onClick={this.handleLogout}>Logout</button>
                </form>
            </nav>
        
            <div className="col-sm-12">
              <div className="form-group select-client-info my-3 mx-auto">
                <select value={this.state.value} className="form-control" id="selectInfo" onChange={this.handleChangeSelect}>
                  <option value="select">Select info</option>
                  <option value="history">Clients spend history</option>
                  <option value="contacts">Clients contacts management</option>
                </select>
              </div>
              <hr className='mb-3 border border-secondary'/>
            </div>            
            {this.state.value==="select" && <div className="col-sm-12 mt-3 text-center">Please select client information</div>}
            {this.state.value==="contacts" && <Contact/>}
            {this.state.value==="history" && <History/>}
        </Fragment>
    );
  }
}

export default Container;