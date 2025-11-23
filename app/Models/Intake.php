<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Intake extends Model
{
    protected $primaryKey = 'intake_code';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable=[
       'intake_code',
       'course_code',
       'start_date',
       'end_date',
       'curr_enrol',
       'max_enrol'
    ];

    public function course(){
        return $this->belongsTo(Course::class , 'course_code' , 'course_code');
    }

}
