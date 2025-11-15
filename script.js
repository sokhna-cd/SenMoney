
// Tableaux obligatoires
var tabNumeros = ["772346889", "772781047", "775878453", "771020340", "771045435"];
var tabSoldes  = [1000, 1500, 2000, 2500, 3000];
var tabCodes   = [1234, 2345, 2376, 4321, 9876];

var nbreNum = tabNumeros.length;
var numCourant;

// Variable supplémentaire demandée par l’énoncé
let soldeCompte = 10000;

// Stockage des textes multilingues
let textes = {};


/********************************
 *  PARTIE 2 – LANGUES (AJAX)
 ********************************/

function chargerLangue(codeLangue) {
  let fichier = "donnees_" + codeLangue + ".txt";

  $.ajax({
    url: fichier,
    type: "GET",
    dataType: "text",
    success: function(data) {
      parseDonnees(data);
      majTextesPage();
    },
    error: function() {
      alert("Impossible de charger : " + fichier);
    }
  });
}

function parseDonnees(texte) {
  textes = {};
  let lignes = texte.split("\n");

  lignes.forEach(function(l) {
    l = $.trim(l);
    if (l === "" || l.startsWith("#")) return;

    let parts = l.split("=");
    let cle = $.trim(parts[0]);
    let val = $.trim(parts.slice(1).join("="));
    textes[cle] = val;
  });
}

function majTextesPage() {
  if (textes["titreAppli"])  $("#titreAppli").text(textes["titreAppli"]);
  if (textes["sousTitre"])   $("#sousTitre").text(textes["sousTitre"]);
  if (textes["btnMenu"])     $("#btnMenu").text(textes["btnMenu"]);
   if (textes["lang-block"])  $("#lblLang").text(textes["lang-block"]);
  if (textes["formNum"])     $("#lblNum").text(textes["formNum"]);
}

$(document).ready(function() {
  // Langue par défaut
  chargerLangue("fr");

  $("#langue").on("change", function() {
    chargerLangue($(this).val());
  });
});




function etapeSuivant() {
  // message genre "Voulez-vous retourner au menu ?"
  let msgRetour = textes["msgRetourMenu"] || "Voulez-vous retourner au menu ?";
  let rep = confirm(msgRetour);

  if (rep) {
    main();
  } else {
    let msgFin = textes["msgProgrammeTermine"] || "Programme terminé.";
    alert(msgFin);
  }
}

function menu() {
  if (!numCourant) {
    let msgErr = textes["errNumInvalide"] || "Aucun numéro sélectionné !";
    alert(msgErr);
    return null;
  }

  let m =
    (textes["menuTitre"]  || "------ MENU SENMONEY ------") + "\n" +
    "------ " + numCourant + " ------\n\n" +
    ( textes ["menuLigne0"]|| "Taper le numero du service choisi") + "\n"+
    (textes["menuLigne1"] || "1. Afficher le solde") + "\n" +
    (textes["menuLigne2"] || "2. Transfert d'argent") + "\n" +
    (textes["menuLigne3"] || "3. Paiement de Facture") + "\n" +
    (textes["menuLigne4"] || "4.Options") + "\n\n" ;
    

  let choix = prompt(m);
  switch (choix) {
  case "1":
    
    afficherSolde();
    break;
  case "2":
    
    transfertArgent();
    break;
  case "3":
    
    paiementFacture();
    break;
  case "4":
    
     optionsSenMoney ? optionsSenMoney() : alert("Options non implémentées");
      break;
    
  default:
    alert("Choix invalide.");
    etapeSuivant();
}

  if (choix === null) return null;

  return parseInt(choix);
}

function main() {

    // a. Récupérer le numéro choisi dans le formulaire
    numCourant = document.getElementById("num").value;

    // Si aucun numéro sélectionné
    if (!numCourant) {
        alert("Veuillez sélectionner un numéro !");
        return;
    }

    // b. Appeler menu() et récupérer la réponse
    let rep = menu();

    // c. Si rep = 1 → afficherSolde()
    if (rep === "1") {
        afficherSolde();
    }

    // d. Appeler etapeSuivant()
    etapeSuivant();
}



function afficherSolde() {
  let indice = tabNumeros.indexOf(numCourant);

  if (indice === -1) {
    let msgErr = textes["errNumIntrouvable"] || "Numéro introuvable !";
    alert(msgErr);
    return;
  }

  let msgCode = textes["msgcodesecurite"] || "Entrez votre code de sécurité :";
  let code = prompt(msgCode);

  if (code === null) {
    let msgAnn = textes["errOperationAnnulee"] || "Opération annulée.";
    alert(msgAnn);
    return;
  }

  if (parseInt(code, 10) === tabCodes[indice]) {
    let solde = tabSoldes[indice];

    let phraseSolde = textes["msgSolde"] || "Votre solde est :";
    let phraseRetour = textes["msgRetourMenu"] || "Voulez-vous retourner au menu ?";

    let msgSolde =
      phraseSolde + " " + solde + " FCFA\n" +
      phraseRetour;

    alert(msgSolde);
}

 

   else {
    let msgErrCode = textes["errCodeIncorrect"] || "Code incorrect !";
    alert(msgErrCode);
  }
}

