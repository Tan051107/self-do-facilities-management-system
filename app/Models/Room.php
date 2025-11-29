<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $primaryKey = "room_code";
    public  $incrementing = false;
    protected $keyType = "string";

    protected $fillable = [
        'room_code',
        'room_type',
        'max_cap',
        'time_slots'
    ];

    protected $casts = [
        'time_slots' => 'array'
    ];
}
