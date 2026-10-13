const listeProduits = document.querySelector("#liste-produits");

fetch("https://fakestoreapi.com/products")
  .then((reponse) => reponse.json())
  .then((produits) => {
    produits.forEach((produit) => {
      listeProduits.innerHTML += `
        <article>
          <h2>${produit.title}</h2>
          <p>Prix : ${produit.price} $</p>
          <img src="${produit.image}" alt="${produit.title}" width="100">
        </article>
      `;
    });
  });
