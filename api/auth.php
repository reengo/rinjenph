<?php

$headers = apache_request_headers();
//whitelist

if(isset($_SERVER,$_SERVER['REMOTE_ADDR']) && $_SERVER['REMOTE_ADDR'] != '::1') {
  if($headers['Host'] !== 'jennifer.ringo.ph'){
  	echo 'header not ours';
  	exit;
  }
}

?>