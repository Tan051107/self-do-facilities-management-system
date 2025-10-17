import '../css/Notification.css'

export default function DetailNotification({notificationDetails,setShowDetailNotification}){
    return(
        <div className = "add-things-container">
            <div className = "add-things-section detail-notification-container">
                <div className="close-icon-container">
                    <h2>Notification Details</h2>
                    <span className="material-symbols-rounded close-icon" onClick={()=>setShowDetailNotification()}>close</span>
                </div>
                <div className="details-notification-header">
                    <h1>{notificationDetails.title}</h1>
                    <p>{notificationDetails.posting_date_time}</p>
                </div>
                <p className="notification-message">{notificationDetails.message}</p>
            </div>
        </div>
    )
}