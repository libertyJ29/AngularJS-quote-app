<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Eloquent::unguard();

        $this->call('ClientTableSeeder');
	$this->command->info('Client table seeded.');
	$this->call('CompanyaddressTableSeeder');
	$this->command->info('Company Address table seeded.');
	$this->call('TagsTableSeeder');
	$this->command->info('Tags table seeded.');
	$this->call('UsersTableSeeder');
	$this->command->info('Users table seeded.');
	$this->call('VatRateTableSeeder');
	$this->command->info('VatRate table seeded.');
    }
}






class ClientTableSeeder extends Seeder {

    public function run()
    {
	//DB::table('client')->delete();
    
        DB::table('client')->insert([
	    'id' => '0',
            'client_name' => 'Client not selected',
            'contact_number' => '-',
	    'email' => 'ns'
        ]);

    }    

}




class CompanyaddressTableSeeder extends Seeder {

    public function run()
    {
    	//DB::table('companyaddress')->delete();

	\App\Company_Address::create(array(
            'name' => 'Construction Company',
	    'address' => 'address',
	    'city' => 'city',
	    'county' => 'county',
	    'postcode' => 'postcode',
	    'email' => 'email',
	    'phone' => 'phone'
	));

    }

}






class TagsTableSeeder extends Seeder
{
    public function run()
    {
	//DB::table('tags')->delete();

	\App\Tags::create(array(
            'property_type' => '[{"id":0,"name":"None"},{"id":1,"name":"Apartment"},{"id":2,"name":"Bungalow"},{"id":3,"name":"Detached"},{"id":4,"name":"Large Property"},{"id":5,"name":"Old Property"},{"id":6,"name":"Semi-Detached"}]',
            'work_required' => '[{"id":0,"name":"None"},{"id":1,"name":"Extension"},{"id":2,"name":"Damp Proofing"},{"id":3,"name":"Maintenance"},{"id":4,"name":"New build"},{"id":5,"name":"Refurbishment"},{"id":6,"name":"Small Job"},{"id":7,"name":"Demolition"},{"id":8,"name":"Partial-Demolition"}]'
        ));
    }

}




class UsersTableSeeder extends Seeder {

    public function run()
    {
    	//DB::table('users')->delete();

	\App\Users::create(array(
            'name' => 'git',
	    'password' => 'git',
	));
    }

}




class VatRateTableSeeder extends Seeder {

    public function run()
    {
	//DB::table('vat_rate')->delete();

	\App\Vat_Rate::create(array(
            'rate' => '20' 
	));
    }

}




