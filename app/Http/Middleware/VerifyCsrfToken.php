<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as BaseVerifier;

use Closure;
use Carbon\Carbon;
use Illuminate\Foundation\Application;
use Symfony\Component\HttpFoundation\Cookie;
use Illuminate\Contracts\Encryption\Encrypter;
use Illuminate\Session\TokenMismatchException;


class VerifyCsrfToken extends BaseVerifier
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        //
    ];




//    public function handle($request, Closure $next)
//    { 
//        if ( ! $request->is('api/*'))
//        {
        //    return parent::handle($request, $next);
//        }

//        return $next($request);

//from parent verify in illuminate venfor folder for token matching
//        $sessionToken = $request->session()->token();

//        $token = $request->input('_token') ?: $request->header('X-CSRF-TOKEN');

//	return var_dump($sessionToken." OK ".$token);

//    }




    protected function tokensMatch($request)
    {
        $sessionToken = $request->session()->token();

        $token = $request->input('_token') ?: $request->header('X-CSRF-TOKEN');		//removed at end of token') ?: $request->header('X-CSRF-TOKEN');
	//return var_dump($request->input('_token'));

	//return var_dump("token+".$token." <br>sessiontoken= ".$sessionToken);


        if (! $token && $header = $request->header('X-XSRF-TOKEN')) {
            $token = $this->encrypter->decrypt($header);
        }

        if (! is_string($sessionToken) || ! is_string($token)) {
            return var_dump("token+".$token." <br>sessiontoken= ".$sessionToken);
            return false;
        }

        return hash_equals($sessionToken, $token);
    }



}
