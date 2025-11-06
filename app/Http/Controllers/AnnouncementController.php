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

        $announcement = Announcement::create($incomingFields);



        return response()->json(['message' => 'Announcements added successfully'], 201);

    }

    public function getAnnouncement(Request $request){
        $user = auth()->user();

        if(!$user){
            return response()-> json(['error'=>'Unauthorized'],401);
        }


        $announcements = Announcement::where('posting_date_time',"<=",now())
                                      ->where (function($userAnnouncements) use ($user){
                                        $userAnnouncements -> whereJsonContains('recepient','all')
                                                           ->orWhereJsonContains('recepient', $user->role);
                                      })
                                      ->orderByDesc('posting_date_time')
                                      ->get()
                                      ->map(function($announcement) use ($user){
                                        $announcement -> is_read = $user -> readAnnouncements()
                                                      -> where('announcement_id',$announcement->id)
                                                      ->exists();
                                        return $announcement;
                                      });

        return response()->json($announcements);
    }

    public function getAllAnnouncement(){
        $announcements =  Announcement::all();

        return response()->json($announcements);
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

    public function markAsRead(Request $request , $announcementId){
        $user = auth()->user();

        if(!$user){
            return response()-> json(['error'=>'Unauthorized'],401);
        }

        $user -> readAnnouncements()-> syncWithoutDetaching([
            $announcementId => ['read_at'=> now()]
        ]);

        return response()->json([
            'message' => 'Announcement marked as read',
        ]);
    }

    public function markAllAsRead(Request $request){
        $user = auth()-> user();

        if(!$user){
            return response()-> json(['error' =>'Unauthorized'],401);
        }

        $unreadAnnouncements = Announcement::where('posting_date_time','<=',now())
                                            ->whereIn('recepient',[$user->role,'all'])
                                            ->pluck('id')
                                            ->toArray();
        if(!empty($unreadAnnouncements)){
            $user->readAnnouncements()->syncWithoutDetaching(
                array_fill_keys($unreadAnnouncements,['read_at'=>now()])
            );
        }

        return response() -> json([
            'message' => 'All announcements marked as read'
        ]);
    }

    public function editAnnouncement(Request $request, Announcement $announcement){
        $incomingFields = $request ->validate([
            'publisher' => ['required','integer'],
            'posting_date_time' => ['required' , 'date'],
            'title' => ['required' , 'string'],
            'message' => ['required' , 'string'],
            'recepient' => ['required', 'array']
        ]);


        $announcement -> update($incomingFields);
    }
}
