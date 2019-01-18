<?php
// Récupération des données envoyées par myController
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
@$crud          =   $request->crud; // Type d'opération à effectuer (Add - Remove - Update)
@$id_secours    =   $request->id_secours;
@$id_victime    =   $request->id_victime;
@$field         =   $request->field;
@$data          =   $request->data;

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
    case 'get' : // Récupération des données victimes
        $response = $bdd->query("SELECT * FROM tab_victimes WHERE (secours_id = $id_secours)");
        $data = $response->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    break;
    case 'add' : // Ajout d'une victimes
        $bdd->exec("INSERT INTO tab_victimes (secours_id, blessures)
                    VALUES ($id_secours, '[]')");
    break;
    case 'delete' : // Suppression d'une victime avec son Id
        $bdd->exec("DELETE FROM tab_victimes WHERE id = $id_victime");
    break;
    case 'cnil' : // Traitement CNIL - Suppression nom et prénom
        $bdd->exec("UPDATE tab_victimes
                    SET nom = 'Traitement CNIL', prenom = 'Traitement CNIL'
                    WHERE secours_id = $id_secours");
    break;
    case 'update' : // Update d'une victime avec son Id 
        if (is_string($data)) {
            //$data = addslashes($data); // Conversion des chaines avec des apostrophes... pose pb
            if ($field == 'nom') {
                $data = mb_strtoupper($data, 'UTF-8'); // Conversion en majuscules pour le NOM
            } else if ($field == 'prenom' || $field == 'profession') {
                $data = ucwords($data); // Conversion majuscule en début de mot pour le PRENOM
            };
        };
            
        $bdd->exec("UPDATE tab_victimes SET $field = '$data' WHERE id = $id_victime");
    break;
};
$bdd->closeCursor;
?>