<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusSchedule extends Model
{
    protected $fillable =[
        'origin',
        'destination',
        'arrival_time'
    ];
}
