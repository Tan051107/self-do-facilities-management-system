import { useState, useEffect } from "react";
import AddSubjectForm from "./AddSubjectForm";
import TableFrame from './TableFrame.jsx'
import axios from './axios.js'
export default function SubjectManagement(){
    
    const [showForm,setShowForm] = useState(false);
    const [subjects,setSubjects] =useState([]);
    const headers = ["Subject Code" , "Subject Name" , "Actions"]
    const [editSubjectData , setEditSubjectData] = useState()

    const fetchSubject = async()=>{
        try{
            const result = await axios.get('subject');
            console.log(result.data);
            setSubjects(result.data)
        }
        catch(err){
            console.log("Failed to fetch subjects",err)
        }
    }

    useEffect(()=>{
        fetchSubject()
    },[])

    const submitSuccess =()=>{
        setShowForm(false);
        fetchSubject();
        setEditSubjectData(null)
    }

    const deleteSubject =async(id)=>{
        if (window.confirm("Are you sure you want to delete this subject?")){        
            try{
                await axios.delete(`/subject/${id}`)
                console.log("Subject Deleted");
                fetchSubject();
                alert("Subject Deleted")
            }
            catch(err){
                console.error("Failed to delete subject" ,err)
            }               
        }
    }

    const editSubject = (subjectData) =>{
        setEditSubjectData(subjectData);
        setShowForm(true);
    }

    return(
        <div className="table-container">
            <div className="add-new-btn-section">
                <button className="add-new-btn" onClick={()=>setShowForm(true)}>Add New</button>
            </div>
            <h1>Subject Management</h1>
            <TableFrame headers={headers}>
                <tbody>
                    {
                        subjects.map((subject,index)=>(
                            <tr key={index}>
                                <td>{subject.subject_code}</td>
                                <td>{subject.subject_name}</td>
                                <td className="edit-delete-section">
                                    <button className="edit-btn" onClick={()=>editSubject(subject)}>Edit</button>
                                    <button className="delete-btn" onClick={()=>deleteSubject(subject.id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </TableFrame>
            {showForm && <AddSubjectForm closeForm={()=>{
                                                        setShowForm(false)
                                                        setEditSubjectData(null)
                                                        }} 
                                        submitSuccess={submitSuccess} 
                                        editSubjectData={editSubjectData}/>}
        </div>
    )
}