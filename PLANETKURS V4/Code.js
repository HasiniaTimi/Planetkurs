/**
 * PlanetKurs - Système de Gestion d'École de Langue Allemande
 * Code Apps Script principal
 */

// ============================================
// CONFIGURATION ET INITIALISATION
// ============================================

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🇩🇪 PlanetKurs')
    .addItem('📝 Nouvel Élève', 'ouvrirFormulaireEleve')
    .addItem('🔍 Rechercher Élève', 'ouvrirRechercheEleve')
    .addItem('📋 Liste Tous les Élèves', 'ouvrirListeEleves')
    .addSeparator()
    .addItem('👨‍🏫 Nouveau Professeur', 'ouvrirFormulaireProfesseur')
    .addItem('🔍 Rechercher Professeur', 'ouvrirRechercheProfesseur')
    .addItem('📋 Liste Tous les Professeurs', 'ouvrirListeProfesseurs')
    .addSeparator()
    .addItem('💰 Nouvelle Transaction', 'ouvrirFormulaireTransaction')
    .addItem('💳 Suivi des Paiements', 'ouvrirSuiviPaiements')
    .addSeparator()
    .addItem('📊 Tableau de Bord', 'afficherTableauDeBord')
    .addItem('⚙️ Initialiser les Feuilles', 'initialiserFeuilles')
    .addToUi();
}

function initialiserFeuilles() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Créer ou récupérer les feuilles
  var feuilleEleves = ss.getSheetByName('Élèves') || ss.insertSheet('Élèves');
  var feuilleProfesseurs = ss.getSheetByName('Professeurs') || ss.insertSheet('Professeurs');
  var feuilleTresorerie = ss.getSheetByName('Trésorerie') || ss.insertSheet('Trésorerie');
  var feuilleTableauDeBord = ss.getSheetByName('Tableau de Bord') || ss.insertSheet('Tableau de Bord');
  
  // Initialiser la feuille Élèves
  if (feuilleEleves.getLastRow() === 0) {
    feuilleEleves.getRange('A1:K1').setValues([[
      'N° Matricule', 'Nom', 'Prénom', 'Adresse', 'Téléphone', 
      'Email', 'Niveau', 'Date Inscription', 'Statut', 'Professeur Assigné', 'Notes'
    ]]);
    feuilleEleves.getRange('A1:K1').setBackground('#000000').setFontColor('#FFD700').setFontWeight('bold');
    feuilleEleves.setFrozenRows(1);
    feuilleEleves.autoResizeColumns(1, 11);
  }
  
  // Initialiser la feuille Professeurs
  if (feuilleProfesseurs.getLastRow() === 0) {
    feuilleProfesseurs.getRange('A1:H1').setValues([[
      'ID Prof', 'Nom', 'Prénom', 'Niveau Enseigné', 'Adresse', 
      'Téléphone', 'Email', 'Date Embauche'
    ]]);
    feuilleProfesseurs.getRange('A1:H1').setBackground('#DD0000').setFontColor('#FFFFFF').setFontWeight('bold');
    feuilleProfesseurs.setFrozenRows(1);
    feuilleProfesseurs.autoResizeColumns(1, 8);
  }
  
  // Initialiser la feuille Trésorerie
  if (feuilleTresorerie.getLastRow() === 0) {
    feuilleTresorerie.getRange('A1:I1').setValues([[
      'Date', 'Type', 'Catégorie', 'Nom Élève', 'Mois à Payer', 'Description', 'Montant', 'Solde', 'Référence'
    ]]);
    feuilleTresorerie.getRange('A1:I1').setBackground('#FFD700').setFontColor('#000000').setFontWeight('bold');
    feuilleTresorerie.setFrozenRows(1);
    feuilleTresorerie.autoResizeColumns(1, 9);
  }
  
  // Initialiser le Tableau de Bord
  initialiserTableauDeBord(feuilleTableauDeBord);
  
  SpreadsheetApp.getUi().alert('✅ Initialisation terminée!\n\nToutes les feuilles ont été créées avec succès.');
}

