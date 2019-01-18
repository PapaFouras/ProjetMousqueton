<?php
$dbconn = pg_connect("host=localhost dbname=PPE user=root password=root") or die("Connexion impossible : " . pg_last_error());
?>
