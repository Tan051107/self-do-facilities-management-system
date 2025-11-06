<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// Add the scheduled task
Schedule::command('app:send-scheduled-announcements')
    ->everyMinute(); // Check every minute for scheduled announcements

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
