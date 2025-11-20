import FormFrame from "./FormFrame";
import { useEffect, useState } from "react";
import axios from "./axios.js";


export default function AddSubjectForm({closeForm,submitSuccess, editSubjectData}){

    const [form,setForm] = useState({subject_code:"" , subject_name:""})

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

    const handlePostSubject = async()=>{
        try{
            const request = await (editSubjectData 
                ? axios.put(`/subject/${editSubjectData.id}` ,form)
                : axios.post('/subject' , form)
            )
            console.log(request.data);
            alert(editSubjectData ? "Subject is Updated" : "Subject is Added" )
            setForm({subject_code:"" , subject_name:""})
            submitSuccess()
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
                </label>
            </div>
            <div className="form-group">
                <label>
                    <p>Subject Name</p>
                    <input type="text" value={form.subject_name} onChange={(e)=>handleChange("subject_name" , e.target.value)}/>
                </label>
            </div>           
        </FormFrame>
    )
}