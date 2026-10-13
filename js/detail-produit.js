// Récupère le produit demandé dans l’URL et affiche sa fiche.
const idProduit = Number(new URLSearchParams(window.location.search).get("id"));
const produit = produits.find((article) => article.id === idProduit);
const detailsProduit = document.querySelector("#product-detail");

if (detailsProduit && produit) {
  detailsProduit.classList.add("has-product");
  detailsProduit.innerHTML = `
		<img class="detail-product-image" src="${produit.image}" alt="${produit.nom}" />
		<div class="detail-product-info">
			<span class="product-category">${produit.categorie}</span>
			<h2>${produit.nom}</h2>
			<p class="detail-product-description">${produit.description}</p>
			<p class="detail-product-price">${produit.prix.toLocaleString("fr-FR")} FCFA</p>
			<button id="ajouter-panier" class="button button-primary" type="button">Ajouter au panier</button>
			<p id="cart-feedback" class="cart-feedback" role="status" aria-live="polite"></p>
		</div>
	`;

  document.querySelector("#detail-title").textContent = produit.nom;
  document.title = `${produit.nom} | ShopZen`;

  const boutonPanier = document.querySelector("#ajouter-panier");
  const messagePanier = document.querySelector("#cart-feedback");
  let minuterieNotification;

  boutonPanier.addEventListener("click", () => {
    let panier = JSON.parse(localStorage.getItem("panier")) || [];
    const articleExistant = panier.find((article) => article.id === produit.id);

    if (articleExistant) {
      articleExistant.quantite++;
    } else {
      panier.push({
        id: produit.id,
        quantite: 1,
      });
    }

    localStorage.setItem("panier", JSON.stringify(panier));
    messagePanier.textContent = "Produit ajouté au panier.";
    messagePanier.classList.add("is-visible");
    clearTimeout(minuterieNotification);
    minuterieNotification = setTimeout(() => {
      messagePanier.classList.remove("is-visible");
    }, 3000);
  });
} else if (detailsProduit) {
  detailsProduit.innerHTML = ` 
		<div class="detail-empty">
			<h2>Produit introuvable</h2>
			<p>Ce produit n’existe pas ou le lien ne contient pas d’identifiant valide.</p>
			<a class="button button-primary" href="produits.html">Voir tous les produits</a>
		</div>
	`;
}
