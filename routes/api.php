<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


//use Illuminate\Support\Facades\Auth;



Route::group(['middleware' => ['auth:api']], function () {




Route::get('getImage/{imgName},{api_token?}', [
    'as' => 'getImage.showImg',
    'uses' => 'FileController@showImg'
]);


Route::get('quotes{api_token?}', [
	'as' => 'quotes.index',
	'uses' => 'QuoteController@index'
]);


Route::post('quotes/{api_token?}', [
	'as' => 'quotes.store',
	'uses' => 'QuoteController@store'
]);


Route::get('quotes/{quote},{api_token?}', [
	'as' => 'quotes.show',
	'uses' => 'QuoteController@show'
]);


Route::delete('quotes{quote?},{type?},{api_token?}', [
	'as' => 'quotes.destroy',
	'uses' => 'QuoteController@destroy'
]);


Route::put('quotes{quote},{api_token?}', [
	'as' => 'quotes.update',
	'uses' => 'QuoteController@update'
]);








Route::get('clients/{api_token?}', [
	'as' => 'clients.index',
	'uses' => 'ClientController@index'
]);


Route::post('clients/{api_token?}', [
	'as' => 'clients.store',
	'uses' => 'ClientController@store'
]);


Route::get('clients{client},{api_token?}', [
	'as' => 'clients.show',
	'uses' => 'ClientController@show'
]);


Route::delete('clients/{client},{api_token?}', [
	'as' => 'clients.destroy',
	'uses' => 'ClientController@destroy'
]);


//put or patch
Route::put('clients{client},{api_token?}', [
	'as' => 'clients.update',
	'uses' => 'ClientController@update'
]);






Route::get('vat_rate/{api_token?}', [
	'as' => 'vat_rate.index',
	'uses' => 'VatRateController@index'
]);


Route::put('vat_rate{vat_rate},{api_token?}', [
	'as' => 'vat_rate.update',
	'uses' => 'VatRateController@update'
]);







Route::get('company_address/{api_token?}', [
	'as' => 'company_address.index',
	'uses' => 'CompanyAddressController@index'
]);


Route::put('company_address{company_address},{api_token?}', [
	'as' => 'company_address.update',
	'uses' => 'CompanyAddressController@update'
]);






Route::get('tags/{api_token?}', [
	'as' => 'tags.index',
	'uses' => 'TagsController@index'
]);


Route::post('tags/{api_token?}', [
	'as' => 'tags.store',
	'uses' => 'TagsController@store'
]);





Route::post('pdf_send{id},{api_token?}', [
	'as' => 'quotes.pdf_send',
	'uses' => 'pdfController@pdf_send'
]);


Route::get('pdf_sent/{api_token?}', [
	'as' => 'quotes.pdf_sent',
	'uses' => 'pdfController@get_all_pdf_sent'
]);


Route::post('pdf_check_exists/{api_token?}', [
	'as' => 'quotes.pdf_check_exists',
	'uses' => 'pdfController@checkPdfExists'
]);


Route::post('photo_upload{id},{refer},{imgType},{api_token?}', [
	'as' => 'quotes.photo_upload',
	'uses' => 'QuoteController@photo_upload'
]);


Route::post('photo_delete{id},{api_token?}', [
	'as' => 'quotes.photo_delete',
	'uses' => 'QuoteController@photo_delete'
]);





});		//end of route group middleware auth:api









// CATCH ALL ROUTE
// All routes that are not home or api will be redirected to the 
// frontend, which allows angular to route them 

//App::missing(function($exception) { 
//    return View::make('index'); 
//});
