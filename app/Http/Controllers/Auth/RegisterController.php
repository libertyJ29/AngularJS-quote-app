<?php

namespace App\Http\Controllers\Auth;

use App\User;
use Validator;
use Response;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Registered;

use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */
    use RegistersUsers;


    /**
     * Where to redirect users after login / registration.
     *
     * @var string
     */
    protected $redirectTo = '/';



    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }


    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        $validator = Validator::make($data, [
            'name' => 'required|max:255|unique:users',
            'password' => 'required|min:4|confirmed',
        ]);

	if($validator->fails()){
		return response()->json(['errors'=>$validator->errors()]);
	}
	else{
		return $validator;
	}

    }
	

    

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return User
     */
    protected function create(array $data)
    {
	$randomstring = str_random(60);				//generate a new random api_token for the new user

        return User::create([
            'name' => $data['name'],
            'password' => bcrypt($data['password']),
	    'api_token' => $randomstring,
        ]);
    }





    /**
     * Create a new user instance after a valid registration.
     *
     * @param $request - id, old_password, new_password
     * @return message
     */
    protected function change_password(Request $request)
    {
        $user = User::find($request['id']);			//get the user record for the passed in id	

	//check that the old_password entered by the user matches the password in db for the logged in user
	$oldPasswordCheck = Hash::check($request['old_password'], $user->password);

	if ($oldPasswordCheck == true){				//if old_password matches pw in db, then update user record in db with new_password
        	$user->password = bcrypt($request['new_password']);
        	$user->push();
		return  \Response::json(['message' => 'success' ]);
	} else {
		return  \Response::json(['message' => 'Old Password does not match that stored in database' ]);
	}
    }





    //from Illuminate\Foundation\Auth\RegistersUsers;
    /**
     * Handle a registration request for the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {
        $validator = $this->validator($request->all());	

	if($validator->fails()){
		return response()->json(['message'=>$validator->errors()]);
	} else {
		$validator->validate();					//if username and password passed the validation rules, then run validation
	}

        event(new Registered($user = $this->create($request->all())));

        return $this->registered($request, $user)
            ?: redirect($this->redirectPath());
    }




    

    /**
     * The user has been registered.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  mixed  $user
     * @return mixed
     */
    protected function registered(Request $request, $user)
    {
        return  \Response::json(['message' => 'success']);		//after registration is successfully completed 

    }







}
