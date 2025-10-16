import "../css/TransportManagement.css"
import '../css/Form.css'
import axios from "./axios.js"
import { useState, useEffect } from "react";

export default function AddScheduleForm ({submitSuccess}){
    
    const [route,setRoute] = useState("apu-to-lrt")
    const [form,setForm] = useState({origin:"",destination:"",arrival_time:""})

    useEffect(()=>{
        const isAputoLrt = route === "apu-to-lrt";
        setForm((prev)=>({
            ...prev,
            origin:isAputoLrt? "APU" : "LRT",
            destination:isAputoLrt? "LRT" : "APU"
        }))
    },[route])

    const handleAddTime = async ()=>{
        try{
            const result = await axios.post("/addBusSchedule",form);
            console.log("new_schedule_added",result.data);
            submitSuccess();
            console.log(route)
            alert("New Schedule Added");

        }
        catch(err){
            console.error("Error adding schedule",err)
        }
        finally{
            setRoute("")
            setForm({origin:"",destination:"",arrival_time:""})
        }
    };


    return(
            <div className = "add-things-container">
                <div className = "add-things-section">
                    <h1>Add New Schedule Time</h1>
                    <form action="" className="add-schedule-form">
                        <div className="form-group">
                            <label>
                                <p>Route</p>
                                <select name="route" value={route} onChange={(e)=>setRoute(e.target.value)}>
                                    <option value="apu-to-lrt"> APU ➡ LRT</option>
                                    <option value="lrt-to-apu"> LRT ➡ APU</option>
                                </select>
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                <p>Arrival Time</p>
                                <input type="time" value ={form.arrival_time} onChange={(e)=>setForm((prev)=>({...prev,arrival_time:e.target.value}))}/>
                            </label>
                        </div>
                    </form>
                    <div className="add-cancel-btn-section">
                        <button className="add-btn" onClick={()=>handleAddTime()}>Add</button>
                        <button className="cancel-btn" onClick={()=>submitSuccess()}>Cancel</button>
                    </div>
                </div>
            </div>
            )

    }

