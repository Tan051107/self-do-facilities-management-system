<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request){
        $credentials = $request -> only('user_id','password');
        if (Auth::attempt($credentials)){
            $user = Auth::user();
            $token = $user -> createToken('auth_token') -> plainTextToken;    
            
            return response()->json([
                'message' => 'Login Successful',
                'role' => $user ->role,
                'token' => $token,
                'user' => $user
            ]);

        }

        return response () -> json([
            'message' => 'Login Failed'
        ]);
    }

    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();

        return response ()->json([
            'message' => "Logout Successfully"
        ]);

    }
}
