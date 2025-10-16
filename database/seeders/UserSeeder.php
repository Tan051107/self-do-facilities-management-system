<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        $users=[
            [
                'user_id' => 1,
                'name' => 'Alice Admin',
                'email' => 'admin@example.test',
                'country' => 'Malaysia',
                'DOB' => '1985-05-10',
                'gender' => 'Female',
                'role' => 'admin',
                'email_verified_at' => $now,
                'password' => Hash::make('password'),
                'remember_token' => Str::random(10),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'user_id' => 2,
                'name' => 'Bob Lecturer',
                'email' => 'lecturer@example.test',
                'country' => 'Singapore',
                'DOB' => '1978-09-20',
                'gender' => 'Male',
                'role' => 'lecturer',
                'email_verified_at' => $now,
                'password' => Hash::make('password'),
                'remember_token' => Str::random(10),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'user_id' => 3,
                'name' => 'Cindy Student',
                'email' => 'student@example.test',
                'country' => 'Indonesia',
                'DOB' => '2001-03-15',
                'gender' => 'Female',
                'role' => 'student',
                'email_verified_at' => $now,
                'password' => Hash::make('password'),
                'remember_token' => Str::random(10),
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('users') ->insert($users);
    }
}
