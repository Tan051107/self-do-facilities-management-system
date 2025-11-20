<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SubjectController extends Controller
{
    public function addSubject(Request $request){
        $incomingFields = $request -> validate([
            'subject_code' => ['required' , Rule::unique('subjects' , 'subject_code')],
            'subject_name' => ['required']
        ]);

        $subject = Subject::create($incomingFields);
    }

    public function getSubject(){
        return Subject::all();
    }

    public function deleteSubject(Subject $subject){
        $subject -> delete();
    }

    public function updateSubject ( Request $request , Subject $subject){

        $incomingFields = $request -> validate([
            'subject_code' => ['required'],
            'subject_name' => ['required']
        ]);

        $subject -> update($incomingFields);
    }
}
