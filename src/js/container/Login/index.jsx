import React, { Component} from "react";
import isLoggedIn from '../../utils/isLoggedIn';
import {Redirect} from 'react-router-dom';
import AES from 'crypto-js/aes';
import {SECRET} from '../../constants';
import {getData} from '../../utils/service'

class Login extends Component{
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error: false,
            loginError: false
        }
    }

    async componentDidMount() {
        const {data, error} = await getData("users");
        if(error) {
            this.setState({
                error
            });
        }
        else {
            this.setState({
                loginData:data,
            });
        }
    }

    handleChange = event => {
        this.setState({
          [event.target.name]: event.target.value
        });
    };
    
    handleSubmit = event => {
        event.preventDefault();
        const {username, password, loginData: {username:loginUser, password:loginPassword} = {}} = this.state;
        this.setState({loginError:false});
        if(!(username === loginUser && password === loginPassword)){
            return this.setState({loginError:true});
        }
        const encryptPassword = AES.encrypt(password, SECRET).toString();
        window.sessionStorage.setItem("loginInfo",JSON.stringify({username,password:encryptPassword}))
        this.props.history.push('/home')  
    };

    render(){
        if(isLoggedIn()) {
            return <Redirect to="/home"/>
        }
        const {username, password, loginError, error} = this.state;
        if(error){
            return <div>Something is not quite right please refresh the page</div>;
        }
        return( 
            <div className="container px-5">
                <form onSubmit={this.handleSubmit} className="login-form">
                    <h4>User login</h4>
                    { loginError && 
                        <div className="alert alert-danger" role="alert">
                            <p className='mb-0'>Username and password is not matching</p>
                        </div>
                    }
                    <div className="form-group">
                        <label>Username:</label>
                        <input className="form-control" name="username" type= "text" placeholder="Enter your username" value={username} onChange={this.handleChange}/>
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input className="form-control" name="password" type="password" placeholder="Enter your password" value={password} onChange={this.handleChange}/>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-light" type="submit">Submit</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Login;