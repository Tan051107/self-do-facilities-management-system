import profilePic from "../images/profile-pic.png"
import "../css/Profile.css";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from './axios.js'


export default function Profile(){

    const {user,loading} = useContext(UserContext);
    const navigate = useNavigate();

    
    const handleLogOut =async()=>{
        try{
            await axios.post('/logout')
            }
        catch(err){
            console.error("Log out Failed",err.response?.data);
        }
        finally{
            localStorage.removeItem("auth-token");
            localStorage.removeItem("user-role");
            localStorage.removeItem('user')

            navigate("/login", { replace: true });;
        }
    };

    if (!loading){    
        return(
            <div>                        
                <div className="outer-container">
                    <div className="logout-button-container">
                        <button className="logout-icon-container" onClick={handleLogOut}><span className="material-symbols-rounded">logout</span></button>
                    </div>
                    <div className="profile-container">
                        <div className="profile-image-section">
                            <h1>Student Profile</h1>
                            <div className="profile-image-container"><img className="profile-image" src={profilePic} alt="profile-pic" /></div>
                            <div className="name-email-container">
                                <p>{user.name}</p>
                                <p><strong>{user.email}</strong></p>
                            </div>
                        </div>
                        <div className="details-container">
                            <h2>Student Details</h2>
                            <p className="details"><strong>Student ID: </strong>{user.user_id}</p>
                            <p className="details"><strong>Course: </strong>Diploma in Software Engineering</p>
                            <p className="details"><strong>Date of Birth: </strong>{user.DOB}</p>
                            <p className="details"><strong>Intake Code: </strong>UCDF2308ICT&#40;SE&#41;</p>
                        </div>
                    </div>
                </div>
            </div>
            )}
}