function initialiserTableauDeBord(feuille) {
  feuille.clear();
  feuille.setTabColor('#FFD700');
  
  // En-tête avec informations de l'école - Couleur adoucie
  feuille.getRange('A1:H1').merge().setValue('🇩🇪 PLANETKURS - École de Langue Allemande')
    .setBackground('#34495E').setFontColor('#F1C40F').setFontSize(20).setFontWeight('bold')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  feuille.setRowHeight(1, 40);

  // Informations de contact de l'école - Couleur adoucie
  feuille.getRange('A2:H2').merge().setValue('📍 Antananarivo, Madagascar | ☎️ +261 34 64 356 58 | ✉️ contact@planetkurs.mg')
    .setBackground('#F9E79F').setFontColor('#2C3E50').setFontSize(11).setFontWeight('bold')
    .setHorizontalAlignment('center');
  feuille.setRowHeight(2, 30);

  // Titre du tableau de bord - Couleur adoucie
  feuille.getRange('A3:H3').merge().setValue('📊 TABLEAU DE BORD')
    .setBackground('#E74C3C').setFontColor('#FFFFFF').setFontSize(16).setFontWeight('bold')
    .setHorizontalAlignment('center');
  feuille.setRowHeight(3, 35);

  // Statistiques Élèves - Couleur adoucie
  feuille.getRange('A5:C5').merge().setValue('👥 STATISTIQUES ÉLÈVES')
    .setBackground('#E74C3C').setFontColor('#FFFFFF').setFontWeight('bold')
    .setHorizontalAlignment('center');
  
  feuille.getRange('A6').setValue('Total Élèves:');
  // Utiliser la formule via setFormulaR1C1 pour compatibilité internationale
  feuille.getRange('B6').setFormulaR1C1('=COUNTA(Élèves!C[-1])-1');
  feuille.getRange('B6').setBackground('#DFE6E9').setFontWeight('bold').setFontSize(12);

  feuille.getRange('A7').setValue('Niveau A1:');
  feuille.getRange('B7').setFormulaR1C1('=COUNTIF(Élèves!C7,"A1")');

  feuille.getRange('A8').setValue('Niveau A2:');
  feuille.getRange('B8').setFormulaR1C1('=COUNTIF(Élèves!C7,"A2")');

  feuille.getRange('A9').setValue('Niveau B1:');
  feuille.getRange('B9').setFormulaR1C1('=COUNTIF(Élèves!C7,"B1")');

  feuille.getRange('A10').setValue('Niveau B2:');
  feuille.getRange('B10').setFormulaR1C1('=COUNTIF(Élèves!C7,"B2")');

  // Graphique des élèves par niveau
  feuille.getRange('A12').setValue('📊 Répartition par Niveau').setFontWeight('bold');

  // Statistiques Professeurs - Couleur adoucie
  feuille.getRange('E5:G5').merge().setValue('👨‍🏫 PROFESSEURS')
    .setBackground('#E74C3C').setFontColor('#FFFFFF').setFontWeight('bold')
    .setHorizontalAlignment('center');

  feuille.getRange('E6').setValue('Total Professeurs:');
  feuille.getRange('F6').setFormulaR1C1('=COUNTA(Professeurs!C1)-1');
  feuille.getRange('F6').setBackground('#D5DBDB').setFontWeight('bold').setFontSize(12);

  // Trésorerie - Couleur adoucie
  feuille.getRange('A14:C14').merge().setValue('💰 TRÉSORERIE')
    .setBackground('#F9E79F').setFontColor('#2C3E50').setFontWeight('bold')
    .setHorizontalAlignment('center');

  feuille.getRange('A15').setValue('Solde Actuel:');
  // Formule simplifiée avec R1C1
  feuille.getRange('B15').setFormulaR1C1('=IF(COUNTA(Trésorerie!C8)>1,INDEX(Trésorerie!C8,COUNTA(Trésorerie!C8)),0)');
  feuille.getRange('B15').setNumberFormat('#,##0" Ar"').setBackground('#AED6F1').setFontWeight('bold').setFontSize(12);

  feuille.getRange('A16').setValue('Total Entrées:');
  feuille.getRange('B16').setFormulaR1C1('=SUMIF(Trésorerie!C2,"Entrée",Trésorerie!C7)');
  feuille.getRange('B16').setNumberFormat('#,##0" Ar"').setBackground('#ABEBC6');

  feuille.getRange('A17').setValue('Total Sorties:');
  feuille.getRange('B17').setFormulaR1C1('=ABS(SUMIF(Trésorerie!C2,"Sortie",Trésorerie!C7))');
  feuille.getRange('B17').setNumberFormat('#,##0" Ar"').setBackground('#F5B7B1');

  // Évolution mensuelle - Couleur adoucie
  feuille.getRange('E14:G14').merge().setValue('📈 CE MOIS')
    .setBackground('#F9E79F').setFontColor('#2C3E50').setFontWeight('bold')
    .setHorizontalAlignment('center');

  feuille.getRange('E15').setValue('Entrées ce mois:');
  // Utiliser une formule alternative plus simple
  feuille.getRange('F15').setFormulaR1C1('=SUMIF(Trésorerie!C2,"Entrée",Trésorerie!C7)');
  feuille.getRange('F15').setNumberFormat('#,##0" Ar"').setBackground('#ABEBC6');

  feuille.getRange('E16').setValue('Sorties ce mois:');
  feuille.getRange('F16').setFormulaR1C1('=ABS(SUMIF(Trésorerie!C2,"Sortie",Trésorerie!C7))');
  feuille.getRange('F16').setNumberFormat('#,##0" Ar"').setBackground('#F5B7B1');
  
  // Instructions pour les graphiques
  feuille.getRange('A19:H19').merge().setValue('💡 Pour ajouter des graphiques: Sélectionnez les données → Insertion → Graphique')
    .setBackground('#FEF5E7').setFontStyle('italic').setHorizontalAlignment('center');
  
  // Créer un graphique automatique pour la répartition des élèves
  creerGraphiqueEleves(feuille);
  
  feuille.autoResizeColumns(1, 8);
}

