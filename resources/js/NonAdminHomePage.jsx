import "./HomePage.css"
import Slider from './Slider.jsx';
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";

export default function NonAdminHome(){

    function returnGreetings (){
        const now = new Date();
        const currentHour = now.getHours()
        if (currentHour > 15){
            return "Good Evening"
        }
        else if (currentHour <12){
            return "Good Morning"
        }
        else{
            return "Good Afternoon"
        }
    }

    const greeting = returnGreetings();
    const quickAccessElements =[
        {url:"/timetable", label:"View Timetable"},
        {url:"/library", label:"Library"},
        {url:"/facility-reservation", label:"Book Facility"},
        {url:"/feedback", label:"Feedback"}
    ]

    const {user} = useContext(UserContext)


    return(
        <div>
            <div className="homepage-container">
                <h1 className="greeting">{`${greeting} , ${user.name}`}</h1>
                <Slider/>
                <div className="quick-access-schedule-container">
                    <div className="quick-access-container">
                        <h1>Quick Access</h1>
                        <div className="quick-access-element-container">
                            {
                                quickAccessElements.map((quickAccessElement,index)=>(
                                    <Link to={quickAccessElement.url} key={index}><button className="quick-access-element">{quickAccessElement.label}</button></Link>
                                ))
                            }
                        </div>
                    </div>
                    <div className="schedule-container">
                        <h1>Today's schedule</h1>
                        <div className="schedule-content-container">
                            <div className="schedule">
                                <p>Capstone Project</p>
                                <p>Auditorium</p>
                                <p>8.30 AM - 10.30 AM</p>
                                <p>Lecturer:Benjamin</p>
                            </div>
                            <div className="schedule">
                                <p>Capstone Project</p>
                                <p>Auditorium</p>
                                <p>8.30 AM - 10.30 AM</p>
                                <p>Lecturer:Benjamin</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}