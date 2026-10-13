const zonePanierVide = document.querySelector("#cart-empty");
const zonePanierRempli = document.querySelector("#cart-full");
const listeArticles = document.querySelector("#cart-items");
const totalPanier = document.querySelector("#cart-total");
const nombreArticles = document.querySelector("#cart-count");

function lirePanier() {
  try {
    const panierSauvegarde = JSON.parse(localStorage.getItem("panier")) || [];
    return Array.isArray(panierSauvegarde) ? panierSauvegarde : [];
  } catch {
    return [];
  }
}

function afficherPanier() {
  const panier = lirePanier().filter((article) => {
    return (
      produits.some((produit) => produit.id === article.id) &&
      article.quantite > 0
    );
  });

  zonePanierVide.hidden = panier.length > 0;
  zonePanierRempli.hidden = panier.length === 0;

  if (panier.length === 0) {
    return;
  }

  let total = 0;
  let quantiteTotale = 0;

  listeArticles.innerHTML = panier
    .map((article) => {
      const produit = produits.find((element) => element.id === article.id);
      const sousTotal = produit.prix * article.quantite;
      total += sousTotal;
      quantiteTotale += article.quantite;

      return `
        <article class="cart-item">
          <img src="${produit.image}" alt="${produit.nom}" />
          <div class="cart-item-info">
            <span class="product-category">${produit.categorie}</span>
            <h2>${produit.nom}</h2>
            <p>${produit.prix.toLocaleString("fr-FR")} FCFA l’unité</p>
          </div>
          <div class="cart-item-actions">
            <div class="quantity-control" aria-label="Quantité">
              <button type="button" data-action="moins" data-id="${produit.id}" aria-label="Diminuer ${produit.nom}">−</button>
              <span>${article.quantite}</span>
              <button type="button" data-action="plus" data-id="${produit.id}" aria-label="Augmenter ${produit.nom}">+</button>
            </div>
            <strong>${sousTotal.toLocaleString("fr-FR")} FCFA</strong>
            <button class="remove-item" type="button" data-action="supprimer" data-id="${produit.id}" aria-label="Supprimer ${produit.nom}" title="Supprimer">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
        </article>
      `;
    })
    .join("");

  totalPanier.textContent = `${total.toLocaleString("fr-FR")} FCFA`;
  nombreArticles.textContent = `${quantiteTotale} article${quantiteTotale > 1 ? "s" : ""}`;
}

listeArticles.addEventListener("click", (event) => {
  const bouton = event.target.closest("button[data-action]");

  if (!bouton) {
    return;
  }

  const idProduit = Number(bouton.dataset.id);
  let panier = lirePanier();
  const article = panier.find((element) => element.id === idProduit);

  if (bouton.dataset.action === "plus" && article) {
    article.quantite++;
  } else if (bouton.dataset.action === "moins" && article) {
    article.quantite--;
    panier = panier.filter((element) => element.quantite > 0);
  } else if (bouton.dataset.action === "supprimer") {
    panier = panier.filter((element) => element.id !== idProduit);
  }

  localStorage.setItem("panier", JSON.stringify(panier));
  afficherPanier();
});

afficherPanier();
