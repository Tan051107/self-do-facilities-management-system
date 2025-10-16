<?php

namespace App\Http\Controllers;

use App\Models\BusSchedule;
use Illuminate\Http\Request;

class BusScheduleController extends Controller
{
    public function addBusSchedule (Request $request){
        $incomingFields = $request -> validate([
            'origin'=> ['required','string'],
            'destination'=>['required','string'],
            'arrival_time' => ['required', 'date_format:H:i'],
            'origin' =>'unique:bus_schedules,origin,NULL,id,arrival_time,'.$request->arrival_time
        ]);

        $bus_schedule = BusSchedule::create($incomingFields);
    }

    public function getBusSchedule (){
        return BusSchedule::all();       
    }

    public function deleteBusSchedule (BusSchedule $bus_schedule){
        $bus_schedule -> delete();
    }
}