function creerGraphiqueEleves(feuille) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Créer les données pour le graphique
    var dataRange = feuille.getRange('A7:B10');
    
    var chart = feuille.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(dataRange)
      .setPosition(13, 1, 0, 0)
      .setOption('title', 'Répartition des Élèves par Niveau')
      .setOption('width', 400)
      .setOption('height', 300)
      .setOption('colors', ['#2C2C2C', '#E17055', '#FFEAA7', '#74B9FF'])
      .setOption('legend', {position: 'right'})
      .setOption('pieSliceText', 'value')
      .build();
    
    feuille.insertChart(chart);
  } catch (e) {
    Logger.log('Erreur création graphique: ' + e.message);
  }
}

// ============================================
// GESTION DES ÉLÈVES
// ============================================

function ouvrirFormulaireEleve() {
  var html = HtmlService.createHtmlOutputFromFile('FormulaireEleve')
    .setWidth(600)
    .setHeight(700);
  SpreadsheetApp.getUi().showModalDialog(html, '📝 Inscription Élève - PlanetKurs');
}

function ouvrirFormulaireModificationEleve(eleve) {
  var template = HtmlService.createTemplateFromFile('FormulaireEleve');
  template.eleve = eleve;
  template.modification = true;
  
  var html = template.evaluate()
    .setWidth(600)
    .setHeight(700);
  SpreadsheetApp.getUi().showModalDialog(html, '✏️ Modifier Élève - PlanetKurs');
}

function genererMatricule() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var feuille = ss.getSheetByName('Élèves');
  var derniereLigne = feuille.getLastRow();
  var anneeActuelle = new Date().getFullYear();
  
  if (derniereLigne <= 1) {
    return 'PK-' + anneeActuelle + '-001';
  }
  
  // Chercher le dernier matricule de l'année actuelle
  var data = feuille.getRange(2, 1, derniereLigne - 1, 1).getValues();
  var dernierNumero = 0;
  
  for (var i = data.length - 1; i >= 0; i--) {
    if (data[i][0]) {
      var parts = data[i][0].toString().split('-');
      if (parts.length === 3 && parts[1] == anneeActuelle) {
        dernierNumero = parseInt(parts[2]);
        break;
      }
    }
  }
  
  var nouveauNumero = dernierNumero + 1;
  return 'PK-' + anneeActuelle + '-' + String(nouveauNumero).padStart(3, '0');
}

function enregistrerEleve(data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var feuille = ss.getSheetByName('Élèves');

    // Validation des données obligatoires
    if (!data.nom || !data.prenom) {
      return {success: false, message: 'Le nom et le prénom sont obligatoires!'};
    }

    var matricule = data.matricule || genererMatricule();
    var dateInscription = new Date();

    // Formater le numéro de téléphone avec +261
    var telephone = data.telephone || '';
    if (telephone && !telephone.startsWith('+261')) {
      // Enlever les espaces et caractères spéciaux
      telephone = telephone.replace(/[\s\-\(\)]/g, '');
      // Si commence par 0, enlever le 0
      if (telephone.startsWith('0')) {
        telephone = telephone.substring(1);
      }
      // Ajouter +261
      telephone = '+261 ' + telephone;
    }
    
    var ligne = [
      matricule,
      data.nom,
      data.prenom,
      data.adresse,
      telephone,
      data.email,
      data.niveau,
      dateInscription,
      'Actif',
      data.professeur || '',
      data.notes || ''
    ];
    
    if (data.modifier && data.ligneModifier) {
      feuille.getRange(data.ligneModifier, 1, 1, 11).setValues([ligne]);
      return {success: true, message: 'Élève modifié avec succès!', matricule: matricule};
    } else {
      feuille.appendRow(ligne);
      
      // Appliquer le formatage alterné
      var derniereLigne = feuille.getLastRow();
      if (derniereLigne % 2 === 0) {
        feuille.getRange(derniereLigne, 1, 1, 11).setBackground('#FFF8DC');
      }
      
      return {success: true, message: 'Élève enregistré avec succès!', matricule: matricule};
    }
  } catch (e) {
    return {success: false, message: 'Erreur: ' + e.message};
  }
}

