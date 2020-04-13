import React, { Component } from "react";
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Login from './Login'
import Home from './Home'

class Container extends Component{
  render(){
    return(
      <BrowserRouter>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/" component={Home} />
          </Switch>
      </BrowserRouter>
    );
  }
}

export default Container;