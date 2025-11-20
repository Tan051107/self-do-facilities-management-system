<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CourseController extends Controller
{
    public function addCourse(Request $request) {
        $incomingFields = $request -> validate([
            'course_code' => ['required' , 'string', Rule::unique('courses', 'course_code')],
            'course_name' => ['required' , 'string'],
            'semData'=>['required', 'array'],
            'semData.*.semester' => ['required' , 'integer'],
            'semData.*.subject_code' =>['required' , 'string' ,Rule::exists('subjects' , 'subject_code') ]
        ]);

        $course = Course::create([
            'course_code' => $incomingFields['course_code'],
            'course_name' => $incomingFields['course_name']
        ]);

        $pivotData = [];

        foreach($incomingFields['semData'] as $sem){
            $pivotData[$sem['subject_code']] = ['semester' => $sem['semester']];
        }

        $course ->subjects()->attach($pivotData);

        return response()->json([
            'message' => 'Course added',
            'course' => $course -> load('subjects')
        ], 201);
    }

    public function getAllCourse(){
        $courses = Course::with('subjects')->get();

        $sendData = $courses->map(function($course){
            return[
                'course_code' => $course->course_code,
                'course_name' => $course->course_name,
                'sem_data'=>$course->subjects
                            ->groupBy('pivot.semester')
                            ->map(function($subjects){
                                return $subjects->map(function($subject){
                                    return[
                                        'subject_code'=>$subject->subject_code,
                                        'subject_name'=> $subject->subject_name
                                    ];
                                })->toArray();
                            })
                            ->toArray()

            ];
        })->toArray();

        return response()->json($sendData);
    }
}
