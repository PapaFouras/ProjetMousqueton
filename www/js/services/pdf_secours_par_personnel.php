<?php
// Récupération des données envoyées par myController
$annee = $_GET['annee'];
$personnel = $_GET['personnel'];

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

$response = $bdd->query("
                        SELECT 
                        tab_secours.alerte_gdh,
                        tab_secours.acc_activites,
                        tab_secours.acc_blessures,
                        tab_secours.loc_lieu
                        FROM (tab_secours JOIN tab_moyens ON((tab_secours.id = tab_moyens.secours_id)))
                        WHERE (tab_moyens.nom = '$personnel' AND EXTRACT (YEAR FROM alerte_gdh) = $annee)
                        ORDER BY tab_secours.alerte_gdh"
                       );

$totalSecours = $response->fetchAll(PDO::FETCH_ASSOC);

// Création du PDF
$pdf = new tFPDF('P','mm','A4');
$pdf->SetTitle("Secours ".$personnel,true);
$pdf->AddPage();
$pdf->AddFont('DejaVu','','DejaVuSerif.ttf',true);
$pdf->AddFont('DejaVu','B','DejaVuSerif-Bold.ttf',true);
// Titre
$pdf->SetFont('DejaVu','B',12);
$pdf->Write(0, 'Secours réalisés par : '.$personnel);
$pdf->Ln(5);

// Liste des secours
$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(25,7,'Date','B',0);
$pdf->Cell(55,7,'Lieux précis','B',0);
$pdf->Cell(55,7,'Type','B',0);
$pdf->Cell(55,7,'Observations','B',1);
$pdf->SetFont('DejaVu','',8);
foreach($totalSecours as $secours) {
    $gdh = DateTime::createFromFormat('Y-m-d H:i:s.u', $secours[alerte_gdh]);
    $gdh = $gdh->format('d-m-Y');
    $activites = json_decode($secours['acc_activites'])->{'activites'};
    $blessures = json_decode($secours['acc_blessures'])->{'blessures'};
    $pdf->Cell(25,7,$gdh,'B',0);
    $pdf->Cell(55,7,$secours[loc_lieu],'B',0);
    $pdf->Cell(55,7,$activites,'B',0);
    $pdf->Cell(55,7,$blessures,'B',1);
};
//$bdd->closeCursor;
$pdf->Output("Année ".$annee. " - Secours effectués par ".$personnel,"I");
?>