function ouvrirRechercheEleve() {
  var html = HtmlService.createHtmlOutputFromFile('RechercheEleve')
    .setWidth(800)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, '🔍 Rechercher Élève');
}

function rechercherEleve(critere, valeur) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var feuille = ss.getSheetByName('Élèves');
    
    if (!feuille) {
      return [];
    }
    
    var data = feuille.getDataRange().getValues();
    
    if (data.length <= 1) {
      return [];
    }
    
    var resultats = [];
    var colonnes = {
      'matricule': 0,
      'nom': 1,
      'prenom': 2,
      'niveau': 6
    };
    
    var colonne = colonnes[critere];
    
    if (colonne === undefined) {
      return [];
    }
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][colonne] && data[i][colonne].toString().toLowerCase().indexOf(valeur.toLowerCase()) !== -1) {
        resultats.push({
          ligne: i + 1,
          matricule: data[i][0] || '',
          nom: data[i][1] || '',
          prenom: data[i][2] || '',
          adresse: data[i][3] || '',
          telephone: data[i][4] || '',
          email: data[i][5] || '',
          niveau: data[i][6] || '',
          dateInscription: data[i][7] || '',
          statut: data[i][8] || '',
          professeur: data[i][9] || '',
          notes: data[i][10] || ''
        });
      }
    }
    
    return resultats;
  } catch (e) {
    Logger.log('Erreur rechercherEleve: ' + e.message);
    return [];
  }
}

function supprimerEleve(ligne) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var feuille = ss.getSheetByName('Élèves');
    feuille.deleteRow(ligne);
    return {success: true, message: 'Élève supprimé avec succès!'};
  } catch (e) {
    return {success: false, message: 'Erreur: ' + e.message};
  }
}

function chargerEleve(ligne) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var feuille = ss.getSheetByName('Élèves');
    var data = feuille.getRange(ligne, 1, 1, 11).getValues()[0];
    
    return {
      success: true,
      eleve: {
        ligne: ligne,
        matricule: data[0],
        nom: data[1],
        prenom: data[2],
        adresse: data[3],
        telephone: data[4],
        email: data[5],
        niveau: data[6],
        professeur: data[9],
        notes: data[10]
      }
    };
  } catch (e) {
    return {success: false, message: 'Erreur: ' + e.message};
  }
}

// ============================================
// GESTION DES PROFESSEURS
// ============================================

function ouvrirFormulaireProfesseur() {
  var html = HtmlService.createHtmlOutputFromFile('FormulaireProfesseur')
    .setWidth(600)
    .setHeight(550);
  SpreadsheetApp.getUi().showModalDialog(html, '👨‍🏫 Ajouter Professeur');
}

function ouvrirFormulaireModificationProfesseur(professeur) {
  var template = HtmlService.createTemplateFromFile('FormulaireProfesseur');
  template.professeur = professeur;
  template.modification = true;
  
  var html = template.evaluate()
    .setWidth(600)
    .setHeight(550);
  SpreadsheetApp.getUi().showModalDialog(html, '✏️ Modifier Professeur - PlanetKurs');
}

function genererIdProfesseur() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var feuille = ss.getSheetByName('Professeurs');
  var derniereLigne = feuille.getLastRow();

  if (derniereLigne <= 1) {
    return 'PROF-001';
  }

  var dernierId = feuille.getRange(derniereLigne, 1).getValue();

  // Validation et gestion d'erreur
  if (!dernierId || typeof dernierId !== 'string') {
    return 'PROF-001';
  }

  var parts = dernierId.split('-');
  if (parts.length !== 2 || parts[0] !== 'PROF') {
    return 'PROF-001';
  }

  var numero = parseInt(parts[1]);
  if (isNaN(numero)) {
    return 'PROF-001';
  }

  return 'PROF-' + String(numero + 1).padStart(3, '0');
}

