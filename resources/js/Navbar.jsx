import React, { useState, useEffect} from "react";
import apuLogo from '../images/apu-logo.png';
import "../css/Navbar.css"; // Import CSS
import '../css/app.css';
import {Link, useNavigate} from "react-router-dom"
import { fetchNotifications } from "./notification.js";

export default function Navbar( ) {

  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const role = localStorage.getItem('user-role')
  const [notifications,setNotifications] = useState([])
  const[isShowNotification,setIsShowNotification] = useState(false)
  const [windowWidth,setWindowWidth] = useState(window.innerWidth)
  const nonAdminNavBarElements = [
    { url: '/timetable', label: "Timetable"},
    { url: '/library', label: "Library"},
    { url: '/facility-reservation', label: "Facility Reservation"},
    { url: '/transport', label: "Transport Service"},
    { url: '/feedback', label: "Feedback"}
    ];
  
    const adminNavBarElements =[
      { url: "/create-timetable", label: "Create Timetable"},
      { url: "/library-management", label: "Library"},
      { url: "/feedback-management", label: "Feedback Management"},
      { url: "/create-acc", label: "Create Account"},
      { url: "/announcement", label: "Announcement"},
      {url:"/transport-management" , label: "Transport Management"}     
    ]

    const navBarElements = role=="admin"? adminNavBarElements : nonAdminNavBarElements;

    useEffect(()=>{
      const handleResize =()=>setWindowWidth(window.innerWidth);
      window.addEventListener('resize',handleResize);
      return()=>window.removeEventListener('resize',handleResize)
    },[])

    const showNotification = async()=>{
      if(windowWidth<=768){
        navigate('/notifications')
      }
      else{
        const result = await fetchNotifications();
        setNotifications(result)
        setIsShowNotification(prev=>!prev)
      }
    }


    function NotificationDropDown(){
      return(
        <div className='dropdown-notification-container'>
          <div className="dropdown-notification-header">
            <h1>My Notifications &#40; 0 &#41; </h1>
            <p>Mark All As Read</p>
          </div>
          {notifications.length===0? (<p>No notification</p>)
          : (
            <div className="dropdown-notification-section">
              {notifications.map((notification,index)=>(
                <div key={index} className= {`dropdown-notification ${index%2===0? "even-notification" : ""}`}>
                  <h1>{notification.title}</h1>
                  <p className="posting-date-time">{notification.posting_date_time}</p>
                </div>
              ))}
            </div>
          )
          }
          <Link to='/notifications'><p className="view-all-notification">View All Notifications</p></Link>
        </div>
      )
    }

  return (
    <header>
      <div className="navbar-container">
        <Link to ={`${role === "admin" ? "admin/" : ""}homepage`}><img className="logo" src={apuLogo} alt="Apu Logo"/></Link>
        <nav className={`navbar ${open?"active":""}`}>
          {
            navBarElements.map((navBarElement,index)=>(
              <Link className="link" key={index} to={navBarElement.url}>{navBarElement.label}</Link>
            ))
          }
        </nav>
        <div className="icon-container">
            <button className="notification-icon-container" onClick={()=>showNotification()}>
              <span className="material-symbols-rounded">notifications</span>
              {isShowNotification && <NotificationDropDown/>}
            </button>
          <Link to="/profile" className="icon-button">
              <button className="profile-icon-container">
                <span className="material-symbols-rounded">person</span>
              </button>
          </Link>
          <button className="hamburger-menu-btn" onClick={()=>{open?setOpen(false):setOpen(true)}}>
            <span className="material-symbols-rounded">
              {open ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
