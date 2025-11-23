<?php

namespace App\Models;

use App\Models\Subject;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $primaryKey = 'course_code';
    public $incrementing = false;   
    protected $keyType = 'string';  

    protected $fillable =[
        'course_code' , 
        'course_name'      
    ];

    public function subjects (){
        return $this ->belongsToMany(
            Subject::class,
            'course_subject',
            'course_code',
            'subject_code'
        )
        ->withPivot('semester')
        ->withTimestamps();   ;
    }

    public function intakes(){
        return $this->hasMany(Intake::class , 'course_code' , "course_code");
    }
}
