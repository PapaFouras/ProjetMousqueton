<?php
// Récupération des données envoyées par application carto
$lng=$_GET['lng'];
$lat=$_GET['lat'];
$alt=(int)$_GET['alt'];
$com=$_GET['com'];
$massif=$_GET['massif'];
$tgi=$_GET['tgi'];
$toponyme="";
$utm=$_GET['utm'];
$unite=$_GET['unite'];
// Récupération des informations de connection
include_once 'configConnect.php';
// Connexion à la base de donnée - ASM
try {
    $bdd = new PDO("pgsql:host=$servername;dbname=$dbname", $username, $password);
}
catch (Exception $e) {
    die('Erreur : ' . $e->getMessage());
}
    //$commune = addslashes($commune); // Ajout des slashs
    //$toponyme = addslashes($toponyme);
    $gps = number_format($lat, 6, '', '').number_format($lng, 6, '', '');
    //$geom = 'st_geomfromtext(\'POINT(' + $lng + ' ' + $lat + ')\'::text, 4326)';
    
    // Enregistrement des modifications
    $bdd->exec("UPDATE data_exchange SET lieu = '$toponyme',
                                         commune = '$com',
                                         altitude = '$alt',
                                         gps = '$gps',
					                     massif = '$massif',
					                     utm = '$utm',
					                     tgi = '$tgi',
                                         unite = '$unite'
                                         WHERE id = 1");
$bdd->closeCursor;
?>
