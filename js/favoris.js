(() => {
  const cleFavoris = "favoris";

  function lireFavoris() {
    try {
      const favoris = JSON.parse(localStorage.getItem(cleFavoris)) || [];
      return Array.isArray(favoris)
        ? [...new Set(favoris.map(Number).filter(Number.isInteger))]
        : [];
    } catch {
      return [];
    }
  }

  function actualiserCompteur() {
    const compteur = document.querySelector("#favorites-count");

    if (!compteur) {
      return;
    }

    const nombre = lireFavoris().length;
    compteur.textContent = nombre;
    compteur.setAttribute(
      "aria-label",
      `${nombre} produit${nombre === 1 ? "" : "s"} en favoris`,
    );
  }

  function actualiserBoutons() {
    const favoris = lireFavoris();

    document.querySelectorAll("[data-favorite-toggle]").forEach((bouton) => {
      const estFavori = favoris.includes(Number(bouton.dataset.favoriteToggle));
      const nom = bouton.dataset.productName;
      bouton.classList.toggle("is-favorite", estFavori);
      bouton.setAttribute("aria-pressed", String(estFavori));
      bouton.setAttribute(
        "aria-label",
        `${estFavori ? "Retirer" : "Ajouter"} ${nom} ${estFavori ? "des" : "aux"} favoris`,
      );
      bouton.title = estFavori ? "Retirer des favoris" : "Ajouter aux favoris";
      const libelle = bouton.querySelector("span");

      if (libelle) {
        libelle.textContent = bouton.title;
      }
    });

    actualiserCompteur();
  }

  function basculerFavori(idProduit) {
    const favoris = lireFavoris();
    const nouveauxFavoris = favoris.includes(idProduit)
      ? favoris.filter((id) => id !== idProduit)
      : [...favoris, idProduit];

    localStorage.setItem(cleFavoris, JSON.stringify(nouveauxFavoris));
    actualiserBoutons();
    document.dispatchEvent(new CustomEvent("shopzen:favoriteschange"));
  }

  document.addEventListener("click", (event) => {
    const bouton = event.target.closest("[data-favorite-toggle]");

    if (bouton) {
      basculerFavori(Number(bouton.dataset.favoriteToggle));
    }
  });

  window.addEventListener("storage", (event) => {
    if (event.key === cleFavoris) {
      actualiserBoutons();
      document.dispatchEvent(new CustomEvent("shopzen:favoriteschange"));
    }
  });

  window.ShopZenFavoris = {
    lire: lireFavoris,
    actualiser: actualiserBoutons,
  };

  actualiserBoutons();
})();
