(() => {
  const compteur = document.querySelector("#cart-count-header");

  if (!compteur) {
    return;
  }

  function actualiserCompteur() {
    let panier = [];

    try {
      const sauvegarde = JSON.parse(localStorage.getItem("panier")) || [];
      panier = Array.isArray(sauvegarde) ? sauvegarde : [];
    } catch {
      panier = [];
    }

    const quantite = panier.reduce(
      (total, article) => total + (Number(article.quantite) || 0),
      0,
    );

    compteur.textContent = quantite;
    compteur.setAttribute(
      "aria-label",
      `${quantite} article${quantite === 1 ? "" : "s"} au panier`,
    );
  }

  document.addEventListener("shopzen:cartchange", actualiserCompteur);
  window.addEventListener("storage", (event) => {
    if (event.key === "panier") {
      actualiserCompteur();
    }
  });

  actualiserCompteur();
})();
