// Dalil Visa — version de démonstration sans IA
// Les réponses sont pré-écrites : elles ne remplacent pas les consignes officielles.
const qs = [
  {name:"purpose", title:"Quel est le motif principal de votre voyage ?", opts:[["tourisme","✈","Tourisme / vacances"],["visite","♡","Visite familiale ou amicale"],["etudes","▤","Études / formation"],["travail","▣","Travail"],["autre","⋯","Autre motif"]]},
  {name:"destination", title:"Quelle est votre destination principale ?", opts:[["france","🇫🇷","France"],["autre","🌍","Un autre pays"]]},
  {name:"duration", title:"Quelle est la durée prévue de votre séjour ?", opts:[["short","◷","90 jours maximum"],["long","▣","Plus de 90 jours"],["unsure","?","Je ne suis pas sûr(e)"]]}
];

let step = 0;
const answers = {};
const $ = s => document.querySelector(s);

function render() {
  const q = qs[step];
  if (!$("#counter") || !$("#bar") || !$("#qtitle") || !$("#result") || !$("#options")) return;
  $("#counter").textContent = `QUESTION ${step + 1} SUR 3`;
  $("#bar").style.width = ((step + 1) / 3 * 100) + "%";
  $("#qtitle").textContent = q.title;
  $("#qtitle").style.color = "";
  $("#result").innerHTML = "";
  $("#options").innerHTML = q.opts.map(o =>
    `<label class="opt"><input type="radio" name="${q.name}" value="${o[0]}" ${answers[q.name] === o[0] ? "checked" : ""}><span>${o[1]} &nbsp; ${o[2]}</span></label>`
  ).join("");
  $("#back").disabled = step === 0;
  $("#next").hidden = false;
  $("#next").textContent = step === 2 ? "Voir mon orientation →" : "Continuer →";
}

if ($("#next")) $("#next").onclick = () => {
  const q = qs[step];
  const v = document.querySelector(`input[name="${q.name}"]:checked`);
  if (!v) {
    $("#qtitle").textContent = "Choisissez une réponse pour continuer.";
    $("#qtitle").style.color = "#c94727";
    return;
  }
  answers[q.name] = v.value;
  if (step < 2) {
    step++;
    render();
    return;
  }
  let msg;
  if (answers.destination !== "france") {
    msg = "Ce parcours est actuellement conçu pour les démarches vers la France. Pour un autre pays, vérifiez les exigences auprès du site officiel de ses autorités consulaires.";
  } else if (answers.duration === "long" || ["etudes", "travail"].includes(answers.purpose)) {
    msg = "Votre projet peut relever d’un visa de long séjour. Les démarches varient selon le motif, votre situation et les règles applicables. Commencez par le parcours officiel France-Visas.";
  } else if (answers.purpose === "visite") {
    msg = "Pour une visite familiale ou amicale, préparez votre demande selon le motif exact. Selon votre situation, des justificatifs d’hébergement, de ressources, de retour et de lien avec la personne visitée peuvent être demandés.";
  } else {
    msg = "Pour un séjour touristique de courte durée, préparez votre demande selon votre situation. Des justificatifs concernant le motif du voyage, les ressources, l’hébergement, l’assurance et le retour peuvent être demandés.";
  }
  $("#options").innerHTML = "";
  $("#qtitle").textContent = "Voici par où commencer";
  $("#result").innerHTML = `<p>${msg}</p><p><strong>Important :</strong> cette orientation est indicative, ne garantit pas l’obtention du visa et ne remplace pas la liste personnalisée générée par le site officiel.</p><a class="official" target="_blank" rel="noopener noreferrer" href="https://www.france-visas.gouv.fr/tunisie">France-Visas Tunisie ↗</a><a class="official" target="_blank" rel="noopener noreferrer" href="https://visas-fr.tlscontact.com/fr-fr/country/tn">TLScontact Tunisie ↗</a>`;
  $("#next").hidden = true;
  $("#back").disabled = false;
};

if ($("#back")) $("#back").onclick = () => {
  if ($("#next") && $("#next").hidden) {
    step = 2;
    $("#next").hidden = false;
  } else {
    step = Math.max(0, step - 1);
  }
  render();
};

if ($("#chatOpen")) $("#chatOpen").onclick = () => { if ($("#chat")) $("#chat").hidden = false; };
if ($("#chatClose")) $("#chatClose").onclick = () => { if ($("#chat")) $("#chat").hidden = true; };

const officialLinks = {
  france: "https://www.france-visas.gouv.fr/tunisie",
  tls: "https://visas-fr.tlscontact.com/fr-fr/country/tn",
  campus: "https://www.tunisie.campusfrance.org/"
};

