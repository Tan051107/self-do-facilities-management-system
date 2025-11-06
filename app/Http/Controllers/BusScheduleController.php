<?php

namespace App\Http\Controllers;

use App\Models\BusSchedule;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BusScheduleController extends Controller
{
    public function addBusSchedule (Request $request){
        $incomingFields = $request -> validate([
            'origin'=> ['required','string',
            Rule::unique('bus_schedules')
                 ->where('arrival_time', $request -> arrival_time)
                 ->where('destination', $request -> destination)
            ],
            'destination'=>['required','string'],
            'arrival_time' => ['required', 'date_format:H:i'],
        ],[
            'origin.unique' => 'A schedule for this route and time already exists'
        ]);

        $bus_schedule = BusSchedule::create($incomingFields);

        return response ()->json([
            'success' => true,
            'message' => 'Bus schedule created successfully',
            'data' => $bus_schedule,
        ],201);
    }

    public function getBusSchedule (){
        return BusSchedule::all();       
    }

    public function deleteBusSchedule (BusSchedule $bus_schedule){
        $bus_schedule -> delete();
    }
}
