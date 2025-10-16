import '../css/Table.css'
import { useState,useEffect } from "react"
import AddAnnouncementForm from "./AddAnnouncementForm.jsx"
import axios from './axios.js'


export default function ManageAnnouncement(){

    const [announcements, setAnnouncements] = useState([])
    const [showForm,setShowForm] = useState(false)

    const fetchAnnouncements = async () => {
        try {
            const result = await axios.get('/allAnnouncement');
            setAnnouncements(result.data);
        } catch (err) {
            console.error('Failed to fetch announcements:', err);
        }
    };

    useEffect(()=>{
        fetchAnnouncements()
    },[])

    const isPastDateTime =(dateTime)=>{
        const now = new Date();
        const parsedDateTime = new Date(dateTime)
        return now >= parsedDateTime
    }

    const submitSuccess = ()=>{
        setShowForm(false);
        fetchAnnouncements();
    }

    const deleteAnnouncement = async(data) => {
        if (window.confirm("Are you sure you want to delete this announcement?")){
            try{
                await axios.delete('/announcement',{data:data});
                fetchAnnouncements();
                alert("Announcement Deleted")

            }
            catch(err){
                console.error("Error deleting announcement" , err)
            }
        }
    }

    

    return(
        <div className="table-container">
            <div className="add-new-btn-section">
                <button className="add-new-btn" onClick={()=>{setShowForm(true)}}>Add New</button>
            </div>
            <h1>Announcement Management</h1>
            <table className="schedule-timetable" border="1" cellPadding="12">
                <thead>
                    <tr>
                        <th>Posting Date & Time</th>
                        <th>Title</th>
                        <th>Message</th>
                        <th>Recepient</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        announcements.map((notification,index)=>(
                            <tr key={index}>
                                <td>{notification.posting_date_time}</td>
                                <td>{notification.title}</td>
                                <td>{notification.message}</td>
                                <td>{notification.recepient.charAt(0).toUpperCase()+notification.recepient.slice(1)}</td>
                                <td>
                                    {
                                        !isPastDateTime(notification.posting_date_time) && (
                                        <div className="edit-delete-section">
                                            <button className="edit-btn">Edit</button>
                                            <button className="delete-btn" onClick={()=>deleteAnnouncement({posting_date_time:notification.posting_date_time, id:notification.id})}>Delete</button>
                                        </div>
                                        )
                                    }
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>  
            {showForm && <AddAnnouncementForm submitSuccess={submitSuccess} closeForm={()=>setShowForm(false)}/>}    
        </div>
    )
    
}