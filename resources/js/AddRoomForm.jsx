import FormFrame from "./FormFrame.jsx";
import { useState,useEffect} from "react";
import '../css/RoomForm.css'
import axios from './axios.js'

export default function AddRoomForm({closeForm , submitSuccess, editRoomData}){
    const [form , setForm] = useState(
        {
            room_code:"",
            room_type:"",
            max_cap:"",
            time_slots:[{start_time:"" ,end_time:""}]
        }
    )

    useEffect(()=>{
        if(editRoomData){
           setForm(
            {
                room_code:editRoomData.room_code,
                room_type:editRoomData.room_type,
                max_cap:editRoomData.max_cap,
                time_slots:editRoomData.time_slots      
            }
           )
        }
    },[])

    const [validationError , setValidationError] = useState({})

    const addTimeSlot = ()=>{
        setForm(prev =>(
            {
                ...prev,
                time_slots: [
                    ...prev.time_slots,
                    {start_time:"" ,end_time:""}                   
                 ]
            }
        ))
    }

    const deleteTimeSlot = (slotIndex) =>{
        setForm(prev => (
            {
                ...prev,
                time_slots: prev.time_slots.filter((_,index)=>index !== slotIndex)
            }
        ))
    }

    const handleChange = (column , value) =>{
        setForm(prev => (
            {
                ...prev,
                [column]: value
            }
        ))
    }

    const validateNumber = (number)=>{
        const cleanNumber = number.replace(/[^\d]/g, "")
        if (cleanNumber === "" || Number(cleanNumber) > 0){
            handleChange('max_cap' , cleanNumber)
        }
    }

    const handleChangeTime =(slotIndex , timeColumn ,  time)=>{
        setForm(prev => {
            const timeSlots = [...prev.time_slots];
            const currentSlot = {...timeSlots[slotIndex]};

            currentSlot[timeColumn] = time;

            const start = currentSlot.start_time;
            const end = currentSlot.end_time;

            const isValid = (!start || !end) || (end > start)

            if(!isValid) currentSlot.end_time = "";

            timeSlots[slotIndex] = currentSlot;

            return(
                {
                    ...prev,
                    time_slots:timeSlots
                }
            )
        })
    }

    const validateClashTimeSlot = () =>{
        const sortedTimeSlots = [...form.time_slots].sort((a,b) => a.start_time.localeCompare(b.start_time));

        for (let i = 0 ; i< sortedTimeSlots.length -1  ; i++){
            const currSlot = sortedTimeSlots[i];
            const nextSlot = sortedTimeSlots[i+1];

            if(currSlot.end_time > nextSlot.start_time){
                return{
                    clash:true,
                    slots: [i , i+1]
                }
            }
        }

        return{
            clash:false
        }
    }

    const validateDetails = ()=>{
        const errors = {}

        if(!form.room_code){
            errors.roomCodeError = "Room code is required."            
        }

        if(!form.room_type){
            errors.roomTypeError = "Room type is required"
        }

        if(!form.max_cap){
            errors.maxCapError = "Maximum capacity is required."
        }

        if(form.time_slots.length < 1){
            errors.timeSlotError = "At least one time slot is required."
        }

        if(form.time_slots.length > 1){
            const clashTimeSlotsError = {}
            const clashTimeSlots = validateClashTimeSlot();
            if(clashTimeSlots.clash){
                clashTimeSlots.slots.forEach(slot => clashTimeSlotsError[slot] = "Time Slot clashed")              
            }

            if(Object.keys(clashTimeSlotsError).length >= 1){
                errors.clashTimeSlotsError = clashTimeSlotsError
            }
        }

        return errors 
    }

    const handleSubmit = async()=>{
        const errors = validateDetails();
        setValidationError(errors);
        if(Object.keys(errors).length === 0){
            try{
                if(editRoomData){
                    await axios.put(`/room/${editRoomData.room_code}` , form)
                }
                else{
                    await axios.post('/room' , form)
                }
                alert(editRoomData ? "Room is updated" : "Room is added")
                submitSuccess();
                setForm(
                    {
                        room_code:"",
                        room_type:"",
                        max_cap:"",
                        time_slots:[{start_time:"" ,end_time:""}]
                    }
                )
            }
            catch(err){
                if (err.response) {
                    console.log(err.response.data); // Will show 'time_slots' or 'database' error
                } else {
                    console.error(err.message);
                }
            }
        }
    }

    return(
        <FormFrame title={editRoomData ? "Edit Room" : "Add Room"} addButtonLabel = {editRoomData ? "Update" : "Add"} addButtonFunction ={handleSubmit} cancelButtonFunction = {closeForm}>
            <div className="form-group">
                <label>
                    <p>Room Code</p>
                    <input type="text" value={form.room_code} onChange={(e)=>handleChange('room_code' , e.target.value)} />
                    {validationError.roomCodeError && <div className="error-message">{validationError.roomCodeError}</div>}
                </label>
            </div>
            <div className="form-group">
                <label>
                    <p>Room Type</p>
                    <select name="room-type" value={form.room_type} onChange={(e)=>handleChange('room_type' , e.target.value)}>
                        <option value="">Select a room</option>
                        <option value="auditorium">Auditorium</option>
                        <option value="classroom">Classroom</option>
                        <option value="computer lab">Computer Lab</option>
                        <option value="discussion room">Discussion Room</option>
                    </select>
                    {validationError.roomTypeError && <div className="error-message">{validationError.roomTypeError}</div>}
                </label>
            </div>
            <div>
                <label>
                    <p>Maximum Capacity</p>
                    <input type="text" value={form.max_cap} onChange={(e)=>validateNumber(e.target.value)} />
                    {validationError.maxCapError && <div className="error-message">{validationError.maxCapError}</div>}
                </label>
            </div>
            <div className="time-slot-section">
                {
                    form.time_slots.map((timeSlot , index)=>(
                        <div key={index} className="timeslot-section">
                            <div className="title-delete-section">
                                <p className="input-title">{`Time Slot ${index + 1}`}</p>
                                <button type="button" className="bin-delete-btn" onClick={()=>deleteTimeSlot(index)}> 
                                    <span className="material-symbols-rounded">delete</span>                                   
                                </button>
                            </div>
                            <div className="full-width-error-message-container">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>
                                            <p className="has-title-label">Start Time</p>
                                            <input type="time" value ={timeSlot.start_time} onChange={(e)=>handleChangeTime(index , 'start_time' , e.target.value)} />
                                        </label>
                                    </div>
                                    <div className = "form-group">
                                        <label>
                                            <p className="has-title-label">End Time</p>
                                            <input type="time" max="14:30" value ={timeSlot.end_time} onChange={(e)=>handleChangeTime(index, 'end_time' , e.target.value)} />
                                        </label>
                                    </div>
                                </div> 
                                {validationError.clashTimeSlotsError?.[index] && <div className="error-message">{validationError.clashTimeSlotsError[index]}</div>}                                                             
                            </div>                            
                        </div>
                    ))
                }
                <p className="add-btn-p" onClick={()=>{addTimeSlot()}}><span className="material-symbols-rounded">add</span> Add Time Slot</p>
                {validationError.timeSlotError && <div className="error-message">{validationError.timeSlotError}</div>}
            </div>
        </FormFrame>
    )
}