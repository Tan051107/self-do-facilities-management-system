<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\IntakeController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\BusScheduleController;
use App\Http\Controllers\AnnouncementController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('/login' , [AuthController::class,'login']);

Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

Route::post('/addBusSchedule', [BusScheduleController::class,'addBusSchedule']);
Route::get('/getBusSchedule',[BusScheduleController::class, 'getBusSchedule']);
Route::delete('/deleteSchedule/{bus_schedule}',[BusScheduleController::class,'deleteBusSchedule']);

Route::post('/announcement',[AnnouncementController::class, 'addAnnouncement']);
Route::put('/announcement/{announcement}',[AnnouncementController::class, 'editAnnouncement']);
Route::get('/allAnnouncement' , [AnnouncementController::class, 'getAllAnnouncement']);
Route::middleware('auth:sanctum')-> group(function(){
    Route::get('/announcement',[AnnouncementController::class , 'getAnnouncement']);

    Route::post('/announcement/{id}/read',[AnnouncementController::class, 'markAsRead']);

    Route::post('/announcement/read-all',[AnnouncementController::class,'markAllAsRead']);
});
Route::delete('/announcement' , [AnnouncementController::class , 'deleteAnnouncement']);


Route::post('/subject' , [SubjectController::class , 'addSubject']);
Route::get('/subject', [SubjectController::class, 'getSubject']);
Route::delete('/subject/{subject}', [SubjectController::class, 'deleteSubject']);
Route::put('/subject/{subject}', [SubjectController::class , 'updateSubject']);


Route::post('/course' , [CourseController::class , 'addCourse']);
Route::get('/course' , [CourseController::class , 'getAllCourse']);
Route::delete('/course/{course}' , [CourseController::class , 'deleteCourse']);
Route::put('/course/{course}' , [CourseController::class , 'editCourse']);

Route::post('/intake' , [IntakeController::class, 'addIntake']);
Route::get('/intake' , [IntakeController::class , 'getAllIntake']);
Route::delete('/intake/{intake}' , [IntakeController::Class , 'deleteIntake']);
Route::put('/intake/{intake}' , [IntakeController::class , 'editIntake']);


Route::post('/room' , [RoomController::class , 'addRoom']);
Route::get('/room' , [RoomController::class , 'getAllRooms']);
Route::delete('/room/{room}' , [RoomController::class , 'deleteRoom']);
Route::put('/room/{room}' , [RoomController::class , 'editRoom']);