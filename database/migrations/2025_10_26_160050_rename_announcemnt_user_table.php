<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('announcemnt_user', function (Blueprint $table) {
            Schema::rename('announcemnt_user','announcement_user');
            //
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('announcemnt_user', function (Blueprint $table) {
            Schema::rename('announcement_user','announcemnt_user');
            //
        });
    }
};
