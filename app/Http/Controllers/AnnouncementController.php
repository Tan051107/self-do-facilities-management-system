<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function addAnnouncement(Request $request){

        $incomingFields = $request -> validate([
            'publisher' => ['required','integer'],
            'posting_date_time' => ['required' , 'date'],
            'title' => ['required' , 'string'],
            'message' => ['required' , 'string'],
            'recepient' => ['required', 'array']
        ]);


        if(in_array('all',$incomingFields['recepient'])){
            $roles = ['admin','lecturer','student'];
        }
        else{
            $roles = $incomingFields['recepient'];
        }

        foreach($roles as $role){
            Announcement::create([
                'publisher' => $incomingFields['publisher'],
                'posting_date_time' => $incomingFields['posting_date_time'],
                'title' => $incomingFields['title'],
                'message'  => $incomingFields['message'],
                'recepient' => $role
            ]);
        }

        return response()->json(['message' => 'Announcements added successfully'], 201);

    }

    public function getAnnouncement(Request $request){
        $user = auth()->user();

        if(!$user){
            return response()-> json(['error'=>'Unauthorized'],401);
        }
        

        $announcements = Announcement::where('posting_date_time',"<=",now())
        ->whereIn('recepient',[$user->role, 'all'])
        ->orderByDesc('posting_date_time')
        ->get();

        return response()->json($announcements);
    }

    public function getAllAnnouncement(){
        return Announcement::all();
    }

    public function deleteAnnouncement(Request $request){
        $postingDateTime = $request->input('posting_date_time');
        $id = $request -> input('id');

        if (now() >= $postingDateTime){
            return response () -> json(['error'=>"Date and time has passed"],400);
        }

        $announcement = Announcement::find($id);

        if (!$announcement){
            return response() ->json(['error'=>'ID not found'],404);
        }

        $announcement->delete();



    }
}
