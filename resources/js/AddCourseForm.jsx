import FormFrame from './FormFrame'
import '../css/CourseForm.css'
import '../css/Form.css'
import { useState,useEffect } from 'react'
import axios from './axios.js';
import SearchableDropdown from "./SearchableDropdown";

export default function AddCourseForm({closeForm , submitSuccess}){

    const [semesters,setSemesters] = useState([
        {   sem:1,
            subjects:[{subject_code:"",subject_name:""}]             
        }
    ])

    const [courseData,setCourseData] = useState({
        course_code:"",
        course_name:"",
    })

    const [subjects, setSubjects] = useState([])

    const fetchSubjects = async()=>{
        try{
            const subjectData = await axios.get('/subject');
            console.log(subjectData.data)
            setSubjects(subjectData.data)
        }
        catch(err){
            console.error("Failed to fetch subjects", err.response.data)
        }
    }

    useEffect(()=>{
        fetchSubjects();
    },[])


    const addSemester = ()=>{
        setSemesters(prev=>([
            ...prev,
            {
                sem:prev.length + 1,
                subjects:[{subject_code:"", subject_name:""}]
            }
        ]))
    }
    
    const deleteSemester = (sem)=>{
        const updated = semesters.filter((_,i)=>i !== sem);
        setSemesters(updated)

    }
    

    const addSubjects = (sem)=>{
        const updated = [...semesters];
        updated[sem].subjects.push({subject_code:"" , subject_name:""})
        setSemesters(updated)
    }

    const deleteSubject = (semIndex,subjectIndex) =>{
        setSemesters(prev =>
            prev.map((sem,index)=>index === semIndex
                ?{
                    ...sem,
                    subjects:sem.subjects.filter((_,index)=>index !== subjectIndex)
                }
                :sem
            )
        )
    }

    const getAvailableSubjects = (semIndex, subIndex) => {

        const selectedSubjects = semesters.flatMap((sem,semesterIndex)=>
            sem.subjects.filter((subject,subjectIndex)=>
                            subject.subject_code !== "" &&
                            !(semIndex === semesterIndex && subIndex === subjectIndex)
                        )
                        .map(subject=>subject.subject_code)
        )

        return subjects.filter(subject=> !selectedSubjects.includes(subject.subject_code))
    };


    const handleSelectSubject =(semIndex,subjectIndex,selectedSubject)=>{
        setSemesters(prev=>
            prev.map((sem,index)=>
                index === semIndex
                ? {
                    ...sem,
                    subjects: sem.subjects.map((subject, index)=>
                        index === subjectIndex ? {
                                                    subject_code: selectedSubject.subject_code,
                                                    subject_name: selectedSubject.subject_name                                                   
                                                }
                                                : subject
                    )
                }
                : sem
            )
        )
    }

    const handleCourseDataChange = (column , value)=>{
        setCourseData(prev=>({
            ...prev,
            [column]:value
        }))
    }

    const handlePostCourse = async()=>{
        const semesterData = semesters.flatMap(semester=>
            semester.subjects.map(subject=>({
                semester:semester.sem,
                subject_code:subject.subject_code
            }))
        )

        const sendData = {
            course_code: courseData.course_code,
            course_name:courseData.course_name,
            semData:semesterData
        }

        try{
            await axios.post('/course' , sendData);
            console.log(sendData)
            alert("Course Added")
            submitSuccess()
        }
        catch(err){
            console.error("Failed to add course" , err.response.data)
        }


    
    }



    return(
        <FormFrame title="Add Course" addButtonLabel="Add" cancelButtonFunction={closeForm} addButtonFunction={handlePostCourse}>
            <div className="form-group">
                <label>
                    <p>Course Code</p>
                    <input type="text" onChange={(e)=>handleCourseDataChange("course_code" , e.target.value)} />
                </label>
            </div>
            <div className="form-group">
                <label>
                    <p>Course Name</p>
                    <input type="text" onChange={(e)=>handleCourseDataChange("course_name" , e.target.value )}/>
                </label>
            </div>
            <div className="add-semester-btn-section">
                <button type="button" className="add-new-btn" onClick={()=>addSemester()}>Add Semester</button>
            </div>           
            {
                semesters.map((sem,semIndex)=>(
                        <div className="sem-container" key={semIndex}>
                            <div className="sem-name-section">
                                <p className="sem-name">{`Semester ${semIndex + 1}`}</p>
                                <button type="button" className="delete-btn delete-semester" onClick={()=>deleteSemester(semIndex)}>Delete Semester</button>
                            </div>
                            {
                                sem.subjects.map((subject,subjectIndex)=>(
                                    <div className="form-group subject-input-label-container" key={crypto.randomUUID()}>
                                        <p>{`Subject ${subjectIndex+1}`}</p>
                                        <div className="subject-input-container">
                                            <SearchableDropdown options={getAvailableSubjects(semIndex,subjectIndex)} 
                                                                value={subject.subject_name} 
                                                                onSelect={(subject)=>handleSelectSubject(semIndex,subjectIndex,subject)}
                                            />
                                            <button type="button" className="delete-subject-btn" onClick={()=>deleteSubject(semIndex,subjectIndex)}>
                                                <span className="material-symbols-rounded">delete</span>
                                            </button>
                                        </div>
                                    </div>                                       
                                ))
                            }
                            <p className="add-subject-btn" onClick={()=>addSubjects(semIndex)}><span className="material-symbols-rounded">add</span> Add Subject</p>
                        </div>     
                ))
            }
        </FormFrame>
    )
}