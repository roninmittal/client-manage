import CryptoJS from 'crypto-js';
import {SECRET} from '../constants';
const isLoggedIn = () => {
    const loginInfo = JSON.parse(window.sessionStorage.getItem("loginInfo"))
    if(loginInfo !== null) {
        const {username, password} = loginInfo;
        
        var bytes  = CryptoJS.AES.decrypt(password, SECRET);
        var originalPass = bytes.toString(CryptoJS.enc.Utf8);
        if(username==="ronin" && originalPass==="password") {return true}
        return false;
    } 
    return false;
}
export default isLoggedIn;