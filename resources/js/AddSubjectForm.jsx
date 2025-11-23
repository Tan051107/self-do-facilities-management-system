import FormFrame from "./FormFrame";
import { useEffect, useState } from "react";
import axios from "./axios.js";


export default function AddSubjectForm({closeForm,submitSuccess, editSubjectData}){

    const [form,setForm] = useState({subject_code:"" , subject_name:""})
    const [validationErrors , setValidationErrors] = useState({});

    useEffect(()=>{
        if(editSubjectData){
            setForm({
                subject_code:editSubjectData.subject_code,
                subject_name:editSubjectData.subject_name
            })
        }
    },[editSubjectData])

    const handleChange =(column,value)=>{
        setForm(prev=>({
            ...prev,
            [column]:value
        }))
    }

    const validateDetails = ()=>{
        const errors ={};
        if (!form.subject_code){
            errors.subjectCodeError = "Subject code is required."
        }

        if(!form.subject_name){
            errors.subjectNameError = "Subject name is required."
        }

        return errors;
    }

    const handlePostSubject = async()=>{
        try{
            const errors = validateDetails();
            setValidationErrors(errors);
            if(Object.keys(errors).length === 0){
                if(editSubjectData){
                    await axios.put(`/subject/${editSubjectData.id}` ,form)
                }
                else{
                    axios.post('/subject' , form)                   
                }
                alert(editSubjectData ? "Subject is Updated" : "Subject is Added" )
                setForm({subject_code:"" , subject_name:""})
                submitSuccess()                
            }
        }
        catch(err){
            console.error(err)
        }
    }

    return(
        <FormFrame title={editSubjectData ? "Edit Subject " :"Add Subject"} addButtonLabel={editSubjectData ? "Update" :"Add"} addButtonFunction ={handlePostSubject} cancelButtonFunction={closeForm}>
            <div className="form-group">
                <label>
                    <p>Subject Code</p>
                    <input type="text" value={form.subject_code} onChange={(e)=>handleChange("subject_code", e.target.value)}/>
                    {validationErrors.subjectCodeError && <div className="error-message">{validationErrors.subjectCodeError}</div>}
                </label>
            </div>
            <div className="form-group">
                <label>
                    <p>Subject Name</p>
                    <input type="text" value={form.subject_name} onChange={(e)=>handleChange("subject_name" , e.target.value)}/>
                    {validationErrors.subjectNameError && <div className="error-message">{validationErrors.subjectNameError}</div>}                     
                </label>
            </div>           
        </FormFrame>
    )
}