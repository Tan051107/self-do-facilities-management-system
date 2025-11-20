import axios from './axios.js'
import { useState,useEffect } from 'react';
import '../css/TransportManagement.css';
import AddScheduleForm from './AddScheduleForm.jsx';
import TableFrame from './TableFrame.jsx';
export default function TransportManagement(){

    const [schedules,setSchedules] = useState([]);
    const [showForm,setShowForm] = useState(false);
    const headers = ["Origin" , "Destination" , "Departure" , "Actions"]

    const fetchSchedule = async()=>{
        try{
            const result = await axios.get('getBusSchedule');
            setSchedules(result.data)

        }
        catch(err){
            console.error("Failed to fetch data",err)
        }
    }

    useEffect(()=>{
        fetchSchedule();
    },[])

    const deleteSchedule = async (id)=>{
        if (window.confirm("Are you sure you want to delete this schedule?")){
            try{
                await axios.delete(`/deleteSchedule/${id}`);
                fetchSchedule();
                alert("Schedule is deleted")
            }
            catch(err){
                console.error("Failed to delete course",err);
            }
        }
    }

    const submitSuccess =()=>{
        setShowForm(false);
        fetchSchedule();
    }

    return(
        <div className="table-container">
            <div className="add-new-btn-section"><button className="add-new-btn" onClick={()=>setShowForm(true)}>Add New</button></div>
            <h1>Transport Management</h1>
            <TableFrame headers={headers}>
                <tbody>
                    {
                        schedules.map((schedule,index)=>(
                            <tr key={index}>
                                <td>{schedule.origin}</td>
                                <td>{schedule.destination}</td>
                                <td>{schedule.arrival_time.slice(0,5)}</td>
                                <td>
                                    <button className="delete-btn" onClick={()=>deleteSchedule(schedule.id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </TableFrame>
            {showForm && <AddScheduleForm submitSuccess={submitSuccess}/>}
        </div>
    )
}