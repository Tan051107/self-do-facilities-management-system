<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
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
Route::get('/allAnnouncement' , [AnnouncementController::class, 'getAllAnnouncement']);
Route::middleware('auth:sanctum')-> get('/announcement',[AnnouncementController::class , 'getAnnouncement']);
Route::delete('/announcement' , [AnnouncementController::class , 'deleteAnnouncement']);