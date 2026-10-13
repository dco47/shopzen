const grilleProduits = document.querySelector("#product-grid");
const champRecherche = document.querySelector("#site-search");
const filtresCategorie = document.querySelectorAll('input[name="categorie"]');
const filtrePrix = document.querySelector("#price-filter");
const prixAffiche = document.querySelector("#price-output");
const messageAucunProduit = document.querySelector("#no-products");
const nombreResultats = document.querySelector("#results-count");
const boutonEffacer = document.querySelector("#clear-filters");
const compteurPanier = document.querySelector("#cart-count-header");
const notificationPanier = document.querySelector("#cart-feedback");
const afficherAjoutRapide = Boolean(grilleProduits);

function lirePanier() {
  try {
    const panierSauvegarde = JSON.parse(localStorage.getItem("panier")) || [];
    return Array.isArray(panierSauvegarde) ? panierSauvegarde : [];
  } catch {
    return [];
  }
}

function actualiserCompteurPanier() {
  if (!compteurPanier) {
    return;
  }

  const quantite = lirePanier().reduce((total, article) => {
    return total + (Number(article.quantite) || 0);
  }, 0);

  compteurPanier.textContent = quantite;
  compteurPanier.setAttribute(
    "aria-label",
    `${quantite} article${quantite === 1 ? "" : "s"} au panier`,
  );
}

let minuterieNotification;
actualiserCompteurPanier();

if (grilleProduits) {
  const parametres = new URLSearchParams(window.location.search);

  if (champRecherche) {
    champRecherche.value = parametres.get("recherche") || "";
  }

  function afficherProduits() {
    const recherche = champRecherche
      ? champRecherche.value.trim().toLocaleLowerCase("fr")
      : "";
    const categoriesChoisies = Array.from(filtresCategorie)
      .filter((filtre) => filtre.checked)
      .map((filtre) => filtre.value);
    const prixMaximum = filtrePrix ? Number(filtrePrix.value) : Infinity;

    if (prixAffiche && filtrePrix) {
      prixAffiche.textContent = `${prixMaximum.toLocaleString("fr-FR")} FCFA`;
    }

    const produitsFiltres = produits.filter((produit) => {
      const nomCorrespond = produit.nom
        .toLocaleLowerCase("fr")
        .includes(recherche);
      const categorieCorrespond =
        categoriesChoisies.length === 0 ||
        categoriesChoisies.includes(produit.categorie);
      return (
        nomCorrespond && categorieCorrespond && produit.prix <= prixMaximum
      );
    });

    grilleProduits.innerHTML = produitsFiltres
      .map(
        (produit) => `
          <article class="product-card">
            <a class="product-image" href="produit.html?id=${produit.id}" aria-label="Découvrir ${produit.nom}">
              <img src="${produit.image}" alt="${produit.nom}">
              <span class="quick-view">Voir le produit <span aria-hidden="true">↗</span></span>
            </a>
            <div class="product-info">
              <span class="product-category">${produit.categorie}</span>
              <h3><a href="produit.html?id=${produit.id}">${produit.nom}</a></h3>
              <div class="product-bottom">
                <span class="price">${produit.prix.toLocaleString("fr-FR")} FCFA</span>
                ${
                  afficherAjoutRapide
                    ? `<button class="quick-add" type="button" data-add-to-cart="${produit.id}" aria-label="Ajouter ${produit.nom} au panier" title="Ajouter au panier">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M3.5 4h2l2.1 11.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.5L21 8H6.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                          <circle cx="10" cy="20" r="1.2" fill="currentColor" />
                          <circle cx="18" cy="20" r="1.2" fill="currentColor" />
                        </svg>
                      </button>`
                    : ""
                }
              </div>
            </div>
          </article>
        `,
      )
      .join("");

    if (messageAucunProduit) {
      messageAucunProduit.hidden = produitsFiltres.length > 0;
    }

    if (nombreResultats) {
      nombreResultats.textContent = `${produitsFiltres.length} produit${produitsFiltres.length > 1 ? "s" : ""}`;
    }
  }

  if (champRecherche) {
    champRecherche.addEventListener("input", afficherProduits);
  }

  filtresCategorie.forEach((filtre) => {
    filtre.addEventListener("change", afficherProduits);
  });

  if (filtrePrix) {
    filtrePrix.addEventListener("input", afficherProduits);
  }

  if (boutonEffacer) {
    boutonEffacer.addEventListener("click", () => {
      if (champRecherche) {
        champRecherche.value = "";
      }
      filtresCategorie.forEach((filtre) => {
        filtre.checked = false;
      });
      if (filtrePrix) {
        filtrePrix.value = filtrePrix.max;
      }
      afficherProduits();
    });
  }

  if (afficherAjoutRapide) {
    grilleProduits.addEventListener("click", (event) => {
      const boutonAjout = event.target.closest("button[data-add-to-cart]");

      if (!boutonAjout) {
        return;
      }

      const produit = produits.find(
        (article) => article.id === Number(boutonAjout.dataset.addToCart),
      );

      if (!produit) {
        return;
      }

      const panier = lirePanier();
      const articleExistant = panier.find(
        (article) => article.id === produit.id,
      );

      if (articleExistant) {
        articleExistant.quantite++;
      } else {
        panier.push({ id: produit.id, quantite: 1 });
      }

      localStorage.setItem("panier", JSON.stringify(panier));
      actualiserCompteurPanier();

      if (notificationPanier) {
        notificationPanier.textContent = `${produit.nom} ajouté au panier.`;
        notificationPanier.classList.add("is-visible");
        clearTimeout(minuterieNotification);
        minuterieNotification = setTimeout(() => {
          notificationPanier.classList.remove("is-visible");
        }, 3000);
      }
    });
  }

  afficherProduits();
}
