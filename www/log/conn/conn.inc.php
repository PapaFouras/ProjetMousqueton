<?php
$dbconn = pg_connect("host=localhost dbname=PPE user=postgres password=root") or die("Connexion impossible : " . pg_last_error());
?>
