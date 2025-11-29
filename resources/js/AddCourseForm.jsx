import FormFrame from './FormFrame'
import '../css/CourseForm.css'
import '../css/Form.css'
import { useState,useEffect } from 'react'
import axios from './axios.js';
import SearchableDropdown from "./SearchableDropdown";

export default function AddCourseForm({closeForm , submitSuccess , editCourseData}){

    const [semesters,setSemesters] = useState([
        {   sem:1,
            subjects:[{subject_code:"",subject_name:""}]             
        }
    ])

    const [courseData,setCourseData] = useState({
        course_code:"",
        course_name:"",
    })

    const [validationError, setValidationError] = useState({})


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

    useEffect(()=>{
        if(editCourseData){
            setCourseData({
                course_code:editCourseData.course_code,
                course_name:editCourseData.course_name,
            })
            const formattedSemData = Object.entries(editCourseData.sem_data).map(([semester,subs])=>(
                {
                    sem:semester,
                    subjects:subs.map(sub=>({
                        subject_code:sub.subject_code,
                        subject_name:sub.subject_name
                    }))
                }
            ))

            setSemesters(formattedSemData)
        }      
    },[editCourseData])


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

    const validateDetails = ()=>{
        const errors = {};

        if (!courseData.course_code){
            errors.courseCodeError = "Course code is required."
        }

        if(!courseData.course_name){
            errors.courseNameError = "Course name is required."
        }

        if(semesters.length < 1){
            errors.semesterError = "At least one semester is required."
        }       
        else{
            semesters.forEach((semester,semIndex)=>{
                if (semester.subjects.length > 0){
                        semester.subjects.forEach((subject,subIndex)=>{
                        let subjectError = "";

                        if(!subject.subject_code){
                            subjectError= "Please select a valid subject."
                        }

                        if(!subject.subject_name){
                            subjectError= "Subject is required."
                        }

                        if(subjectError){
                            if(!errors[semIndex]) errors[semIndex] = {}
                            errors[semIndex][subIndex] = subjectError;
                        }                   
                    })                   
                }
                else{
                    errors[`emptySubjectError${semIndex}`] = "Subject is required"
                }
            })
        }

        return errors
    }

    const handlePostCourse = async()=>{
        const errors = validateDetails();
        setValidationError(errors);
        if(Object.keys(errors).length === 0){
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
                if(editCourseData){
                    await(axios.put(`/course/${editCourseData.course_code}`,sendData))
                }
                else{
                    await axios.post('/course' , sendData);
                }
                console.log(sendData)
                alert(editCourseData ? "Course Updated" : "Course Added")
                submitSuccess()
            }
            catch(err){
                console.error("Failed to add course" , err.response.data)
            }
        }   
    }

    return(
        <FormFrame title={editCourseData ? "Edit Course" : "Add Course"} addButtonLabel={editCourseData? "Update" : "Add"} cancelButtonFunction={closeForm} addButtonFunction={handlePostCourse}>
            <div className="form-group">
                <label>
                    <p>Course Code</p>
                    <input type="text" value={courseData.course_code} onChange={(e)=>handleCourseDataChange("course_code" , e.target.value)}/>
                    {validationError.courseCodeError && <div className="error-message">{validationError.courseCodeError}</div>}
                </label>
            </div>
            <div className="form-group">
                <label>
                    <p>Course Name</p>
                    <input type="text" value={courseData.course_name} onChange={(e)=>handleCourseDataChange("course_name" , e.target.value )}/>
                    {validationError.courseNameError && <div className="error-message">{validationError.courseNameError}</div>}
                </label>
            </div>
            <div className="add-semester-btn-section">
                <button type="button" className="add-new-btn" onClick={()=>addSemester()}>Add Semester</button>
            </div>           
            {
                semesters.map((sem,semIndex)=>(
                        <div className="sem-container" key={semIndex}>
                            <div className="sem-name-section">
                                <p className="input-title">{`Semester ${semIndex + 1}`}</p>
                                <button type="button" className="delete-btn delete-semester" onClick={()=>deleteSemester(semIndex)}>Delete Semester</button>
                            </div>
                            {
                                sem.subjects.map((subject,subjectIndex)=>(
                                    <div className="form-group" key={crypto.randomUUID()}>
                                        <label>
                                            <p className="has-title-label">{`Subject ${subjectIndex+1}`}</p>
                                            <div className="subject-input-container">
                                                <SearchableDropdown options={getAvailableSubjects(semIndex,subjectIndex)} 
                                                                    value={subject.subject_name} 
                                                                    onSelect={(subject)=>handleSelectSubject(semIndex,subjectIndex,subject)}
                                                />
                                                <button type="button" className="bin-delete-btn" onClick={()=>deleteSubject(semIndex,subjectIndex)}>
                                                    <span className="material-symbols-rounded">delete</span>
                                                </button>
                                            </div>
                                        </label>
                                        {validationError[semIndex]?.[subjectIndex] && <div className="error-message">{validationError[semIndex]?.[subjectIndex]}</div>}                           
                                    </div>                                       
                                ))
                            }
                            <p className="add-btn-p" onClick={()=>addSubjects(semIndex)}><span className="material-symbols-rounded">add</span> Add Subject</p>
                            {validationError[`emptySubjectError${semIndex}`] && <div className="error-message">{validationError[`emptySubjectError${semIndex}`]}</div>}
                        </div>     
                ))
            }
            {validationError.semesterError && <div className="error-message">{validationError.semesterError}</div>}
        </FormFrame>
    )
}