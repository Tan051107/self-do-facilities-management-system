import '../css/Login.css';
import logo from '../images/apu-logo.png';
import { useState, useContext } from 'react';
import axios from "./axios.js"
import { useNavigate } from 'react-router-dom';
import {UserContext } from '../context/UserContext.jsx';

export default function Login(){

    const {setUser} = useContext(UserContext);
    const [showPassword,setShowPassword] = useState(false)


    const [user_id,setId] = useState("");
    const [password,setPassword] = useState("");
    const [loginFailed, setLoginFailed] = useState(false)
    const [errorMessage,setErrorMessage] = useState("")
    const navigate = useNavigate();

    const handleLogin =async(e)=>{
        e.preventDefault();
        try{
            const result = await axios.post("/login",{user_id,password});
            const {token,role,user} = result.data;

            localStorage.setItem("auth-token",token);
            localStorage.setItem("user-role",role);
            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));
            console.log(result.data);  // 👈 see the raw JSON


            if (role == "admin"){
                navigate("/admin/homepage");
            }
            else {
                navigate("/homepage");
            }
            console.log(loginFailed)

        }
        catch(err){
            console.log(err.response?.data?.message);
            setLoginFailed(true)
            setErrorMessage(err.response?.data?.message)
        }

    }

    return(
        <div className="login-wrapper">
            <div className="login-container">
                <div className="left-section">
                    <div><img className="logo" src={logo} alt="logo" /></div>
                    <h1>Welcome to Asia Pacific University</h1>
                    <p className="subtitle">The all-in-one campus facility management system of Asia Pacific University</p>
                    <p className="desc">Easily access and manage bookings, transport, timetables, library services, and more &#8722; all in one place. Designed to simplify campus life for students, staff, and administrators.</p>
                </div>
                <div className="right-section">
                    <h1>Log In</h1>
                    <form action="" className="login-form" onSubmit={handleLogin}>
                        <label className="input">
                            <p>User ID</p>
                            <input type="text" name="user_id" onChange={((e)=>setId(e.target.value))}/>
                        </label>
                        <label className="input">
                            <p>Password</p>
                            <input type={showPassword ? "text" : "password"} id="password-input" name="password" onChange={(e)=>setPassword(e.target.value)} />
                        </label>
                        <label className="show-password-section">
                            <p>Show password</p>
                            <input type="checkbox" id="show-password-checkbox" onChange={()=>setShowPassword(!showPassword)}/>
                        </label>
                        {loginFailed && <div id="login-failed-message">{errorMessage}</div>}
                        <button className="log-in-button" type="submit" >Log In</button>
                        <p className="forgot-password">Forgot password</p>
                    </form>
                </div>
            </div>
        </div>
    )
}