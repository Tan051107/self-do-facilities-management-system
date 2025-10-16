import "../css/ManageAnnouncement.css"
import axios from './axios.js';
import { useState } from "react";

export default function AddAnnouncementForm({submitSuccess, closeForm}){

    const user = JSON.parse(localStorage.getItem("user"))
    console.log(user)

    const [form,setForm] = useState({publisher:user.id,	posting_date_time:"",title:"",message:"", recepient:[]});
    const [allSelected, setAllSelected] = useState(false)

    const getMinDateTime = ()=>{
        const now = new Date();

        const local = new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,16)

        return local
    }

    const handleChange =(tableColumn,value) =>{
        setForm((prev)=>({...prev,[tableColumn]:value}))

    }

    const addAnnouncement = async()=>{
        try{
            console.log(form)
            await axios.post("/announcement",form);
            console.log("Announcement successfully added");
            alert("New announcement will be posted according to posting date and time")
            submitSuccess()
            setForm({publisher:user.id,	posting_date_time:"",title:"",message:"", recepient:[]})
        } 
    catch(err){
        console.error("Error adding announcement" ,err)
    } 
    }

    const recepients = ["Admin","Lecturer","Student"]

    const handleRoleChange = (role)=>{
        let updatedRoles = []
        if (form.recepient.includes(role)){
            updatedRoles = form.recepient.filter(r=>r!=role)
        }
        else{
            updatedRoles = [...form.recepient,role]
        }

        if (updatedRoles.length === recepients.length){
            setAllSelected(true);
            setForm((prev)=>({
                ...prev,
                recepient:['all']
            }))

        }
        else{
            setAllSelected(false);
            setForm((prev)=>({
                ...prev,
                recepient:updatedRoles
            }))
        }
    }

    const handleAllChange =()=>{
        if(allSelected){
            setAllSelected(false)
            setForm((prev)=>({
                ...prev,
                recepient:[]
            }))
        }
        else{
            setAllSelected(true);
            setForm((prev)=>({
                ...prev,
                recepient:['all']
            }))
        }
    }

    return(
        <div className="add-things-container">
            <div className="add-things-section">
                <h1>Add New Announcement</h1>
                <form className="add-announcement-form">
                    <div className="form-group">
                        <label>
                            <p>Posting Date & Time</p>
                            <input type="datetime-local" value={form.posting_date_time} min={getMinDateTime()} onChange={(e)=>handleChange("posting_date_time",e.target.value)}/>
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            <p>Title</p>
                            <input type="text" value={form.title} onChange={(e)=>handleChange("title",e.target.value)}/>
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            <p>Message</p>
                            <textarea rows="5" cols="10" value={form.message} onChange={(e)=>handleChange("message",e.target.value)} />
                        </label>
                    </div>
                    <div className="recepient-container">
                        <div className="recepient-section">
                            <p>Recepient</p>
                            <label>
                                <input type="checkbox" name="recepient" value= 'all' checked={allSelected} onChange={handleAllChange}/>
                                <p>All</p>
                            </label>
                            {recepients.map((recepient,index)=>(
                                <label key ={index} className="recepient-radio">
                                    <input type="checkbox" name="recepient" value={recepient} checked={form.recepient.includes(recepient)} onChange={()=>handleRoleChange(recepient)} disabled={allSelected}/>
                                    <p>{recepient}</p>
                                </label>
                        ))}
                    </div>

                    </div>
                </form>
                <div className="add-cancel-btn-section">
                    <button className="add-btn" onClick={()=>addAnnouncement()}>Add</button>
                    <button className="cancel-btn" onClick={closeForm}>Cancel</button>
                </div>
            </div>
        </div>
    )
}