function enregistrerProfesseur(data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var feuille = ss.getSheetByName('Professeurs');

    // Validation des données obligatoires
    if (!data.nom || !data.prenom) {
      return {success: false, message: 'Le nom et le prénom sont obligatoires!'};
    }

    var idProf = data.idProf || genererIdProfesseur();
    var dateEmbauche = new Date();

    // Formater le numéro de téléphone avec +261
    var telephone = data.telephone || '';
    if (telephone && !telephone.startsWith('+261')) {
      telephone = telephone.replace(/[\s\-\(\)]/g, '');
      if (telephone.startsWith('0')) {
        telephone = telephone.substring(1);
      }
      telephone = '+261 ' + telephone;
    }
    
    var ligne = [
      idProf,
      data.nom,
      data.prenom,
      data.niveau,
      data.adresse,
      telephone,
      data.email || '',
      dateEmbauche
    ];
    
    if (data.modifier && data.ligneModifier) {
      feuille.getRange(data.ligneModifier, 1, 1, 8).setValues([ligne]);
      return {success: true, message: 'Professeur modifié avec succès!'};
    } else {
      feuille.appendRow(ligne);
      
      var derniereLigne = feuille.getLastRow();
      if (derniereLigne % 2 === 0) {
        feuille.getRange(derniereLigne, 1, 1, 8).setBackground('#FFE4E1');
      }
      
      return {success: true, message: 'Professeur enregistré avec succès!'};
    }
  } catch (e) {
    return {success: false, message: 'Erreur: ' + e.message};
  }
}

function ouvrirRechercheProfesseur() {
  var html = HtmlService.createHtmlOutputFromFile('RechercheProfesseur')
    .setWidth(800)
    .setHeight(500);
  SpreadsheetApp.getUi().showModalDialog(html, '🔍 Rechercher Professeur');
}

function rechercherProfesseur(critere, valeur) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var feuille = ss.getSheetByName('Professeurs');
    
    if (!feuille) {
      return [];
    }
    
    var data = feuille.getDataRange().getValues();
    
    if (data.length <= 1) {
      return [];
    }
    
    var resultats = [];
    var colonnes = {
      'id': 0,
      'nom': 1,
      'prenom': 2,
      'niveau': 3
    };
    
    var colonne = colonnes[critere];
    
    if (colonne === undefined) {
      return [];
    }
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][colonne] && data[i][colonne].toString().toLowerCase().indexOf(valeur.toLowerCase()) !== -1) {
        resultats.push({
          ligne: i + 1,
          id: data[i][0] || '',
          nom: data[i][1] || '',
          prenom: data[i][2] || '',
          niveau: data[i][3] || '',
          adresse: data[i][4] || '',
          telephone: data[i][5] || '',
          email: data[i][6] || '',
          dateEmbauche: data[i][7] || ''
        });
      }
    }
    
    return resultats;
  } catch (e) {
    Logger.log('Erreur rechercherProfesseur: ' + e.message);
    return [];
  }
}

function supprimerProfesseur(ligne) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var feuille = ss.getSheetByName('Professeurs');
    feuille.deleteRow(ligne);
    return {success: true, message: 'Professeur supprimé avec succès!'};
  } catch (e) {
    return {success: false, message: 'Erreur: ' + e.message};
  }
}

function chargerProfesseur(ligne) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var feuille = ss.getSheetByName('Professeurs');
    var data = feuille.getRange(ligne, 1, 1, 8).getValues()[0];
    
    return {
      success: true,
      professeur: {
        ligne: ligne,
        id: data[0],
        nom: data[1],
        prenom: data[2],
        niveau: data[3],
        adresse: data[4],
        telephone: data[5],
        email: data[6]
      }
    };
  } catch (e) {
    return {success: false, message: 'Erreur: ' + e.message};
  }
}

function obtenirListeProfesseurs() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var feuille = ss.getSheetByName('Professeurs');
  var data = feuille.getDataRange().getValues();
  
  var professeurs = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][0]) {
      professeurs.push(data[i][1] + ' ' + data[i][2] + ' (' + data[i][3] + ')');
    }
  }
  
  return professeurs;
}

// ============================================
// GESTION DE LA TRÉSORERIE
// ============================================

function ouvrirFormulaireTransaction() {
  var html = HtmlService.createHtmlOutputFromFile('FormulaireTransaction')
    .setWidth(550)
    .setHeight(500);
  SpreadsheetApp.getUi().showModalDialog(html, '💰 Nouvelle Transaction');
}

