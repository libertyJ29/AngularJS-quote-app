<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Session\Store;
use App\Http\Middleware\VerifyCsrfToken;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Lang;

use App\User;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers {
        sendLoginResponse as traitsendLoginResponse;		//rename the trait method for this controller
    }


    protected $redirectPath = '/';
    protected $loginPath = '/dashboard';			//after logging in
    protected $redirectAfterLogout = '/';			//after logging out
    //path for redirect if not logged in and try to access protected route (app/Exceptions/handler)
    protected $redirectTo = '/';		    		//where to redirect users after login


    protected $username = 'name';




    /**
     * Create a new controller instance
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest', ['except' => 'logout']);
    }




    public function username()
    {
        return 'name';
    }





    /**
     * Create a new user record
     *
     * @return void
     */
    protected function create(array $data)
    {
	$randomstring = str_random(60);				//generate a 60 character random string

        return User::create([
            'name' => $data['name'],
            'password' => bcrypt($data['password']),
	    'api_token' => $randomstring
        ]);
    }




    /**
     * Send the response after the user was authenticated
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    protected function sendLoginResponse(Request $request)
    {
	$request->session()->regenerate();

        $this->clearLoginAttempts($request);

	$user = auth()->user();
	
	redirect('/');	
	
	return  \Response::json(['message' => 'success', 'user' => $user]);

        //return $this->authenticated($request, $this->guard()->user())
        //        ?: redirect()->intended($this->redirectPath())->withErrors(['msg', 'success']);

    }




    /**
     * Get the failed login response instance
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    protected function sendFailedLoginResponse(Request $request)
    {
	return "fail";

        //return redirect()->back()
        //    ->withInput($request->only($this->username(), 'remember'))
        //    ->withErrors([
        //        $this->username() => Lang::get('auth.failed'),
	//      ])
	//    ->withErrors(['msg', 'false']);
            
    } 



    /**
     * Log the user out of the application, and regenerate the api_token for the user to invalidate the previous one
     *
     * @param \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request, $id)
    {
        $this->guard()->logout();
        $request->session()->flush();

	//generate a random new api_token for the user on logout
	$user = User::find($id);				//get the id of user who has just logged out
	$randomstring = str_random(60);				//generate a 60 character random string
        $user->api_token = $randomstring;
	$user->push();

        $request->session()->regenerate();
    }




}
