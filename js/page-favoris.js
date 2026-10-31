const grilleFavoris = document.querySelector("#favorites-grid");
const zoneFavorisVides = document.querySelector("#favorites-empty");

function afficherFavoris() {
  const favoris = ShopZenFavoris.lire()
    .map((id) => produits.find((produit) => produit.id === id))
    .filter(Boolean);

  zoneFavorisVides.hidden = favoris.length > 0;
  grilleFavoris.hidden = favoris.length === 0;
  grilleFavoris.innerHTML = favoris
    .map(
      (produit) => `
        <article class="product-card">
          <a class="product-image" href="produit.html?id=${produit.id}" aria-label="Découvrir ${produit.nom}">
            <img src="${produit.image}" alt="${produit.nom}">
            <span class="quick-view">Voir le produit <span aria-hidden="true">↗</span></span>
          </a>
          <button class="favorite-toggle" type="button" data-favorite-toggle="${produit.id}" data-product-name="${produit.nom}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" /></svg>
          </button>
          <div class="product-info">
            <span class="product-category">${produit.categorie}</span>
            <h3><a href="produit.html?id=${produit.id}">${produit.nom}</a></h3>
            <div class="product-bottom">
              <span class="price">${produit.prix.toLocaleString("fr-FR")} FCFA</span>
            </div>
          </div>
        </article>
      `,
    )
    .join("");

  ShopZenFavoris.actualiser();
}

document.addEventListener("shopzen:favoriteschange", afficherFavoris);
afficherFavoris();
