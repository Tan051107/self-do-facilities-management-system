import '../css/CreateAcc.css';
import '../css/Form.css'
import { useState } from 'react';
export default function CreateAcc (){
    
    const roles = ["Admin","Lecturer", "Student"]
    const [currRole, setCurrRole] = useState("Admin");

    function CreateAdminForm (){
        return(
            <form action="" className="sign-up-form">
                <div className="form-group">
                    <label className="label">
                        <p>Full Name</p>
                        <input type="text" />
                    </label>
                </div>
                <div className="form-group">
                    <label className="label">
                        <p>Email</p>
                        <input type="text" />
                    </label>
                </div>
                <div className="form-group">
                    <label className="label">
                        <p>ID</p>
                        <input type="text" />
                    </label>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="label">
                            <p>Password</p>
                            <input type="password" />
                        </label>
                    </div>
                    <div className="form-group">
                        <label className="label">
                            <p>Confirm Password</p>
                            <input type="password" />
                        </label>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="label">
                            <p>Date of Birth</p>
                            <input type="date" />
                        </label>
                    </div>
                    <div className="form-group">
                        <label className="label">
                            <p>Gender</p>
                            <select name="gender" id="">
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </label>
                    </div>
                </div>
                <button className="submit-btn">
                    Submit
                </button>
            </form>
        )
    }


    function createStudentForm(){


    }

    return (
        <div className="create-acc-wrapper">
            <div className="create-acc-container">
                <nav className="role-navbar">
                    <ul className="role-selection">
                        {roles.map((role,index)=>(
                            <li key={index} className={`role ${role===currRole?"active-role":""}`} onClick={()=>setCurrRole(role)}>{role}</li>
                        ))}
                    </ul>
                </nav>
                <h1>Create Account</h1>
                {currRole === "Admin" && <CreateAdminForm/>}
                {currRole === "Student" && <CreateAdminForm/>}
                {currRole === "Lecturer" && <CreateAdminForm/>}
            </div>
        </div>
    )
}