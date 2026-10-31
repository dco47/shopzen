const zoneCommandeVide = document.querySelector("#checkout-empty");
const contenuCommande = document.querySelector("#checkout-content");
const formulaireCommande = document.querySelector("#checkout-form");
const listeCommande = document.querySelector("#checkout-items");
const totalCommande = document.querySelector("#checkout-total");
const messageErreurCommande = document.querySelector("#checkout-error");
const confirmationCommande = document.querySelector("#checkout-success");

function lireArticlesCommande() {
  try {
    const articles = JSON.parse(localStorage.getItem("panier")) || [];
    return Array.isArray(articles)
      ? articles.filter(
          (article) =>
            produits.some((produit) => produit.id === Number(article.id)) &&
            Number.isInteger(Number(article.quantite)) &&
            Number(article.quantite) > 0,
        )
      : [];
  } catch {
    return [];
  }
}

function afficherCommande() {
  const articles = lireArticlesCommande();
  zoneCommandeVide.hidden = articles.length > 0;
  contenuCommande.hidden = articles.length === 0;

  if (articles.length === 0) {
    return;
  }

  let total = 0;
  listeCommande.innerHTML = articles
    .map((article) => {
      const produit = produits.find(
        (element) => element.id === Number(article.id),
      );
      const sousTotal = produit.prix * Number(article.quantite);
      total += sousTotal;

      return `
        <div class="checkout-item">
          <img src="${produit.image}" alt="" />
          <div>
            <strong>${produit.nom}</strong>
            <span>Quantité : ${Number(article.quantite)}</span>
          </div>
          <b>${sousTotal.toLocaleString("fr-FR")} FCFA</b>
        </div>
      `;
    })
    .join("");

  totalCommande.textContent = `${total.toLocaleString("fr-FR")} FCFA`;
}

formulaireCommande.addEventListener("submit", (event) => {
  event.preventDefault();
  messageErreurCommande.hidden = true;

  if (lireArticlesCommande().length === 0) {
    afficherCommande();
    return;
  }

  try {
    localStorage.removeItem("panier");
  } catch {
    messageErreurCommande.textContent =
      "La commande n’a pas pu être confirmée : le panier n’a pas pu être mis à jour.";
    messageErreurCommande.hidden = false;
    return;
  }

  document.dispatchEvent(new CustomEvent("shopzen:cartchange"));
  contenuCommande.hidden = true;
  confirmationCommande.hidden = false;
});

afficherCommande();
