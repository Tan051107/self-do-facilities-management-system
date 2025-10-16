import '../css/DisplayBusSchedule.css'
import { useState, useEffect } from 'react'
import axios from './axios.js'
import ToggleSwitch from "./ToggleSwitch";

export default function DisplayBusSchedule(){

    const [busSchedules, setBusSchedules] = useState([]);


    const fetchBusSchedule = async()=>{
        try{
            const result = await axios.get('/getBusSchedule');
            setBusSchedules(result.data)
            console.log(result.data)
        }
        catch(err){
            console.error("Failed to fetch course",err)
        }
    }

    useEffect(()=>{
        fetchBusSchedule()
    },[])

    const AputoLRTSchedule = busSchedules.filter(busSchedule=>busSchedule.origin==="APU");
    const LRTtoAPUSchedule = busSchedules.filter(busSchedule=>busSchedule.origin==="LRT")

    const formatTo12Hour = (time24)=>{
        const [hour,minute] = time24.split(":");
        let formattedHour = parseInt(hour,10);
        const ampm = formattedHour>12? "PM":"AM";
        formattedHour = formattedHour%12 || 12;
        return `${formattedHour}:${minute} ${ampm}`

    }


    function toMinutes (time24){
        const [hour,minutes] = time24.split(":").map(Number);
        return hour*60+minutes

    }

    function isPastTime (time24){
        const now = new Date ();
        const currentMinutes = now.getHours()*60 + now.getMinutes();
        return currentMinutes > toMinutes(time24) 

    }


    function BusScheduleSection ({busSchedules,route}){

        const [showAll,setShowAll] = useState(false)
        const [countDown,setCountDown] = useState("")

        const sortedBusSchedule = [...busSchedules].sort((a,b)=>toMinutes(a.arrival_time)-toMinutes(b.arrival_time))

        const upcomingSchedule = sortedBusSchedule.filter((busSchedule)=>!isPastTime(busSchedule.arrival_time))

        const visibleSchedule = showAll ? sortedBusSchedule : upcomingSchedule.slice(0,4)

        useEffect(()=>{
            if (sortedBusSchedule ===  0 ){
                setCountDown("No buses scheduled")
                return;
            }

            const interval = setInterval(()=>{
                const now = new Date();
                const nextBusTime = new Date();

                const nextBus = sortedBusSchedule.find((bus)=>!isPastTime(bus.arrival_time));

                if (!nextBus){
                    setCountDown("No Upcoming buses")
                    return;
                }

                const [nextBusHour, nextBusMinute , nextBusSecond = 0] = nextBus.arrival_time.split(":").map(Number)
                nextBusTime.setHours(nextBusHour,nextBusMinute,nextBusSecond,0)
                const diff = nextBusTime - now

                if (diff <=0){
                    setCountDown("Arrived")
                    return;
                }

                const minutes = Math.floor(diff/60000)
                const seconds = Math.floor((diff%60000)/1000)
                setCountDown(`Countdown: ${minutes} minutes ${seconds} seconds`)
                
            },1000)

            return() => clearInterval(interval)


        },[busSchedules])

        return(
            <div className="display-bus-schedule-container">
                <div className="parent-container">
                    <div className="toggle-switch-container">
                        <p className="show-all-label">Show All</p>
                        <ToggleSwitch isOn={showAll} onToggle ={()=>setShowAll(!showAll)}/>
                    </div>
                </div>
                <div className="top-section">
                    {route}
                    <div className="countdown-timer">{countDown}</div>
                </div>
                <hr />
                <div className={`${visibleSchedule.length >0 ? "bus-schedule-section" : ""}`}>  
                    {visibleSchedule.length >0 ?(
                        visibleSchedule.map((schedule,index)=>(
                            <div key={index} className={`time ${isPastTime(schedule.arrival_time) ? "past-time" : "" }`}>
                                {formatTo12Hour(schedule.arrival_time)}
                            </div>
                        ))

                    ):
                    (<h1>No Upcoming Trips</h1>)
                    }                
                </div>
            </div>
        )
    }

    const APUtoLRTRouteDisplay =(
        <div className="route-display">
            <div className="icon-with-label">
                <span className="material-symbols-rounded">school</span>
                APU
            </div>
            <div>
                &#9654;
            </div>
            <div className="icon-with-label">
                <span className="material-symbols-rounded">train</span>
                LRT
            </div> 
        </div>
    )

    const LRTtoAPURouteDisplay =(
        <div className="route-display">
            <div className="icon-with-label">
                <span className="material-symbols-rounded">train</span>
                LRT
            </div> 
            <div>
                &#9654;
            </div>
            <div className="icon-with-label">
                <span className="material-symbols-rounded">school</span>
                APU
            </div>
        </div>
    )

    return(
        <div className="full-display-bus-schedule-container">
            <BusScheduleSection busSchedules={AputoLRTSchedule} route={APUtoLRTRouteDisplay}/>
            <BusScheduleSection busSchedules={LRTtoAPUSchedule} route={LRTtoAPURouteDisplay}/>
        </div>
    )
}