function enregistrerTransaction(data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var feuille = ss.getSheetByName('Trésorerie');

    // Validation des données obligatoires
    if (!data.type || !data.categorie || !data.montant || !data.description) {
      return {success: false, message: 'Tous les champs obligatoires doivent être remplis!'};
    }

    // Validation du montant
    var montantNum = parseFloat(data.montant);
    if (isNaN(montantNum) || montantNum <= 0) {
      return {success: false, message: 'Le montant doit être un nombre positif!'};
    }

    var dateTransaction = new Date();
    var derniereLigne = feuille.getLastRow();
    var soldeActuel = 0;

    // Récupérer le dernier solde
    if (derniereLigne > 1) {
      soldeActuel = feuille.getRange(derniereLigne, 8).getValue() || 0;
    }
    
    // Générer la référence automatique si non fournie
    var reference = data.reference;
    if (!reference || reference.trim() === '') {
      reference = genererReferenceTransaction(data.type);
    }
    
    // Calculer le nouveau solde
    var montant = parseFloat(data.montant);
    var nouveauSolde = soldeActuel;
    
    if (data.type === 'Entrée') {
      nouveauSolde += montant;
    } else {
      nouveauSolde -= montant;
      montant = -montant; // Montant négatif pour les sorties
    }
    
    // Déterminer le nom à enregistrer (élève ou professeur)
    var nomPersonne = '';
    if (data.nomEleve) {
      nomPersonne = data.nomEleve;
    } else if (data.nomProfesseur) {
      nomPersonne = data.nomProfesseur;
    }
    
    var ligne = [
      dateTransaction,
      data.type,
      data.categorie,
      nomPersonne,
      data.moisAPayer || '',
      data.description,
      montant,
      nouveauSolde,
      reference
    ];
    
    feuille.appendRow(ligne);
    
    // Formatage
    derniereLigne = feuille.getLastRow();
    if (data.type === 'Entrée') {
      feuille.getRange(derniereLigne, 1, 1, 9).setBackground('#E8F5E9');
    } else {
      feuille.getRange(derniereLigne, 1, 1, 9).setBackground('#FFEBEE');
    }
    
    // Format monétaire pour les colonnes montant et solde
    feuille.getRange(derniereLigne, 7).setNumberFormat('#,##0" Ar"');
    feuille.getRange(derniereLigne, 8).setNumberFormat('#,##0" Ar"');
    
    return {
      success: true, 
      message: 'Transaction enregistrée avec succès!', 
      solde: nouveauSolde,
      reference: reference,
      ligne: derniereLigne,
      montant: data.type === 'Entrée' ? parseFloat(data.montant) : -parseFloat(data.montant),
      date: dateTransaction,
      categorie: data.categorie,
      nomEleve: data.nomEleve || nomPersonne,
      moisAPayer: data.moisAPayer,
      description: data.description
    };
  } catch (e) {
    return {success: false, message: 'Erreur: ' + e.message};
  }
}

function genererReferenceTransaction(type) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var feuille = ss.getSheetByName('Trésorerie');
  var derniereLigne = feuille.getLastRow();
  var anneeActuelle = new Date().getFullYear();
  var moisActuel = ('0' + (new Date().getMonth() + 1)).slice(-2);
  
  // Compter le nombre de transactions de ce type ce mois-ci
  var data = feuille.getDataRange().getValues();
  var compteur = 0;
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][8]) { // Si référence existe
      var ref = data[i][8].toString();
      var prefixe = type === 'Entrée' ? 'REC-' : 'PAY-';
      var dateRef = new Date(data[i][0]);
      
      if (ref.startsWith(prefixe) && 
          dateRef.getFullYear() === anneeActuelle && 
          dateRef.getMonth() === new Date().getMonth()) {
        compteur++;
      }
    }
  }
  
  compteur++;
  var prefixe = type === 'Entrée' ? 'REC' : 'PAY';
  var numero = String(compteur).padStart(4, '0');
  
  return prefixe + '-' + anneeActuelle + moisActuel + '-' + numero;
}

function obtenirTransaction(ligne) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var feuille = ss.getSheetByName('Trésorerie');
    var data = feuille.getRange(ligne, 1, 1, 9).getValues()[0];
    
    return {
      success: true,
      transaction: {
        date: data[0],
        type: data[1],
        categorie: data[2],
        nomEleve: data[3],
        moisAPayer: data[4],
        description: data[5],
        montant: data[6],
        solde: data[7],
        reference: data[8]
      }
    };
  } catch (e) {
    return {success: false, message: 'Erreur: ' + e.message};
  }
}

// ============================================
// TABLEAU DE BORD
// ============================================

function afficherTableauDeBord() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var feuille = ss.getSheetByName('Tableau de Bord');
  ss.setActiveSheet(feuille);
  SpreadsheetApp.getUi().alert('📊 Tableau de Bord', 
    'Le tableau de bord affiche les statistiques en temps réel de PlanetKurs.\n\n' +
    '✓ Statistiques des élèves par niveau\n' +
    '✓ Nombre de professeurs\n' +
    '✓ État de la trésorerie', 
    SpreadsheetApp.getUi().ButtonSet.OK);
}

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

function obtenirNiveaux() {
  return ['A1', 'A2', 'B1', 'B2'];
}

function obtenirListeEleves() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var feuille = ss.getSheetByName('Élèves');
  var data = feuille.getDataRange().getValues();
  
  var eleves = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][0]) {
      eleves.push({
        matricule: data[i][0],
        nom: data[i][1] + ' ' + data[i][2] + ' (' + data[i][0] + ')'
      });
    }
  }
  
  return eleves;
}

