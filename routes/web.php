<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any}', function () {
    return view('welcome'); // Change 'app' to your Blade file name
})->where('any', '.*');
