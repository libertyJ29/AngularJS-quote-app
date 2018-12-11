<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/



// return app/views/index.php 
Route::get('/', function() {   
	return View::make('index'); 
});





// check user is logged in with web auth
Route::get('webAuth', function () {
	if (Auth::guard()->user() ) {
		return Auth::guard()->user();
	}
	else {
		return null;
	}
});




// get the csrf token for login
Route::get('token', function () {
        return csrf_token();
});





// get the quote photo from storage
Route::get('quote_photo/{filename}', function ($filename) {
//    	if (Auth::guard()->user() ) {
	if (Auth::check() ) {
		$path = storage_path('app/quote_photo/' . $filename);

    		if (!File::exists($path)) {
    		    	return "The requested photo does not exist!";
    		}

    		$file = File::get($path);
    		$type = File::mimeType($path);

    		$response = Response::make($file, 200);
    		$response->header("Content-Type", $type);

    		return $response;
//    	}
//    	else {
		//if user is not logged in
//		return "Unauthorised";
    	}
});	//->middleware('auth');





// get the sent PDF file from storage
Route::get('quote_pdf/{filename}', function ($filename) {
    	if (Auth::guard()->user() ) {
		$path = storage_path('app/quote_pdf/' . $filename);

    		if (!File::exists($path)) {
    			return "The requested PDF does not exist!";
    		}

    		$file = File::get($path);
    		$type = File::mimeType($path);

    		$response = Response::make($file, 200);
    		$response->header("Content-Type", $type);

    		return $response;
    	}
    	else {
		//if user is not logged in
		return "Unauthorised";
    	}
})->middleware('auth');






Route::get('/pdf_view{id}', 
    	array('as'=>'quote',
    	'middleware' => 'auth',
    	'uses'=>'pdfController@pdf_view')
);





// Authentication
Route::get('login', 'Auth\LoginController@showLoginForm')->name('login');

Route::post('login', 'Auth\LoginController@login');
Route::post('logout{id}', 'Auth\LoginController@logout')->name('logout');

// Registration
Route::get('register', 'Auth\RegisterController@showRegistrationForm')->name('register');
Route::post('register', 'Auth\RegisterController@register');

Route::post('change_password', [
	'as' => 'auth.change_password',
    	'middleware' => 'auth',
	'uses' => 'Auth\RegisterController@change_password'
]);
