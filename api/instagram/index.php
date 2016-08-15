<?php

require_once('../auth.php');
$hashtag = isset($_GET['hashtag']) ? $_GET['hashtag'] : '';
$next = isset($_GET['next']) ? $_GET['next'] : '';
$access_token = '34530257.58d388b.9bdc1c0cf0f949f086f97943c0734acf';
//instagram
$ch = curl_init();
 
$url = "https://api.instagram.com/v1/tags/" 
                . $hashtag 
                . "/media/recent?access_token=" 
                . $access_token;

$newUrl = $next !== '' ? $url . '&max_tag_id=' . $next : $url;

curl_setopt($ch, CURLOPT_URL, $newUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$output = curl_exec($ch);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

curl_close($ch);

print($output);


?>