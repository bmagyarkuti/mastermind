<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

// this fixed token mismatch exceptions
Route::group(['middleware' => ['web']], function() {
    Route::get('/', 'GameController@getLeaders');
    Route::post('step', 'GameController@postStep');
    Route::get('step', 'GameController@getStep');
    Route::get('newGame', 'GameController@newGame');

    // Authentication Routes...
    Route::get('auth/login', 'Auth\AuthController@getLogin');
    Route::post('auth/login', 'Auth\AuthController@postLogin');
    Route::get('auth/logout', 'Auth\AuthController@logout');
    Route::post('ajax/auth/login', 'Auth\AuthController@ajaxLogin');

    // Registration Routes...
    Route::get('auth/register', 'Auth\AuthController@getRegister');
    Route::post('auth/register', 'Auth\AuthController@postRegister');
});