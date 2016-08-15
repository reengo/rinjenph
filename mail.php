<?php
// Email Submit
// Note: filter_var() requires PHP >= 5.2.0

if ( isset($_POST['email']) && isset($_POST['name']) && isset($_POST['message']) && filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) ) {
 
  // detect & prevent header injections
  $test = "/(content-type|bcc:|cc:|to:)/i";
  foreach ( $_POST as $key => $val ) {
    if ( preg_match( $test, $val ) ) {
      exit;
    }
  }
  
 $receipients = 'Ringo Bautista <me@ringo.ph>, Jennifer Canopin <jennifercanopin323@gmail.com>';

  //send email
mail( $receipients, "Contact Form: ".$_POST['name'], "Subject: " . $_POST['subject'] . "\r\n \r\n Message:\r\n " . $_POST['message'], "From: " . $_POST['name'] . " <".$_POST['email'].">" );
}
?>