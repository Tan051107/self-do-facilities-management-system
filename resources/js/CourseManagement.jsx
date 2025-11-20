import { useState,useEffect } from "react";
import TableFrame from './TableFrame.jsx'
import AddCourseForm from "./AddCourseForm.jsx";
import axios from './axios.js';
import "../css/CourseManagement.css"
export default function CourseManagement(){
    
    const [showForm,setShowForm] = useState(false);
    const [courses,setCourses] =useState([]);
    const headers = ['Course Code','Course Name','Subjects']

    const fetchCourses= async()=>{
        try{
            const courseData = await axios.get('/course');
            setCourses(courseData.data);
            console.log(courseData.data);
        }
        catch(err){
            console.error('Failed to fetch courses',err.response.data);
        }
    }

    useEffect(()=>{
        fetchCourses()
    },[])

    const submitSuccess =()=>{
        setShowForm(false)
        fetchCourses();
    }


    return(
        <div className="table-container">
            <div className="add-new-btn-section">
                <button className="add-new-btn" onClick={()=>setShowForm(true)}>Add New</button>
            </div>
            <h1>Course Management</h1>
            <TableFrame headers={headers}>
                <tbody>
                    {
                        courses.map((course,index)=>(
                            <tr key={index}>
                                <td>{course.course_code}</td>
                                <td>{course.course_name}</td>
                                <td>
                                    <div className="course_table_subject_column">
                                        {
                                            Object.entries(course.sem_data).map(([semester , subjects])=>(
                                                <div key={semester}className="individual_semester_subject_section">
                                                    <p>{`Semester ${semester}`}</p>
                                                    <ol>
                                                        {
                                                            subjects.map((subject , index)=>(
                                                                <li key={index}>{subject.subject_name}</li>
                                                            ))
                                                        }
                                                    </ol>                                                    
                                                </div>                                              
                                            ))
                                        }                                       
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </TableFrame>
            {showForm && <AddCourseForm closeForm={()=>setShowForm(false)} submitSuccess={submitSuccess}/>}
        </div>
    )
}