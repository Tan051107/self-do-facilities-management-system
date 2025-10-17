import { fetchNotifications } from "./notification.js"
import { useState,useEffect } from "react"
import '../css/Notification.css'
import DetailNotification from "./DetailNotification.jsx"

export default function Notification (){

    const [notifications,setNotifications] = useState([])
    const[showDetailNotification,setShowDetailNotification] = useState(false)
    const [notificationDetails,setNotificationDetails] = useState([]);

    const fetchNotification = async()=>{
        const result = await fetchNotifications();
        setNotifications(result)
    }

    useEffect(()=>{
        fetchNotification()
    },[])

    const handleShowDetailNotification = (notificationDetails)=>{
        setNotificationDetails(notificationDetails);
        setShowDetailNotification(true)
    }

    return(
        <div className="display-notification-outer-container">
            <h1>Notification</h1>
            <div className="display-notification-container">
                {
                    notifications.map((notification,index)=>(
                        <div key={index} className={`${index%2===0 ? "even-notification":""} notification`}>
                            <h1>{notification.title}</h1>
                            <div className="posting_date_time_container">
                                <p>{notification.posting_date_time}</p>
                                <span className="material-symbols-rounded view-detail-notification-icon" onClick={()=>handleShowDetailNotification(notification)}>arrow_forward_ios</span>
                            </div>
                        </div>
                    ))
                }
            </div>
            {showDetailNotification && <DetailNotification notificationDetails={notificationDetails} setShowDetailNotification={()=>setShowDetailNotification(false)}/>}
        </div>
    )
}