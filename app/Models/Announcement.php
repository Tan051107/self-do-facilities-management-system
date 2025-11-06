<?php

namespace App\Models;

use App\Models\User;
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
        if(is_array($value)){
            $value = array_map('strtolower',$value);
        }
        else{
            $value = strtolower($value);
        }

        $this -> attributes['recepient'] = json_encode($value);
    }

    protected $casts = [
        'recepient' => 'array',
    ];

    public function announcementRecepeint(){
        return $this -> belongsToMany(User::class,'announcement_users')
                    -> withPivot('read_at')
                    -> withTimestamps();
    }
}
