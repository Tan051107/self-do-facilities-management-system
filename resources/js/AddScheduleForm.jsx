import "../css/TransportManagement.css"
import '../css/Form.css'
import axios from "./axios.js"
import { useState, useEffect } from "react";
import FormFrame from "./FormFrame.jsx";

export default function AddScheduleForm ({submitSuccess}){
    
    const [route,setRoute] = useState("apu-to-lrt")
    const [form,setForm] = useState({origin:"",destination:"",arrival_time:""})
    const [error,setError] =useState({})

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
            if (err.response && err.response.status === 422){
                setError(err.response.data.errors)
            }
        }
        finally{
            setRoute("")
            setForm({origin:"",destination:"",arrival_time:""})
        }
    };


    return(
        <FormFrame title="Add New Schedule" addButtonLabel = "Add" addButtonFunction={handleAddTime} cancelButtonFunction={submitSuccess}>
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
                    {error.origin && <div className="error-message">{error.origin[0]}</div>}
                </label>   
            </div>       
        </FormFrame>
    )

    }

