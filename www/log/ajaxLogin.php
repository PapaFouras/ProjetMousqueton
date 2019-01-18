<?php
include("./conn/conn.inc.php");
session_start();
if(isSet($_POST['username']) && isSet($_POST['password']))
{

$username=pg_escape_string ($dbconn, $_POST['username']);
$password=pg_escape_string ($dbconn, $_POST['password']);
$result=pg_query("SELECT id, code, pwd FROM unites WHERE code='$username' and pwd='$password'");
$count=pg_num_rows($result);
$row=pg_fetch_array($result);


// If result matched $myusername and $mypassword, table row must be 1 row
if($count==1 && $row['code']=="PG38")
{
$_SESSION['login_user']=$row['id'];
$_SESSION['unite']=$row['code'];
$_SESSION['code']=$row['pwd'];

echo $row['id'];
}
}
?>