function transfertArgent() {
  let exp = tabNumeros.indexOf(numCourant);

  if (exp === -1) {
    let msgErr = textes["errNumIntrouvable"] || "Numéro introuvable !";
    alert(msgErr);
    return;
  }

  // 🔹 1) Numéro bénéficiaire
  let msgNumRecep = textes["msgNumRecep"] || "Entrez le numéro bénéficiaire :";
  let recepteur = prompt(msgNumRecep);

  if (recepteur === null) {
    let msgAnn = textes["errOperationAnnulee"] || "Opération annulée.";
    alert(msgAnn);
    return;
  }

  if (!tabNumeros.includes(recepteur)) {
    let msgInv = textes["errNumInvalide"] || "Numéro invalide !";
    alert(msgInv);
    return;
  }

  let rec = tabNumeros.indexOf(recepteur);

  // 🔹 2) Montant
  let msgMontant = textes["msgMontant"] || "Montant à transférer :";
  let montantStr = prompt(msgMontant);

  if (montantStr === null) {
    let msgAnn = textes["errOperationAnnulee"] || "Opération annulée.";
    alert(msgAnn);
    return;
  }

  let montant = parseInt(montantStr, 10);
  let frais = 50;

  if (isNaN(montant) || montant <= 0) {
    let msgErrMontant = textes["errMontantInvalide"] || "Montant invalide !";
    alert(msgErrMontant);
    return;
  }

  if (montant + frais > tabSoldes[exp]) {
    let msgErrSolde = textes["errSoldeInsuffisant"] || "Solde insuffisant !";
    alert(msgErrSolde);
    return;
  }

  // 🔹 3) Vérification code de sécurité de l’expéditeur
  let msgCode = textes["msgcodesecurite"] || "Entrez votre code de sécurité :";
  let code = prompt(msgCode);

  if (code === null) {
    let msgAnn = textes["errOperationAnnulee"] || "Opération annulée.";
    alert(msgAnn);
    return;
  }

  if (parseInt(code, 10) !== tabCodes[exp]) {
    let msgErrCode = textes["errCodeIncorrect"] || "Code incorrect !";
    alert(msgErrCode);
    return;
  }

  // 🔹 4) Effectuer le transfert
  tabSoldes[exp] -= (montant + frais);
  tabSoldes[rec] += montant;

  let msgOK = textes["msgTransfertReussi"] || "Transfert réussi !";
  alert(msgOK);
}
function paiementFacture() {

  // 1) Vérifier qu’un numéro est bien connecté
  if (!numCourant) {
    alert("Aucun numéro sélectionné !");
    return;
  }

  let iSource = tabNumeros.indexOf(numCourant);
  if (iSource === -1) {
    alert("Numéro introuvable dans SenMoney !");
    return;
  }

  // 2) Message pour choisir le type de facture
  let msgChoixFacture =
  (textes["msgTitrePaiementFacture"] || "------ PAIEMENT FACTURE ------") + "\n" +
  (textes["msgFacture1"] || "1 - Facture d'électricité") + "\n" +
  (textes["msgFacture2"] || "2 - Facture d'eau") + "\n" +
  (textes["msgFacture3"] || "3 - Facture internet") + "\n\n" +
  (textes["msgInviteChoixFacture"] || "Taper le numéro du service :");

let choix = prompt(msgChoixFacture);

  if (!choix) {
    alert(textes["msgOpAnnulee"] || "Opération annulée.");
    return;
  }

  // 3) Déterminer le libellé du type de facture
  let typeFacture = "";
  switch (choix) {
    case "1":
      typeFacture = textes["typeFactureElec"] || "facture d'électricité";
      break;
    case "2":
      typeFacture = textes["typeFactureEau"] || "facture d'eau";
      break;
    case "3":
      typeFacture = textes["typeFactureInternet"] || "facture internet";
      break;
    default:
      alert(textes["msgChoixInvalide"] || "Choix invalide.");
      return;
  }

  // 4) Saisie de la référence de facture
  let msgRefFacture = textes["msgRefFacture"] || "Entrez la référence de la facture :";
  let refFacture = prompt(msgRefFacture);
  if (!refFacture) {
    alert(textes["msgOpAnnulee"] || "Opération annulée.");
    return;
  }

  // 5) Saisie du montant
  let msgMontantFacture = textes["msgMontantFacture"] || "Entrez le montant de la facture :";
  let montant = parseInt(prompt(msgMontantFacture), 10);
  if (isNaN(montant) || montant <= 0) {
    alert(textes["msgMontantInvalide"] || "Montant invalide. Opération annulée.");
    return;
  }

  // 6) Saisie du code secret
  let msgCodeSecret = textes["msgCodeSecret"] || "Entrez votre code secret SenMoney :";
  let codeSaisi = parseInt(prompt(msgCodeSecret), 10);
  if (isNaN(codeSaisi)) {
    alert(textes["msgCodeInvalide"] || "Code invalide. Opération annulée.");
    return;
  }

  // 7) Vérifier le code
  if (tabCodes[iSource] !== codeSaisi) {
    alert(textes["msgCodeIncorrect"] || "Code secret incorrect !");
    return;
  }

  // 8) Vérifier le solde
  if (tabSoldes[iSource] < montant) {
    alert(textes["msgSoldeInsuffisant"] || "Solde insuffisant pour payer cette facture !");
    return;
  }

  // 9) Débiter le compte
  tabSoldes[iSource] -= montant;

  // 10) Message de confirmation
  let msgPaiementOK = textes["msgPaiementOK"] || "✅ Paiement effectué avec succès !";
  let msgNouveauSolde = textes["msgNouveauSolde"] || "Nouveau solde :";

  alert(
    msgPaiementOK + "\n\n" +
    typeFacture + " (" + refFacture + ")\n" +
    "Montant : " + montant + " F\n\n" +
    msgNouveauSolde + " " + tabSoldes[iSource] + " F"
  );

  // 11) Retour au menu (même style que pour le solde)
  let msgRetourMenu = textes["msgRetourMenu"] || "Voulez-vous retourner au menu principal ?";
  let rep = confirm(msgRetourMenu);
  if (rep) {
    if (typeof main === "function") main();
  } else {
    alert(textes["msgAuRevoir"] || "Au revoir !");
  }
}