function answerFor(message) {
  const t = message.toLocaleLowerCase("fr").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (/(bonjour|salut|bonsoir|hello|salam)/.test(t)) {
    return "Bonjour et bienvenue sur Dalil Visa ! Je peux vous orienter pour une demande de visa depuis la Tunisie. Votre voyage concerne le tourisme, une visite familiale, les études ou le travail ?";
  }
  if (/(document|papier|piece|justificatif|dossier|check.?list)/.test(t) && /(tour|vacance|visite|famille|ami)/.test(t)) {
    return "Pour un court séjour touristique ou une visite, les justificatifs dépendent de votre situation. On peut notamment vous demander : passeport valide, formulaire et photo conformes, motif du voyage, hébergement, ressources financières, assurance voyage et éléments concernant le retour. Ce n’est pas une liste définitive : utilisez l’assistant officiel France-Visas pour obtenir la liste adaptée à votre dossier.";
  }
  if (/(document|papier|piece|justificatif|dossier|check.?list)/.test(t)) {
    return "La liste exacte dépend du motif (tourisme, visite, études, travail), de la durée et de votre situation personnelle. Dites-moi le motif et la durée prévue, et je vous donnerai une orientation générale. Pour la liste officielle personnalisée, commencez sur France-Visas Tunisie.";
  }
  if (/(tourisme|touristique|vacance|vacances|visiter la france)/.test(t)) {
    return "Pour le tourisme en France, vérifiez d’abord si votre projet relève d’un court séjour (généralement jusqu’à 90 jours sur toute période de 180 jours) ou d’un autre type de visa. Préparez les justificatifs demandés selon votre situation : objet du voyage, hébergement, ressources, assurance et retour peuvent notamment être examinés. La liste officielle se génère sur France-Visas.";
  }
  if (/(visite familiale|visite amicale|famille|ami|heberger|attestation d'accueil)/.test(t)) {
    return "Pour une visite familiale ou amicale, les justificatifs varient selon l’hébergement et votre situation. Si vous êtes hébergé chez un particulier, une attestation d’accueil peut être nécessaire dans certains cas. Vérifiez les exigences correspondant exactement à votre demande sur France-Visas.";
  }
  if (/(etud|campus france|universit|formation|etudiant)/.test(t)) {
    return "Pour des études en France, la procédure dépend notamment de votre admission, du programme et de la durée du séjour. Commencez par Campus France Tunisie pour les démarches liées aux études, puis vérifiez les formalités de visa sur France-Visas. N’engagez pas de démarche sur la base de cette réponse seule.";
  }
  if (/(travail|emploi|salarie|contrat|professionnel)/.test(t)) {
    return "Pour travailler en France, la procédure dépend du type de contrat et des autorisations nécessaires. Un visa touristique ne permet pas de travailler. Vérifiez le parcours correspondant à votre situation sur France-Visas et auprès des autorités compétentes.";
  }
  if (/(prix|tarif|frais|combien coute|combien coûte)/.test(t)) {
    return "Les frais peuvent varier selon le type de visa et les frais de service applicables. Vérifiez les montants à jour sur France-Visas et TLScontact Tunisie avant de payer. Méfiez-vous des promesses de visa garanti.";
  }
  if (/(rendez.?vous|rdv|tls|depot|dépot|déposer|deposer)/.test(t)) {
    return "Pour les modalités de dépôt et de rendez-vous en Tunisie, consultez le site officiel TLScontact. Vérifiez aussi les étapes indiquées dans votre dossier France-Visas. Dalil Visa ne réserve pas de rendez-vous officiel à votre place pour le moment.";
  }
  if (/(delai|délai|combien de temps|attente|reponse|réponse)/.test(t)) {
    return "Les délais dépendent du type de demande, de la période et de votre dossier. Consultez les informations officielles au moment de votre demande et évitez d’acheter des prestations non remboursables avant d’avoir vérifié les conditions applicables.";
  }
  if (/(refus|refuse|refusé|refusée|recours)/.test(t)) {
    return "En cas de refus, lisez attentivement la notification : elle indique les motifs et, le cas échéant, les voies et délais de recours applicables. Les possibilités varient selon la décision. Ne vous fiez pas à une réponse générale pour calculer un délai légal.";
  }
  if (/(france.?visas|source officielle|site officiel|lien officiel|source)/.test(t)) {
    return `Voici les sources officielles à consulter : France-Visas Tunisie : ${officialLinks.france} ; TLScontact Tunisie pour le dépôt : ${officialLinks.tls} ; Campus France Tunisie pour les études : ${officialLinks.campus}.`;
  }
  return "Je suis l’assistant de démonstration de Dalil Visa : je réponds à quelques questions fréquentes, mais je ne suis pas encore connecté à une IA. Pour vous orienter, précisez le motif (tourisme, visite familiale, études ou travail) et la durée du séjour. Pour les consignes à jour, consultez France-Visas Tunisie : https://www.france-visas.gouv.fr/tunisie";
}

function send(text) {
  if (!text || !text.trim() || !$("#messages")) return;
  const userMessage = document.createElement("p");
  userMessage.className = "user";
  userMessage.textContent = text.trim();
  $("#messages").append(userMessage);

  const botMessage = document.createElement("p");
  botMessage.className = "bot";
  botMessage.textContent = answerFor(text.trim());
  $("#messages").append(botMessage);
  $("#messages").scrollTop = $("#messages").scrollHeight;
}

if ($("#chatform")) $("#chatform").onsubmit = e => {
  e.preventDefault();
  const input = $("#chatinput");
  if (!input) return;
  send(input.value);
  input.value = "";
  input.focus();
};
document.querySelectorAll(".chips button").forEach(button => {
  button.onclick = () => send(button.textContent);
});

render();


const yearNode = document.querySelector("#year");
if (yearNode) yearNode.textContent = new Date().getFullYear();
const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");
if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const opened = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(opened));
  });
  mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }));
}
