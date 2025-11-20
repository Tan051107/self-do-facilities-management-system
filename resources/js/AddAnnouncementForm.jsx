import "../css/ManageAnnouncement.css"
import '../css/Form.css'
import axios from './axios.js';
import { useState,useEffect } from "react";
import FormFrame from "./FormFrame.jsx";


export default function AddAnnouncementForm({editAnnouncementData,submitSuccess, closeForm}){

    const user = JSON.parse(localStorage.getItem("user"))
    console.log(user)

    const [form,setForm] = useState({publisher:user.id,	posting_date_time:"",title:"",message:"", recepient:[]});
    const [validationError,setValidationError] = useState({})

    useEffect(() => {
        if (editAnnouncementData) {
        setForm({
            publisher: user?.id || "",
            posting_date_time: editAnnouncementData.posting_date_time,
            title: editAnnouncementData.title,
            message: editAnnouncementData.message,
            recepient: editAnnouncementData.recepient
        });
        }
    }, [editAnnouncementData, user?.id]);


    const getMinDateTime = ()=>{
        const now = new Date();

        const local = new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,16)

        return local
    }

    const handleChange =(tableColumn,value) =>{
        setForm((prev)=>({...prev,[tableColumn]:value}))

    }

    const validateDetails = ()=>{
        const errors= {};
        const now = new Date()

        const selectedDateTime = new Date(form.posting_date_time)
        if (!form.posting_date_time){
            errors.postingDateTimeError = "Please select a posting date and time"
        }

        if(selectedDateTime < now){
            errors.postingDateTimeError = "Posting date and time selected has passed"
        }

        if (!form.title){
            errors.titleError = "Please enter a title"
        }

        if(!form.message){
            errors.messageError = "Please enter message"
        }

        if(form.recepient.length===0){
            errors.recepientError = "Please select at least one recepient"
        }

        return errors
    }

    const handlePostAnnouncement = async()=>{
        console.log(form)
        const errors = validateDetails();
        setValidationError(errors)
        if (Object.keys(validationError).length === 0){
            try{
                console.log(form)
                const request = await(editAnnouncementData
                    ? axios.put(`/announcement/${editAnnouncementData.id}`,form)
                    : axios.post('/announcement',form)
                );
                console.log("Announcement successfully added");
                console.log(request.data)
                alert(editAnnouncementData ? "Announcement is updated" : "New announcement will be posted according to posting date and time")
                submitSuccess()
                setForm({publisher:user.id,	posting_date_time:"",title:"",message:"", recepient:[]})
                } 
            catch(err){
                console.error("Error adding announcement" ,err)
            }
        }
    }

    const recepients = ["admin","lecturer","student"]

    const handleRoleChange = (role)=>{
        let updatedRoles = []
        if (form.recepient.includes(role)){
            updatedRoles = form.recepient.filter(r=>r!=role)
        }
        else{
            updatedRoles = [...form.recepient,role]
        }

        if (updatedRoles.length === recepients.length||updatedRoles.includes('all')){
            setForm((prev)=>({
                ...prev,
                recepient:['all']
            }))

        }
        else{
            setForm((prev)=>({
                ...prev,
                recepient:updatedRoles
            }))
        }
    }


    return(
        <FormFrame title={`${editAnnouncementData ? "Edit" : "Add"} Announcement`} addButtonLabel = {editAnnouncementData ? "Update" : "Add"} addButtonFunction = {handlePostAnnouncement} cancelButtonFunction={closeForm}>
            <div className="form-group">
                <label>
                    <p>Posting Date & Time</p>
                    <input type="datetime-local" value={form.posting_date_time} min={getMinDateTime()} onChange={(e)=>handleChange("posting_date_time",e.target.value)}/>
                    {validationError.postingDateTimeError && <div className="error-message">{validationError.postingDateTimeError}</div>}
                </label>
            </div>
            <div className="form-group">
                <label>
                    <p>Title</p>
                    <input type="text" value={form.title} onChange={(e)=>handleChange("title",e.target.value)}/>
                    {validationError.titleError && <div className="error-message">{validationError.titleError}</div>}
                </label>
            </div>
            <div className="form-group">
                <label>
                    <p>Message</p>
                    <textarea rows="5" cols="10" value={form.message} onChange={(e)=>handleChange("message",e.target.value)} />
                    {validationError.messageError && <div className="error-message">{validationError.messageError}</div>}
                </label>
            </div>
            <div className="recepient-container">
                <div className="recepient-section">
                    <p>Recepient</p>
                    <label>
                        <input type="checkbox" name="recepient" value= 'all' checked={form.recepient.includes('all')} onChange={()=>handleRoleChange("all")}/>
                        <p>All</p>
                    </label>
                    {recepients.map((recepient,index)=>(
                        <label key ={index} className="recepient-radio">
                            <input type="checkbox" name="recepient" value={recepient} checked={form.recepient.includes(recepient)} onChange={()=>handleRoleChange(recepient)} disabled={form.recepient.includes('all')}/>
                            <p style={{ textTransform: 'capitalize'}}>{recepient}</p>
                        </label>
                ))}
                </div>
                {validationError.recepientError && <div className="error-message">{validationError.recepientError}</div>}
            </div>
        </FormFrame>
    )
}