// ============================================
// LISTES COMPLÈTES
// ============================================

function ouvrirListeEleves() {
  var html = HtmlService.createHtmlOutputFromFile('ListeEleves')
    .setWidth(900)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, '📋 Liste Complète des Élèves');
}

function ouvrirListeProfesseurs() {
  var html = HtmlService.createHtmlOutputFromFile('ListeProfesseurs')
    .setWidth(900)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, '📋 Liste Complète des Professeurs');
}

function obtenirTousLesEleves() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    Logger.log('Spreadsheet actif: ' + ss.getName());

    var feuille = ss.getSheetByName('Élèves');

    if (!feuille) {
      Logger.log('ERREUR: Feuille Élèves non trouvée');
      Logger.log('Feuilles disponibles: ' + ss.getSheets().map(function(s) { return s.getName(); }).join(', '));
      throw new Error('La feuille "Élèves" n\'existe pas. Veuillez d\'abord exécuter "Initialiser les Feuilles" depuis le menu PlanetKurs.');
    }

    var lastRow = feuille.getLastRow();
    Logger.log('Dernière ligne dans Élèves: ' + lastRow);

    if (lastRow <= 1) {
      Logger.log('Aucune donnée dans la feuille Élèves (seulement l\'en-tête)');
      return [];
    }

    var data = feuille.getRange(2, 1, lastRow - 1, 11).getValues();
    Logger.log('Données récupérées: ' + data.length + ' lignes');

    var eleves = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i][0]) { // Si matricule existe
        eleves.push({
          ligne: i + 2,
          matricule: data[i][0] || '',
          nom: data[i][1] || '',
          prenom: data[i][2] || '',
          adresse: data[i][3] || '',
          telephone: data[i][4] || '',
          email: data[i][5] || '',
          niveau: data[i][6] || '',
          dateInscription: data[i][7] || '',
          statut: data[i][8] || '',
          professeur: data[i][9] || '',
          notes: data[i][10] || ''
        });
      }
    }

    Logger.log('Nombre d\'élèves trouvés: ' + eleves.length);
    return eleves;
  } catch (e) {
    Logger.log('ERREUR obtenirTousLesEleves: ' + e.message);
    Logger.log('Stack trace: ' + e.stack);
    throw e; // Relancer l'erreur pour qu'elle soit visible dans le HTML
  }
}

function obtenirTousLesProfesseurs() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var feuille = ss.getSheetByName('Professeurs');
    
    if (!feuille) {
      Logger.log('Feuille Professeurs non trouvée');
      return [];
    }
    
    var lastRow = feuille.getLastRow();
    if (lastRow <= 1) {
      Logger.log('Aucune donnée dans la feuille Professeurs');
      return [];
    }
    
    var data = feuille.getRange(2, 1, lastRow - 1, 8).getValues();
    
    var professeurs = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i][0]) { // Si ID existe
        professeurs.push({
          ligne: i + 2,
          id: data[i][0] || '',
          nom: data[i][1] || '',
          prenom: data[i][2] || '',
          niveau: data[i][3] || '',
          adresse: data[i][4] || '',
          telephone: data[i][5] || '',
          email: data[i][6] || '',
          dateEmbauche: data[i][7] || ''
        });
      }
    }
    
    Logger.log('Nombre de professeurs trouvés: ' + professeurs.length);
    return professeurs;
  } catch (e) {
    Logger.log('Erreur obtenirTousLesProfesseurs: ' + e.message);
    return [];
  }
}

// ============================================
// SUIVI DES PAIEMENTS
// ============================================

function ouvrirSuiviPaiements() {
  var html = HtmlService.createHtmlOutputFromFile('SuiviPaiements')
    .setWidth(1000)
    .setHeight(700);
  SpreadsheetApp.getUi().showModalDialog(html, '💰 Suivi des Paiements');
}

