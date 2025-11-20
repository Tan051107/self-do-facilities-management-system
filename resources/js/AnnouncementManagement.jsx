import '../css/Table.css'
import { useState,useEffect } from "react"
import AddAnnouncementForm from "./AddAnnouncementForm.jsx"
import axios from './axios.js'
import TableFrame from './TableFrame.jsx'


export default function ManageAnnouncement(){

    const [announcements, setAnnouncements] = useState([])
    const [showForm,setShowForm] = useState(false)
    const [editAnnouncementData,setEditAnnouncementData] = useState()
    const headers = ["Posting Date Time", "Title" , "Message" , "Recepient" , "Actions" ]

    const fetchAnnouncements = async () => {
        try {
            const result = await axios.get('/allAnnouncement');
            console.log(result.data)
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

    const editAnnouncement =(announcementData) =>{
        setEditAnnouncementData(announcementData);
        setShowForm(true);
    }

    

    return(
        <div className="table-container">
            <div className="add-new-btn-section">
                <button className="add-new-btn" onClick={()=>{setShowForm(true)}}>Add New</button>
            </div>
            <h1>Announcement Management</h1>
            <TableFrame headers={headers}>
                <tbody>
                    {
                        announcements.map((notification,index)=>(
                            <tr key={index}>
                                <td>{notification.posting_date_time}</td>
                                <td>{notification.title}</td>
                                <td><div className="table-notification-message">{notification.message}</div></td>
                                <td>
                                    <ol>
                                        {notification.recepient.map((r, index) => (
                                            <li key={index} style={{ textTransform: 'capitalize'}}>{r}</li>
                                        ))}
                                    </ol>
                                </td>
                                <td>
                                    {
                                        !isPastDateTime(notification.posting_date_time) && (
                                        <div className="edit-delete-section">
                                            <button className="edit-btn" onClick={(()=>editAnnouncement(notification))}>Edit</button>
                                            <button className="delete-btn" onClick={()=>deleteAnnouncement({posting_date_time:notification.posting_date_time, id:notification.id})}>Delete</button>
                                        </div>
                                        )
                                    }
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </TableFrame>
            {showForm && <AddAnnouncementForm editAnnouncementData={editAnnouncementData} submitSuccess={submitSuccess} closeForm={()=>{setShowForm(false);setEditAnnouncementData()}}/>}    
        </div>
    )
    
}