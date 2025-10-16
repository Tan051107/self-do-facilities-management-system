<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $fillable =[
       'publisher',
       'posting_date_time',
       'title',
       'message',
       'recepient' 
    ];

    public function setRecepientAttribute($value){
        $this->attributes['recepient'] = strtoLower($value);
    }
}
