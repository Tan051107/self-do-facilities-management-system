import AddIntakeForm from "./AddIntakeForm.jsx"
import { useState,useEffect } from "react"
import TableFrame from './TableFrame.jsx'
import axios from "./axios.js";

export default function IntakeManagement(){
    const [showForm , setShowForm] = useState(false);
    const [intakes , setIntakes] = useState([]);
    const headers = ['Intake Code' , 'Course Name' , 'Start Date' , 'End Date' , 'Current Enrollment' , 'Maximum Enrollment' , 'Actions']
    const [editIntakeData , setEditIntakeData] = useState();

    const fetchIntakes = async()=>{
        try{
            const intakeData = await axios.get('/intake');
            setIntakes(intakeData.data);
            console.log(intakeData.data)
        }
        catch(err){
            console.error('Failed to fetch intakes' , err)
        }
    }

    useEffect(()=>{
        fetchIntakes()
    },[])

    const closeForm = ()=>{
        setShowForm(false);
        setEditIntakeData(null)
    }

    const submitSuccess =()=>{
        fetchIntakes();
        setShowForm(false);
    }

    const deleteIntake =async(intake)=>{
        try{
            if(window.confirm("Are you sure you want to delete this intake?")){
                await axios.delete(`/intake/${intake}`)
                alert("Course Deleted")
                fetchIntakes()
            }
        }
        catch(err){
            console.error("Failed to delete course" , err.reponse.data)
        }
    }

    const editIntake =(intake)=>{
        setShowForm(true)
        setEditIntakeData(intake);
    }



    return(
        <div className="table-container">
            <div className="add-new-btn-section">
                <button className="add-new-btn" onClick={()=>setShowForm(true)}>Add New</button>
            </div>
            <h1>Intake Management</h1>
            <TableFrame headers={headers}>
                <tbody>
                    {
                        intakes.map((intake,index)=>(
                            <tr key={index}>
                                <td>{intake.intake_code}</td>
                                <td>{intake.course.course_name}</td>
                                <td>{intake.start_date}</td>
                                <td>{intake.end_date}</td>
                                <td>{intake.curr_enrol}</td>
                                <td>{intake.max_enrol}</td>
                                <td>
                                    <div className="edit-delete-section">
                                        <button className="edit-btn" onClick={()=>editIntake(intake)}>Edit</button>
                                        <button className="delete-btn" onClick={()=>deleteIntake(intake.intake_code)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </TableFrame>
            {showForm && <AddIntakeForm closeForm={closeForm} submitSuccess={submitSuccess} editIntakeData={editIntakeData}/>}
        </div>
    )
}