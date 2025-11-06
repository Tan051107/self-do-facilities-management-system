import { useState,useEffect} from "react"
import '../css/Notification.css'
import DetailNotification from "./DetailNotification.jsx"
import {useNotifications} from '../context/NotificationContext.jsx'

export default function Notification (){
    const {notifications,markAsRead,markAllAsRead} = useNotifications()
    const[showDetailNotification,setShowDetailNotification] = useState(false)
    const [notificationDetails,setNotificationDetails] = useState([]);


    const handleShowDetailNotification = (notificationDetails)=>{
        setNotificationDetails(notificationDetails);
        setShowDetailNotification(true)
        markAsRead(notificationDetails.id);
    }

    return(
        <div className="display-notification-outer-container">
            <h1>Notification</h1>
            <div className="display-notification-container">
                {
                    notifications.map((notification,index)=>(
                        <div key={index} className={`${index%2===0 ? "even-notification":""} notification`}>
                            <div className="posting_date_time_container">
                                <h1>{notification.title}</h1>
                                {!notification.is_read && <div className="unread-sign"></div>}
                            </div>
                            <div className="posting_date_time_container">
                                <p>{notification.posting_date_time}</p>
                                <span className="material-symbols-rounded view-detail-notification-icon" onClick={()=>handleShowDetailNotification(notification)}>arrow_forward_ios</span>
                            </div>
                        </div>
                    ))
                }
                <p className="mark-all-as-read" onClick={()=>markAllAsRead()}>Mark All As Read</p>
            </div>
            {showDetailNotification && <DetailNotification notificationDetails={notificationDetails} setShowDetailNotification={()=>setShowDetailNotification(false)}/>}
        </div>
    )
}