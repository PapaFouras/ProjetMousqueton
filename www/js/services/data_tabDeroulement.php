<?php
// Récupération des données envoyées par myController
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
@$crud          =   $request->crud; // Type d'opération à effectuer (Add - Remove - Update)
@$id_secours    =   $request->id_secours;
@$id_evenement  =   $request->id_evenement;
@$gdh           =   $request->gdh;
@$texte         =   $request->texte;

// Récupération des informations de connection
include_once 'configConnect.php';
// Connexion à la base de donnée - ASM
try {
    $bdd = new PDO("pgsql:host=$servername;dbname=$dbname", $username, $password);
}
catch (Exception $e) {
    die('Erreur : ' . $e->getMessage());
}
switch ($crud) {
    case 'get' : // Récupération des données évennements 
        $response = $bdd->query("SELECT * FROM tab_deroulement WHERE (secours_id = $id_secours) ORDER BY deroulement_gdh DESC");
        $data = $response->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    break;
    case 'add' : // Ajout d'un évennement
        $bdd->exec("INSERT INTO tab_deroulement (secours_id, deroulement_gdh, deroulement_texte)
                    VALUES ($id_secours, '$gdh', '$texte')");
    break;
    case 'delete' : // Suppression d'un évenement avec son Id
        $bdd->exec("DELETE FROM tab_deroulement WHERE deroulement_id = $id_evenement");
    break;
    case 'update' : // Update d'un évenement avec son Id 
        $texte = addslashes($texte); // Conversion des chaines avec des apostrophes...
        $bdd->exec("UPDATE tab_deroulement
                    SET deroulement_gdh = '$gdh', deroulement_texte = '$texte'
                    WHERE deroulement_id = $id_evenement");
    break;
};
$bdd->closeCursor;
?>