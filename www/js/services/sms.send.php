<?php
// Récupération des données envoyées par myController
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
@$txtSMS    = $request->txtSMS;
@$lstTPH    = $request->lst_tph_portable;
//echo $txtSMS, $lstTPH;
//echo strlen($txtSMS);

// Envoi instantane de SMS
require('sms.inc.php');

$user_login = 'xxxxxx';
$api_key = 'xxxxx'; 

$sms_recipients = array($lstTPH);
$sms_text = $txtSMS;

$sms_type = SMS_PREMIUM; // ou encore SMS_STANDARD,SMS_PREMIUM
$sms_mode = INSTANTANE; // ou encore DIFFERE
$sms_sender = 'PGHM';

$sms = new SMS();

$sms->set_user_login($user_login);
$sms->set_api_key($api_key);
$sms->set_sms_mode($sms_mode);
$sms->set_sms_text($sms_text);
$sms->set_sms_recipients($sms_recipients);
$sms->set_sms_type($sms_type);
$sms->set_sms_sender($sms_sender);
$sms->set_sms_request_id(uniqid());
$sms->set_option_with_replies(0);
$sms->set_simulation_mode(); // Mode simulation
$sms->set_option_transactional(1);
$sms->set_sender_is_msisdn(0);
$xml = $sms->send();
echo $xml;
?>
