<style>
body{
	padding-right: 5px;
}
h3{
	margin-bottom: 0px;
}
.photoleft{
	display: inline-block;
    	width: 425px;
}
.addressright{
	display: inline-block;
    	width: 250px;
}
.subtotalright{
	margin-left: 74%;
	margin-right: 0%;
}
.subtitles{
	background-color: #f9f9f7;
	width: 95%;
	padding-top: 10px;	
	padding-left: 10px;
	display: inline-block;
}
.totalprice{
	background-color: #f9f9f7;
	width: 96.5%;
	font-size: 107%;
	white-space: nowrap;
	display: inline-block;
}
.totalright{
	margin-left: 60%;
	margin-right: 0px;
}
.netTotalLeftPadding{
	margin-left: 89px;
	margin-right: 0px;
}
.job{
	width: 50%;
	display: inline-block;
}
.jobheader{
	width: 16%;
	display: inline-block;
}
.description{
         white-space: pre-wrap; 
}
.phone:before{	
	font-family: DejaVu Sans;
        content: "\260F";
        color: black;
        font-size: 1.4rem;
	line-height: 1.2rem;
}
/* required as dompdf puts the last element of a line on a new page at an auto pagebreak. This css keeps together on same line */
.dontbreakhere{			
	page-break-inside: avoid;
}

</style>



<div class="container">

	<span class="photoleft">
	@if(($quotes->photo) && ($quotePhotoExists == 'true'))
	    <img src="/app/storage/app/quote_photo/{{$quotes->photo}}" height="200">
	@endif
	</span>

	<span class="addressright">
	<b>{{ $companyaddress->name }}</b><br>
	{{ $companyaddress->address }}<br>
	{{ $companyaddress->city }}<br>
	{{ $companyaddress->county }}<br>
	{{ $companyaddress->postcode }}<br>
	{{ $companyaddress->email }}<br>
	<span class="phone"></span>{{ $companyaddress->phone }}
	</span>


	<br><h3>Building Quote 
	@if($quotes->id != '0')
		#{{ $quotes->id }}
	@endif

	<!--show the original quote id instead of id 0 for temp pdf quote-->
	@if($quotes->id == '0')
		#{{ $quotes->pdf_sent_id }}
	@endif
	</h3>

	<b>Date:</b> {{$quotes->updated_at->format('d-m-Y')}} <br><br>

	<b>Client Name:</b> {{ $client->client_name }}<br>
	<b>Property Location:</b> {{ $quotes->street_address }}, 
	{{ $quotes->city }}, 
	{{ $quotes->postcode }}<br><br>
				
	Type of Property: {{$property_type}}<br>
	Work Required: {{$work_required }}<br>
	<br>



	<h3>Quote Details</h3>
	<span class="description">{{ $quotes->description }}</span><br><br>
	

  	@foreach($quoteDataArray as $s)
		<div class="subtitles">
		<!--b>Sub-section:</b--> <b>{{ $s['subtitle'] }}</b><hr>
			<span class="dontbreakhere">
			<!--here need to display all the jobs for the subtitle-->
			<!--display the column headers-->
			<div class="job"><b> </b></div>
			<div class="jobheader"><b>Cost</b></div>
			<div class="jobheader"><b>Qty</b></div>
			<div class="jobheader"><b>Total</b></div>
			</span><br>

			@foreach($s['jobs'] as $j)
				<span class="dontbreakhere">
				<!--here need to display all the jobs for the subtitle-->
				<div class="job">{{ $j['job'] }}</div>
				<div class="jobheader">&#163;{{ $j['cost'] }}</div>
				<div class="jobheader">{{ $j['qty'] }}</div>
				<div class="jobheader">&#163;{{ number_format($j['total'], 2) }}</div>
				</span><br>
			@endforeach 

		<div class="subtotalright dontbreakhere"><hr><b>Subtotal:</b> &#163;{{ number_format($s['subtotal'], 2) }}</div><br>
		</div><br>
		@endforeach
		
 		<div class="totalprice"><br><hr><div class="totalright"><hr>
		<span class="dontbreakhere"><b>Total Excluding VAT:</b> &#163;{{number_format($quotes->total_excluding_vat, 2) }}</span><br><br>
		<span class="dontbreakhere"><b class="netTotalLeftPadding">Net Total:</b> &#163;{{ number_format($quotes->net_total, 2) }}</span>
		<hr>
		</div>

	</div>


</div><!--end of container-->
