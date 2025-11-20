<?php

namespace App\Models;

use App\Models\Course;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $primaryKey = 'subject_code';
    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable =[
        'subject_code',
        'subject_name'
    ];

    public function courses(){
        return $this -> belongsToMany(
            Course::class,
            'course_subject',
            'subject_code',
            'course_code',
        ) 
        -> withPivot('semester')
        ->withTimestamps();   ;
    }
}
