<!DOCTYPE html>
<html>


<head>
<meta id="meta" name="viewport" content="width=device-width, initial-scale=1.0">

<title>Construction Quote App</title>
<link rel="icon" href="img/icon.png">

<link rel="stylesheet" href="css/css_lib/bootstrap.min.css">
<link rel="stylesheet" href="css/css_lib/angular-material.min.css">
<link rel="stylesheet" href="css/css_lib/ui-cropper.css">

<link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic">
<link href="https://fonts.googleapis.com/css?family=Yanone+Kaffeesatz" rel="stylesheet">

<link rel="stylesheet" href="css/style.css">

<script src="js/js_lib/jquery.min.js"></script>

<script src="js/js_lib/angular.min.js"></script>
<script src="js/js_lib/angular-animate.min.js"></script>
<script src="js/js_lib/angular-aria.min.js"></script>
<script src="js/js_lib/angular-messages.min.js"></script>
<script src="js/js_lib/angular-route.min.js"></script>
<script src="js/js_lib/angular-cookies.min.js"></script>
<script src="js/js_lib/angular-sanitize.js"></script>

<script src="js/js_lib/ng-file-upload.js"></script>
<script src="js/js_lib/ng-file-upload-shim.js"></script>
<script src="js/js_lib/ui-cropper.js"></script>
<script src="js/js_lib/dirPagination.js"></script>
<script src="js/js_lib/angular-material.min.js"></script>


<!--Load the App Angular Resources-->
<script src="js/controllers/interfaceCtrl.js"></script>
<script src="js/controllers/quoteCtrl.js"></script>
<script src="js/services/quoteService.js"></script>
<script src="js/controllers/clientCtrl.js"></script>
<script src="js/services/clientService.js"></script>
<script src="js/services/interfaceService.js"></script>
<script src="js/controllers/tagsCtrl.js"></script>
<script src="js/services/tagsService.js"></script>
<script src="js/controllers/vatRateCtrl.js"></script>
<script src="js/services/vatRateService.js"></script>
<script src="js/controllers/companyAddressCtrl.js"></script>
<script src="js/services/companyAddressService.js"></script>
<script src="js/controllers/pdfCtrl.js"></script>
<script src="js/services/pdfService.js"></script>
<script src="js/controllers/photoCtrl.js"></script>
<script src="js/services/photoService.js"></script>
<script src="js/controllers/authenticationCtrl.js"></script>
<script src="js/services/authenticationService.js"></script>
<script src="js/app.js"></script>

</head>





<body ng-App = "quoteApp">
  <div class = "sitewrapper">



<!-- PAGE View =============================================== -->




 
	<div ng-view></div><!--this is the View-->
	




<!-- PAGE Footer =============================================== -->
  <br>

  </div>
</body>
</html>