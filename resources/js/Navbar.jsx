import React, { useState, useEffect} from "react";
import apuLogo from '../images/apu-logo.png';
import "../css/Navbar.css"; // Import CSS
import '../css/app.css';
import {Link, useNavigate} from "react-router-dom"
import  {useNotifications} from '../context/NotificationContext.jsx'

export default function Navbar( ) {
  const {unreadCount, markAllAsRead,notifications} = useNotifications();
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const role = localStorage.getItem('user-role')
  const[isShowNotification,setIsShowNotification] = useState(false)
  const [windowWidth,setWindowWidth] = useState(window.innerWidth)
  const [expandedDropDowns, setExpandedDropDowns] = useState(new Set())
  const [onHoverLabel , setOnHoverLabel] = useState()
  const nonAdminNavBarElements = [
    { url: '/timetable', label: "Timetable"},
    { url: '/library', label: "Library"},
    { url: '/facility-reservation', label: "Facility Reservation"},
    { url: '/transport', label: "Transport Service"},
    { url: '/feedback', label: "Feedback"}
    ];
  
    const adminNavBarElements =[
      {label: "Academics", 
        dropdowns:[
          {url:"/intake-management" , label:"Intake Management"},
          {url:"/course-management" , label:"Course Management"},
          {url:"/subject-management" , label:"Subject Management"},
          {url:"/timetable-management", label:"Timetable Management"}
        ]},
      {label: "Services",
        dropdowns:[
          { url: "/library-management", label: "Library"},
          {url:"/transport-management" , label: "Transport Management"} 
        ]
      },
      {label:"Feedback & Announcement", 
      dropdowns:[
        {url: "/feedback-management", label: "Feedback Management"},
        { url: "/announcement", label: "Announcement"},
      ]
      },
      {label: "Account Management" , 
      dropdowns:[
        {url:"/admin-management" , label: "Admin Account Management"},
        {url:"/student-management" , label: "Student Account Management"},
        {url:"/leturer-management" , label: "Lecturer Account Management"}
      ]
      }
    ]

    const navBarElements = role=="admin"? adminNavBarElements : nonAdminNavBarElements;

    useEffect(()=>{
      const handleResize =()=>setWindowWidth(window.innerWidth);
      window.addEventListener('resize',handleResize);
      return()=>window.removeEventListener('resize',handleResize)
    },[])

    // Prevent body scroll when mobile menu is open
    useEffect(()=>{
      if(open && windowWidth<=768){
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
      }
      return ()=>{
        document.body.classList.remove('no-scroll');
      }
    },[open, windowWidth])

    const showNotification = async()=>{
      if(windowWidth<=768){
        navigate('/notifications')
      }
      else{
        setIsShowNotification(prev=>!prev)
      }
    }


    const toggleExpand = (index)=>{
      const latestExpand = new Set(expandedDropDowns);
      if (latestExpand.has(index)){
        latestExpand.delete(index)
      }
      else{
        latestExpand.add(index)
      }
      setExpandedDropDowns(latestExpand)
    }

    const resetExpand =()=>{
      setOpen(false);
      setExpandedDropDowns(new Set())
    }

    function MobileMenu(){
      return(
        <div className={`mobile-menu-container ${open && windowWidth<=768 ? "active" : ""}`}>
          {                
            navBarElements.map((navBarElement,index)=>(
              navBarElement.dropdowns?
              (<div key={index}>
                <div className="mobile-header-menu">
                  <p>{navBarElement.label}</p>
                  <span className="material-symbols-rounded" onClick={()=>toggleExpand(index)}>
                    {expandedDropDowns.has(index) ? "expand_less" : "expand_more"}
                  </span>
                </div>
                {expandedDropDowns.has(index)&&
                (
                  <div className="mobile-dropdown-menu">
                    {
                      navBarElement.dropdowns.map((dropdown,childIndex)=>(
                        <Link key={childIndex} to={dropdown.url} onClick={()=>resetExpand()}>{dropdown.label}</Link>
                      ))
                    }
                  </div>
                )
              }
              </div>)
              :(<Link key={index} to={navBarElement.url} className="mobile-header-menu link" onClick={()=>resetExpand()}>{navBarElement.label} </Link>)
            ))        
          }
        </div>
      )
    }


    function NotificationDropDown(){
      return(
        <div className='dropdown-notification-container'>
          <div className="dropdown-notification-header">
            <h1>My Notifications &#40; {unreadCount} &#41; </h1>
            <p onClick={()=>markAllAsRead()}>Mark All As Read</p>
          </div>
          {notifications.length===0? (<p>No notification</p>)
          : (
            <div className="dropdown-notification-section">
              {notifications.slice(0,5).map((notification,index)=>(
                <div key={index} className= {`dropdown-notification ${index%2===0? "even-notification" : ""}`}>
                  {!notification.is_read && <div className="unread-sign"></div>}
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
        <Link to ={`${role === "admin" ? "admin/" : ""}homepage`} onClick={()=>resetExpand()}><img className="logo" src={apuLogo} alt="Apu Logo"/></Link>
        <nav className={`navbar ${open? "active":""}`}>
          {
            navBarElements.map((navBarElement,index)=>(
              navBarElement.dropdowns?(
                <div key={index} className="header-menu" onMouseOver={()=>setOnHoverLabel(index)} onMouseOut={()=>setOnHoverLabel()}>
                  <div className="desktop-navbar-label-container">
                    <span className="link">{navBarElement.label}</span>
                    <span className="material-symbols-rounded" onClick={()=>toggleExpand(index)}>
                      {onHoverLabel === index ? "expand_more" : "expand_less"}
                    </span>                  
                  </div>
                  <div className="dropdown-container">
                    {
                      navBarElement.dropdowns.map((dropdown,index)=>(
                        <Link to={dropdown.url} key={index} className="dropdown-item">{dropdown.label}</Link>
                      ))
                    }
                  </div>                
                </div>
              ): (<Link to={navBarElement.url} className="link" key={index}>{navBarElement.label}</Link>)
            ))
          }
        </nav>
        <div className="icon-container">
          <button className="notification-icon-container" 
          onClick={
            ()=>{
              showNotification();
              resetExpand()}}>
            <span className="material-symbols-rounded notification-icon">notifications</span>
            {unreadCount>0 && <span className="unread-notification-count">{unreadCount}</span>}
            {isShowNotification && <NotificationDropDown/>}
          </button>
          <Link to="/profile" className="icon-button">
              <button className="profile-icon-container" onClick={()=>resetExpand()}>
                <span className="material-symbols-rounded">person</span>
              </button>
          </Link>
          <button className="hamburger-menu-btn" 
                  onClick={
                        ()=>{
                          setOpen(prev=>!prev);
                          setExpandedDropDowns(new Set());
                          }}>
            <span className="material-symbols-rounded">
              {open ? "close" : "menu"}
            </span>
          </button>
        </div>      
      </div>
      <MobileMenu/>
    </header>
  );
}
