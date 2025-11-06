import axios from '../js/axios.js';
import { useState,createContext,useContext,useEffect } from 'react';
import { UserContext } from './UserContext.jsx';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext)


export const NotificationProvider =({children})=>{
    const [notifications, setNotifications] = useState([]);
    const {user} = useContext(UserContext)

    const  fetchNotifications = async ()=>{
        try{
            const result = await axios.get('/announcement');
            const sortedNotifications = result.data.sort((a,b)=>{
                if(!a.is_read && b.is_read) return -1;
                if(a.is_read && !b.is_read) return 1;
                return 0
            })
            setNotifications(sortedNotifications)
        }
        catch(err){
            console.error('Failed to fetch announcements',err)
        }
    }

    useEffect(()=>{
        if(user) fetchNotifications()
    })

    const markAsRead = async (announcementId)=>{
        try{        
            setNotifications(prev=> {
                const updated = prev.map((notification)=>(
                    notification.id === announcementId ? {...notification,is_read:true} : notification)
                )
                return updated.sort((a,b)=>{
                    if (!a.is_read && b.is_read) return -1;
                    if (a.is_read && !b.is_read) return 1;
                    return 0;
                })
            })
            await axios.post(`/announcement/${announcementId}/read`)
        }
        catch(err){
            console.log("Failed to mark as read", err)
        }
    }

    const markAllAsRead = async()=>{
        try{
            await axios.post("/announcement/read-all");
            setNotifications(prev=>prev.map((notification)=>({...notification,is_read:true})))
        }
        catch(err){
            console.log("Failed to mark all as read" , err)
        }            
    }

    const totalUnreadCount = notifications.filter((notification) => !notification.is_read).length;
    const unreadCount =  totalUnreadCount > 99 ? "99+" : totalUnreadCount;


    return(
        <NotificationContext.Provider value={{notifications,markAsRead,markAllAsRead,unreadCount}}>
            {children}
        </NotificationContext.Provider>
    )

}