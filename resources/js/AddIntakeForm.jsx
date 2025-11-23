import FormFrame from "./FormFrame.jsx";
import axios from './axios.js'
import { useState,useEffect } from "react";
import '../css/Form.css'


export default function AddIntakeForm({closeForm , submitSuccess , editIntakeData}){
    const currDate = new Date().toLocaleDateString("en-CA")
    const [courses,setCourses] = useState([]);
    const [form,setForm] = useState(
        {
            intake_code:"",
            course_code:"",
            max_enrol:"",
            curr_enrol:"",
            start_date:"",
            end_date:"",           
        }
    )
    const [validationErrors , setValidationErrors] = useState({})

    useEffect(()=>{
        if(editIntakeData){
            setForm(
                {
                    intake_code:editIntakeData.intake_code,
                    course_code:editIntakeData.course_code,
                    max_enrol:editIntakeData.max_enrol,
                    curr_enrol:editIntakeData.curr_enrol,
                    start_date:editIntakeData.start_date,
                    end_date:editIntakeData.end_date,                    
                }
            )
        }
    },[])

    const fetchCourses = async()=>{
        try{
            const courseData = await axios.get('/course')
            setCourses(courseData.data)
        }
        catch(err){
            console.error("Failed to fetch courses", err.response.data)
        }
    }

    useEffect(()=>{
        fetchCourses()
    },[])

    const handleChange = (column,value)=>{
        setForm(prev=>(
            {
                ...prev,
                [column]: value
            }
        ))
    }

    const handleEnrolNoChange =(column , enrolNo)=>{
        if(enrolNo === "" || Number(enrolNo) >= 0){
            setForm(prev=>(
                {
                    ...prev,
                    [column]:enrolNo
                }
            ))
        }
    }

    const handleChangeDate = (newStartDate)=>{
        const startDate = new Date(newStartDate);
        const endDate = new Date(form.end_date);
        if(startDate > endDate){
            setForm(prev=>(
                {
                    ...prev,
                    end_date:""
                }

            ))
        }

    }

    const validateDetails =()=>{
        const errors = {};

        if(!form.intake_code){
            errors.intakeCodeError = "Intake code is required.";
        }

        if(!form.course_code){
            errors.courseError = "Course is required."
        }

        if(!form.curr_enrol){
            errors.currEnrolError = "Current enrollments is required."
        }

        if(!form.max_enrol){
            errors.maxEnrolError = "Maximum enrollments is required."
        }

        if(form.max_enrol && form.curr_enrol){
            if (Number(form.max_enrol) < Number(form.curr_enrol)){
                errors.enrolNoError = "Current enrollments cannot be more than maximum enrollments."
            }
        }

        if(!form.start_date){
            errors.startDateError = "Start date is required."
        }

        if(!form.end_date){
            errors.endDateError = "End date is required."
        }

        if(form.start_date && form.end_date){
            const startDate = new Date(form.start_date);
            const endDate =  new Date(form.end_date);
            if (startDate > endDate){
                errors.dateError = "Start date must be earlier that end date."
            }
        }

        return errors
    }

    const handlePostIntake = async()=>{
        const errors = validateDetails();
        setValidationErrors(errors);
        if (Object.keys(errors).length === 0){
            try{
                if(editIntakeData){
                    await axios.put(`/intake/${editIntakeData.intake_code}` , form)
                }
                else{
                    await axios.post('/intake' , form)              
                }
                console.log(form)
                alert(editIntakeData? "Intake Updated" : "New Intake Added");
                submitSuccess();
                setForm(
                    {
                        intake_code:"",
                        course_code:"",
                        max_enrol:"",
                        curr_enrol:"",
                        start_date:"",
                        end_date:"",           
                    }
                )
            }
            catch(err){
                console.error("Failed to add/update new intake" , err.response.data)
            }
        }
    }


    return(
        <FormFrame title={editIntakeData ? "Update Intake" :"Add Intake"} addButtonLabel={editIntakeData ? "Update" : "Add"} addButtonFunction={handlePostIntake} cancelButtonFunction = {closeForm}>
            <div className="form-group">
                <label>
                    <p>Intake Code</p>
                    <input type="text" value={form.intake_code} onChange={(e)=>handleChange("intake_code" , e.target.value)}/>
                    {validationErrors.intakeCodeError && <div className="error-message">{validationErrors.intakeCodeError}</div>}
                </label>
            </div>
            <div className="form-group">
                <label>
                    <p>Course</p>
                    <select value={form.course_code} onChange={(e)=>handleChange("course_code", e.target.value)}>
                        <option value="">Please select a course</option>
                        {
                            courses.map((course,index)=>(
                                <option key={index} value={course.course_code}>{course.course_name}</option>
                            ))
                        }
                    </select>
                    {validationErrors.courseError && <div className="error-message">{validationErrors.courseError}</div>}                   
                </label>
            </div>
            <div className="full-width-error-message-container">
                <div className="form-row">
                    <div className="form-group">
                        <label>
                            <p>Current Enrollments</p>
                            <input type="number" min="0" value={form.curr_enrol}
                                    onChange={(e)=>handleEnrolNoChange('curr_enrol' , e.target.value)}/>
                            {validationErrors.currEnrolError && <div className="error-message">{validationErrors.currEnrolError}</div>}
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            <p>Maximum Enrollments</p>
                            <input type="number" min="0" value={form.max_enrol}
                                    onChange={(e)=>handleEnrolNoChange('max_enrol' , e.target.value)}/>
                            {validationErrors.maxEnrolError && <div className="error-message">{validationErrors.maxEnrolError}</div>}
                        </label>
                    </div>              
                </div>
                {validationErrors.enrolNoError && <div className="error-message">{validationErrors.enrolNoError}</div>}         
            </div>
            <div className="full-width-error-message-container">
                <div className="form-row">
                    <div className="form-group">
                        <label>
                            <p>Start Date</p>
                            <input type="date" value={form.start_date} min={currDate}  onKeyDown={(e) => e.preventDefault()} 
                                                onChange={(e)=>
                                                    {
                                                        handleChange("start_date" , e.target.value);
                                                        handleChangeDate(e.target.value)
                                                    }}/>
                            {validationErrors.startDateError && <div className="error-message">{validationErrors.startDateError}</div>}
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            <p>End Date</p>
                            <input type="date" value ={form.end_date} min={form.start_date} onKeyDown={(e) => e.preventDefault()} onChange={(e)=>handleChange("end_date" , e.target.value)}/>
                            {validationErrors.endDateError && <div className="error-message">{validationErrors.endDateError}</div>}
                        </label>
                    </div>
                    {validationErrors.dateError && <div className="error-message">{validationErrors.dateError}</div>}
                </div>
            </div>
        </FormFrame>
    )
}