function verifierPaiementsEleves(mois, annee) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var feuilleEleves = ss.getSheetByName('Élèves');
  var feuilleTresorerie = ss.getSheetByName('Trésorerie');

  if (!feuilleEleves || !feuilleTresorerie) {
    return [];
  }

  var dataEleves = feuilleEleves.getDataRange().getValues();
  var dataTresorerie = feuilleTresorerie.getDataRange().getValues();

  var resultats = [];

  // Convertir mois en string si nécessaire (ex: "Janvier 2025")
  var moisStr = typeof mois === 'string' ? mois : '';

  // Pour chaque élève
  for (var i = 1; i < dataEleves.length; i++) {
    if (dataEleves[i][0] && dataEleves[i][8] === 'Actif') {
      var matricule = dataEleves[i][0];
      var nomComplet = dataEleves[i][1] + ' ' + dataEleves[i][2];
      var niveau = dataEleves[i][6];

      // Vérifier si paiement pour ce mois
      var paye = false;
      var montant = 0;
      var datePaiement = null;

      for (var j = 1; j < dataTresorerie.length; j++) {
        var nomEleve = dataTresorerie[j][3];
        var moisPaye = dataTresorerie[j][4];
        var categorie = dataTresorerie[j][2];

        if (nomEleve && nomEleve.includes(matricule) &&
            moisPaye === moisStr &&
            (categorie === 'Écolage' || categorie === 'Inscription' || categorie === 'Réinscription')) {
          paye = true;
          montant = Math.abs(dataTresorerie[j][6]);
          datePaiement = dataTresorerie[j][0];
          break;
        }
      }

      resultats.push({
        matricule: matricule,
        nom: nomComplet,
        niveau: niveau,
        paye: paye,
        montant: montant,
        datePaiement: datePaiement,
        mois: moisStr
      });
    }
  }

  return resultats;
}

function verifierPaiementsProfesseurs(mois, annee) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var feuilleProfesseurs = ss.getSheetByName('Professeurs');
  var feuilleTresorerie = ss.getSheetByName('Trésorerie');

  if (!feuilleProfesseurs || !feuilleTresorerie) {
    return [];
  }

  var dataProfesseurs = feuilleProfesseurs.getDataRange().getValues();
  var dataTresorerie = feuilleTresorerie.getDataRange().getValues();

  var resultats = [];

  // Convertir mois en nombre si c'est une string
  var moisNum = typeof mois === 'number' ? mois : parseInt(mois);
  if (isNaN(moisNum)) {
    moisNum = new Date().getMonth();
  }

  // Pour chaque professeur
  for (var i = 1; i < dataProfesseurs.length; i++) {
    if (dataProfesseurs[i][0]) {
      var id = dataProfesseurs[i][0];
      var nomComplet = dataProfesseurs[i][1] + ' ' + dataProfesseurs[i][2];
      var niveau = dataProfesseurs[i][3];

      // Vérifier si salaire payé pour ce mois
      var paye = false;
      var montant = 0;
      var datePaiement = null;

      for (var j = 1; j < dataTresorerie.length; j++) {
        var description = dataTresorerie[j][5];
        var categorie = dataTresorerie[j][2];

        if (categorie === 'Salaire Professeur' &&
            description && (description.includes(id) || description.includes(nomComplet))) {
          var date = new Date(dataTresorerie[j][0]);
          if (date.getMonth() === moisNum && date.getFullYear() === annee) {
            paye = true;
            montant = Math.abs(dataTresorerie[j][6]);
            datePaiement = dataTresorerie[j][0];
            break;
          }
        }
      }

      resultats.push({
        id: id,
        nom: nomComplet,
        niveau: niveau,
        paye: paye,
        montant: montant,
        datePaiement: datePaiement,
        mois: moisNum
      });
    }
  }

  return resultats;
}

function obtenirToutesTransactions(type, categorie, mois, annee) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var feuille = ss.getSheetByName('Trésorerie');
    
    if (!feuille) {
      return [];
    }
    
    var lastRow = feuille.getLastRow();
    if (lastRow <= 1) {
      return [];
    }
    
    var data = feuille.getRange(2, 1, lastRow - 1, 9).getValues();
    
    var resultats = [];
    
    for (var i = 0; i < data.length; i++) {
      if (data[i][0]) { // Si date existe
        var date = new Date(data[i][0]);
        var transactionType = data[i][1];
        var transactionCategorie = data[i][2];
        
        // Appliquer les filtres
        var inclure = true;
        
        // Filtre type
        if (type && transactionType !== type) {
          inclure = false;
        }
        
        // Filtre catégorie
        if (categorie && transactionCategorie !== categorie) {
          inclure = false;
        }
        
        // Filtre mois
        if (mois !== null && date.getMonth() !== mois) {
          inclure = false;
        }
        
        // Filtre année
        if (annee && date.getFullYear() !== annee) {
          inclure = false;
        }
        
        if (inclure) {
          resultats.push({
            date: data[i][0],
            type: transactionType,
            categorie: transactionCategorie,
            nomPersonne: data[i][3] || '',
            moisAPayer: data[i][4] || '',
            description: data[i][5] || '',
            montant: data[i][6] || 0,
            solde: data[i][7] || 0,
            reference: data[i][8] || ''
          });
        }
      }
    }
    
    return resultats;
  } catch (e) {
    Logger.log('Erreur obtenirToutesTransactions: ' + e.message);
    return [];
  }
}