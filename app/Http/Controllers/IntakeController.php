<?php

namespace App\Http\Controllers;

use App\Models\Intake;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class IntakeController extends Controller
{
    public function addIntake(Request $request){
        $incomingFields  = $request->validate([
            'intake_code'=>['string','required' , Rule::unique('intakes', 'intake_code')],
            'course_code'=>['string' , 'required' , 'exists:courses,course_code'],
            'start_date' =>['date' , 'required'],
            'end_date' => ['date' , 'required' , 'after:start_date'],
            'max_enrol' => ['integer' , 'required' , 'min:0'],
            'curr_enrol' =>['integer' , 'required' , 'min:0']
        ]);

        $intake = Intake::create($incomingFields);
    }

    public function getAllIntake(){
        return Intake::with('course')->get();
    }

    public function deleteIntake(Intake $intake){
        $intake->delete();
    }

    public function editIntake(Request $request, Intake $intake){
        $incomingFields = $request ->validate([
            'intake_code'=> ['required' , 'string' , Rule::unique('intakes','intake_code')->ignore($intake)],
            'course_code'=> ['required' , 'string' , 'exists:courses,course_code'],
            'start_date'=> ['date' , 'required'],
            'end_date'=> ['date' , 'required' , 'after:start_date'],
            'max_enrol' => ['integer' , 'required' , 'min:0'],
            'curr_enrol' => ['integer' , 'required' , 'min:0']
        ]);

        $intake->update($incomingFields);

    }
}
