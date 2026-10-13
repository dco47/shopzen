const formulaire = document.querySelector("#signup-form");
const champPrenom = document.querySelector("#prenom");
const champNom = document.querySelector("#nom");
const champEmail = document.querySelector("#email");
const champMotDePasse = document.querySelector("#mot-de-passe");
const champConfirmation = document.querySelector("#confirmation");
const caseConditions = document.querySelector("#conditions");
const boutonAfficherMotDePasse = document.querySelector(".password-toggle");
const message = document.querySelector("#signup-feedback");

boutonAfficherMotDePasse.addEventListener("click", () => {
  const afficherMotDePasse = champMotDePasse.type === "password";
  champMotDePasse.type = afficherMotDePasse ? "text" : "password";
  boutonAfficherMotDePasse.setAttribute(
    "aria-pressed",
    String(afficherMotDePasse),
  );
  boutonAfficherMotDePasse.setAttribute(
    "aria-label",
    afficherMotDePasse ? "Masquer le mot de passe" : "Afficher le mot de passe",
  );
});

formulaire.addEventListener("submit", (event) => {
  event.preventDefault();

  const prenom = champPrenom.value.trim();
  const nom = champNom.value.trim();
  const email = champEmail.value.trim();
  const motDePasse = champMotDePasse.value;
  const confirmation = champConfirmation.value;

  if (prenom === "") {
    message.textContent = "Veuillez saisir votre prénom.";
  } else if (nom === "") {
    message.textContent = "Veuillez saisir votre nom.";
  } else if (email === "") {
    message.textContent = "Veuillez saisir votre adresse e-mail.";
  } else if (champEmail.validity.typeMismatch) {
    message.textContent = "Veuillez saisir une adresse e-mail valide.";
  } else if (motDePasse === "") {
    message.textContent = "Veuillez saisir un mot de passe.";
  } else if (motDePasse.length < 8) {
    message.textContent =
      "Le mot de passe doit contenir au moins 8 caractères.";
  } else if (confirmation === "") {
    message.textContent = "Veuillez confirmer votre mot de passe.";
  } else if (motDePasse !== confirmation) {
    message.textContent = "Les deux mots de passe ne correspondent pas.";
  } else if (!caseConditions.checked) {
    message.textContent = "Veuillez accepter les conditions pour continuer.";
  } else {
    message.textContent = "Les champs sont correctement remplis.";
  }
});
