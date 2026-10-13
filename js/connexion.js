const formulaire = document.querySelector("#formulaire-connexion");
const champEmail = document.querySelector("#email");
const champMotDePasse = document.querySelector("#mot-de-passe");
const message = document.querySelector("#message-connexion");

formulaire.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = champEmail.value.trim();
  const motDePasse = champMotDePasse.value.trim();

  if (email === "") {
    message.textContent = "Veuillez saisir votre adresse e-mail.";
  } else if (motDePasse === "") {
    message.textContent = "Veuillez saisir votre mot de passe.";
  } else {
    message.textContent = "Les champs sont correctement remplis.";
  }
});
