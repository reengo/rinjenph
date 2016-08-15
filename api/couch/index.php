<?php

require_once('../auth.php');
$method = $_GET['method'];
$baseurl = 'https://reengo.iriscouch.com/';
$dbname = 'rinjen';
$doc = $_GET['doc'];

$ch = curl_init();
 
if($method !='get'){
	$url = $baseurl 
			. "/" 
			. $dbname;
	$data = var_dump(json_decode($_GET['data']));
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
	    'Content-Type: application/json',
	    'Content-Length: ' . strlen($data))                                                                       
	); 
}else{
	$url = $baseurl 
			. "/" 
			. $dbname 
			. "/_design/" 
			. $doc 
			. "/_view/" 
			. $doc;

	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_HEADER, 0);
}
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
//Execute request 
$output = curl_exec($ch);
//get the default response headers 
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
 
curl_close($ch);

print($output);


?>