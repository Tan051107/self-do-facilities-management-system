<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class RoomController extends Controller
{
    protected function checkTimeSlotCrash($timeSlots){
        usort($timeSlots , function($a , $b){
            return strcmp($a['start_time'] , $b['start_time']);
        });

        for ($i=0 ; $i < count($timeSlots) -1  ; $i++){
            $currSlot = $timeSlots[$i];
            $nextSlot = $timeSlots[$i +1];

            if($nextSlot['start_time'] < $currSlot['end_time']){
                return "Time slot {$i} clashes with".($i +1);
            }      
        };

        return null;
    }

    public function addRoom (Request $request){

        $incomingRequests = $request -> validate([
            'room_code' => ['required' , 'string' , Rule::unique('rooms', 'room_code')],
            'room_type' => ['required' , 'string'],
            'max_cap' => ['required' , 'integer'],
            'time_slots'=> ['required' , 'array'],
            'time_slots.*.start_time' => ['required' , 'date_format:H:i'],
            'time_slots.*.end_time' => ['required' , 'date_format:H:i']
        ]);

        $isTimeSlotCrash = $this->checkTimeSlotCrash($incomingRequests['time_slots']);

        if($isTimeSlotCrash){
            return response()->json([
                'errors'=>[
                    'time_slots'=> $isTimeSlotCrash
                ]
            ],422);
        };

        try {
            $room = Room::create([
                'room_code' => $incomingRequests['room_code'],
                'room_type' => $incomingRequests['room_type'],
                'max_cap' => $incomingRequests['max_cap'],
                'time_slots' => $incomingRequests['time_slots'],
            ]);

            return response()->json([
                'message' => "Room is added",
                'room' => $room
            ]);

        } catch (QueryException $e) {
            // Catch DB errors (duplicate key, JSON invalid, etc)
            return response()->json([
                'errors' => [
                    'database' => $e->getMessage()
                ]
            ], 500);
        }
    }

    public function getAllRooms(){

        return $rooms = Room::all();
    }

    public function deleteRoom(Room $room){
        $room->delete();
    }

    public function editRoom(Request $request , Room $room){
        $incomingRequests = $request -> validate([
            'room_code' => ['string' , 'required' , Rule::unique('rooms' , 'room_code')->ignore($room)],
            'room_type' => ['string' , 'required'],
            'max_cap' => ['integer' , 'required'],
            'time_slots' => ['required' , 'array'],
            'time_slots.*.start_time' => ['required' , 'date_format:H:i'],
            'time_slots.*.end_time' => ['required' , 'date_format:H:i']
        ]);

        $isTimeSlotCrash = $this->checkTimeSlotCrash($incomingRequests['time_slots']);

        if($isTimeSlotCrash){
            return response()->json([
                'errors' => [
                    'time_slots' => $isTimeSlotCrash
                ]
            ],422);
        }

        $room->update([
            'room_code'=> $incomingRequests['room_code'],
            'room_type' => $incomingRequests['room_type'],
            'max_cap'=> $incomingRequests['max_cap'],
            'time_slots'=> $incomingRequests['time_slots']
        ]);
    }
}
