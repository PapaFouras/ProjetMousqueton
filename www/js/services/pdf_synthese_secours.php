<?php
// Récupération des données envoyées par myController
$debut  = $_GET['debut'];
$fin    = $_GET['fin'];
$loc = $_GET['loc'];

// Récupération des informations de connection
include_once ('configConnect.php');

// Class -  TPDF
require('../../vendors/fpdf/tfpdf.php');

// Connexion à la base de donnée - ASM
try {
    $bdd = new PDO("pgsql:host=$servername;dbname=$dbname", $username, $password);
}
catch (Exception $e) {
    die('Erreur : ' . $e->getMessage());
}
// Configuration
$config = $bdd->query("SELECT * FROM tab_config");
$dataConfig = $config->fetch(PDO::FETCH_ASSOC);

//requête adaptée à l'emprise géographique
switch ($loc) {
    case "HuezGD":
        $query = "SELECT * FROM tab_secours WHERE alerte_gdh BETWEEN '$debut' AND '$fin' AND loc_commune IN ('Le Freney-d\'Oisans - 38142','Oz - 38114', 'Huez - 38750', 'Vaujany - 38114','La Garde - 38520', 'Auris - 38142', 'Villard-Reculas - 38114') ORDER BY alerte_gdh";
        break;
    default:
        $query = "SELECT * FROM tab_secours WHERE alerte_gdh BETWEEN '$debut' AND '$fin' ORDER BY alerte_gdh";
}

$secours = $bdd->query($query);
$dataSecours = $secours->fetchAll(PDO::FETCH_ASSOC);

// Création du PDF
$pdf = new tFPDF('L','mm','A4');
$pdf->SetTitle("Synthèse secours",true);
$pdf->SetMargins(5,5);
$pdf->SetFillColor(200);
$pdf->AddPage();
$pdf->AddFont('DejaVu','','DejaVuSerif.ttf',true);
$pdf->AddFont('DejaVu','B','DejaVuSerif-Bold.ttf',true);
// Titre
$gdh_debut = DateTime::createFromFormat('Y-m-d H:i:s', $debut);
$gdh_debut = $gdh_debut->format('d/m/Y');
$gdh_fin = DateTime::createFromFormat('Y-m-d H:i:s', $fin);
$gdh_fin = $gdh_fin->format('d/m/Y');

$pdf->SetFont('DejaVu','B',10);
$pdf->Cell(0, 10, "Synthèse des interventions du $dataConfig[unite] - Période du $gdh_debut au $gdh_fin - $loc",1,1,'C',true);
$pdf->Ln(5);

// Liste des secours
$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(35,7,"Date et heure",'B',0);
$pdf->Cell(50,7,'Activité','B',0);
$pdf->Cell(75,7,'Commune','B',0);
$pdf->Cell(75,7,'Victime(s)','B',0);
//$pdf->Cell(10,7,'Conf.','B',0,'C');
$pdf->Cell(0,7,"Origine de l'alerte",'B',1);
$pdf->SetFont('DejaVu','',8);
foreach($dataSecours as $secours) {
    $gdh = DateTime::createFromFormat('Y-m-d H:i:s.u', $secours[alerte_gdh]);
    $gdh_alerte = $gdh->format('d/m/y à H:i');
    
       
    $activites = json_decode($secours['acc_activites'])->{'activites'};
    
    if ($secours[alerte_moyen] == 'Radio') {
        $origine = $secours[alerte_moyen];
    } else if ($secours[alerte_moyen] == 'Téléphone'){
        $origine = "$secours[alerte_moyen] : $secours[alerte_origine]";
    } else {
        $origine = 'Aucune précision';
    };
    
    // Déroulement
    $selectDeroulement=$bdd->query("SELECT * FROM tab_deroulement WHERE secours_id = $secours[id]
                                    ORDER BY deroulement_gdh");
    $selectDeroulement->setFetchMode(PDO::FETCH_ASSOC);
    
    // Victimes
    $selectVictimes=$bdd->query("SELECT * FROM tab_victimes WHERE secours_id = $secours[id] ORDER BY nom");
    $selectVictimes->setFetchMode(PDO::FETCH_ASSOC);
    

    $victime_etat = array();
    while ($dataVictime = $selectVictimes->fetch()) {
        $victime_etat[] = $dataVictime[etat];
    };

    
    if (count($victime_etat) == 0) {
        $victime_etat = 'Aucune victime';
    } else {
        $victime_etat = '('.count($victime_etat).') '.join(' - ', $victime_etat);
    };
    
    $pdf->Cell(35,7,$gdh_alerte,'',0);
    $pdf->Cell(50,7,$activites,'',0);
    $pdf->Cell(75,7,$secours[loc_commune],'',0);
    $pdf->Cell(75,7,$victime_etat,'',0);
    $pdf->Cell(10,7,'','',0);
    $pdf->Cell(0,7,$origine,'',1);
    $pdf->SetFont('DejaVu','B',8);
    $pdf->Cell(35,7,' ','',0);
    $pdf->SetFont('DejaVu','',8);
    $pdf->Cell(0,7,$secours[loc_lieu]." - ". $secours[loc_complement]. " " . $secours[loc_alt]."m",'',1);
    $pdf->SetFont('DejaVu','B',8);
    $pdf->Cell(35,7,' ','B',0);
    $pdf->SetFont('DejaVu','',8);
    $pdf->Cell(0,7,$secours[acc_rsgts],'B',1);
};
// Affichage du total
$pdf->Ln(5);
$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(50, 7, "Total des interventions : ".count($dataSecours),'' ,1 ,'' ,true);
$pdf->Ln(5);
//$bdd->closeCursor;
$pdf->Output("Synthèse secours du $gdh_fin","I");
?>
