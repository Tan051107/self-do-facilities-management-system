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
        Schema::create('course_subject', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table-> string('course_code');
            $table -> string('subject_code');
            $table -> integer('semester');
            $table -> string('lecturer_id') -> nullable();

            $table->foreign('course_code')
                  ->references('course_code')
                  ->on('courses')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');

            $table -> foreign('subject_code')
                    ->references('subject_code')
                    ->on('subjects')
                    ->onDelete('cascade')
                    ->onUpdate('cascade');

            $table -> foreign('lecturer_id')
                    ->references('user_id')
                    ->on('users')
                    ->onDelete('set null')
                    ->onUpdate('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_subject');
    }
};


