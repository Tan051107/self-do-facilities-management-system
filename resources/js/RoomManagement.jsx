import { useState, useEffect} from "react"
import AddRoomForm from "./AddRoomForm.jsx"
import axios from './axios.js'
import TableFrame from './TableFrame.jsx'

export default function RoomManagement(){
    const [showForm , setShowForm] = useState(false)
    const [rooms , setRooms] = useState([])
    const headers = ['Room Code' , 'Room Type' , 'Maximum Capacity' , 'Time Slots' , 'Actions']
    const [editRoomData , setEditRoomData] = useState()

    const fetchRooms =async()=>{
        try{
            const roomData = await axios.get('/room');
            setRooms(roomData.data);
            console.log(roomData.data)
        }
        catch(err){
            console.error('Failed to fetch rooms' , err.response.data)
        }
    }

    useEffect(()=>{
        fetchRooms();
    },[])

    const closeForm = ()=>{
        setShowForm(false);
        setEditRoomData(null)
    }

    const submitSuccess =()=>{
        fetchRooms();
        closeForm();
    }

    const deleteRoom =async(room)=>{
        if(window.confirm("Are you sure you want to delete this room?")){
            try{
                await axios.delete(`room/${room}`)
                fetchRooms();
                alert("Room deleted")
            }
            catch(err){
                console.error('Failed to delete room' , err.response.data)
            } 
        }    
    }

    const editRoom = (room)=>{
        setEditRoomData(room);
        setShowForm(true)
    }


    return(
        <div className="table-container">
            <div className="add-new-btn-section">
                <button className="add-new-btn" onClick={()=>{setShowForm(true)}}>Add New</button>
            </div>
            <h1>Room Management</h1>
            <TableFrame headers ={headers}>
                <tbody>
                    {
                        rooms.map((room,index)=>(
                            <tr key={index}>
                                <td>{room.room_code}</td>
                                <td style={{ textTransform: 'capitalize'}}>{room.room_type}</td>
                                <td>{room.max_cap}</td>
                                <td>
                                    <ol>
                                        {
                                            room.time_slots.map((timeSlot,index)=>(
                                                <li key={index}>{`${timeSlot.start_time.substring(0,5)} - ${timeSlot.end_time.substring(0,5)}`}</li>
                                            ))
                                        }
                                    </ol>
                                </td>
                                <td>
                                    <div className="edit-delete-section">
                                        <button className="edit-btn" onClick={()=>editRoom(room)}>Edit</button>
                                        <button className="delete-btn" onClick={()=>deleteRoom(roomCode)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }                
                </tbody>
            </TableFrame>
            {showForm && <AddRoomForm closeForm = {closeForm} submitSuccess ={submitSuccess} editRoomData={editRoomData}/>}
        </div>

    )
}