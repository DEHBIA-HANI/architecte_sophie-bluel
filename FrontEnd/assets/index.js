/****************************************************** */
//Chargement initial des données des travaux
/****************************************************** */

async function workFetch() {
  await fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((works) => {
      workData = works;
      console.log(workData);
    })
    .catch((error) =>
      console.error("Erreur lors de la récupération des images", error)
    );
  /*appeller la fonction pour afficher tous les travaux*/
  galerieWorks(workData, ".gallery");

  /*appeller la fonction pour afficher tous les travaux par catégorie*/
  fetchCategories(workData);

  //appeller la fonction pour afficher tous les travaux dans notre modale Dellete
  galerieWorks(workData, ".supprime-photo");
  // Appeller la fonction de supression des travaux
  DeleteWork();
}
workFetch();
/*****************************************************************
//       la fonction pour afficher les traveaux de Sophie Bluel
/*************************************************************** */
function galerieWorks(works, selector) {
  const galerie = document.querySelector(selector);
  galerie.innerHTML = "";

  works.forEach((work) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const span = document.createElement("span");
    const poubelle = document.createElement("i");

    poubelle.classList.add("fa-solid", "fa-trash-can");
    poubelle.id = work.id;
    img.src = work.imageUrl;
    img.alt = work.title;
    span.appendChild(poubelle);
    figure.appendChild(span);
    figure.appendChild(img);

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;
    figure.appendChild(figcaption);
    galerie.appendChild(figure);
  });
}

/***************************************************************
 //           Affichage les boutons par filtre 

/**************************************************************** */
function fetchCategories(works) {
  fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((categories) => {
      console.log(categories);
      categorieFilter(categories, works);
    })
    .catch((error) =>
      console.error("Erreur lors de la récupérations des catégories", error)
    );
}

function categorieFilter(categories, works) {
  const filtrer = document.querySelector(".filter");
  filtrer.innerHTML = "";
  filtrer.classList.add("filter");

  const tousButton = document.createElement("button");
  tousButton.textContent = "Tous";
  tousButton.classList.add("btnFilter");
  filtrer.appendChild(tousButton);
  tousButton.onclick = () => {
    galerieWorks(works, ".gallery");
  };
  categories.forEach((categorie) => {
    const button = document.createElement("button");
    button.textContent = categorie.name;
    button.id = categorie.id;
    button.classList.add("btnFilter");
    filtrer.appendChild(button);
    button.onclick = () => {
      const filtrerParCategorie = works.filter(
        (work) => work.categoryId === categorie.id
      );
      galerieWorks(filtrerParCategorie, ".gallery");
    };
  });
}
/*************************************************************
 //      Créer la bar edition ,l'icon et mot modifier 
/********************************************************* */
function barEdition() {
  const modeEdition = document.querySelector(".modeEdition");
  const projetModifier = document.querySelector(".projetModifier");

  modeEdition.innerHTML = `
        <nav class="edition">
           <p><i class="fa-regular fa-pen-to-square"></i>Mode édition</p>
        </nav>
`;
  projetModifier.innerHTML = `
          <h2>Mes Projets</h2>
          <a href="#" data-target="#modale1" data-toggle="modal"><i
          class="fa-regular fa-pen-to-square"></i>modifier</a>
  `;
}
// On affiche la navbar édition si le token est correct
document.addEventListener("DOMContentLoaded", function () {
  if (sessionStorage.getItem("token") != null) {
    barEdition();
    const loginLogout = document.getElementById("logout");
    const filtreLogout = document.getElementById("filter");
    loginLogout.textContent = "logout";
    filtreLogout.style.display = "none";
    loginLogout.addEventListener("click", (event) => {
      event.preventDefault();
      sessionStorage.clear();
      window.location.reload();
    });
  }
});

/****************************************************/
//          Suppression des travaux
/************************************************* */
const modaleGlobale = document.querySelector(".modale");
const closeModal = function () {
  modaleGlobale.style.display = "none";
};
function DeleteWork() {
  const Poubelles = document.querySelectorAll(".supprime-photo .fa-trash-can");
  Poubelles.forEach((poubelle) => {
    poubelle.addEventListener("click", () => {
      const id = poubelle.id;
      console.log(id);
      let token = sessionStorage.getItem("token");
      const init = {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
      };
      // Envoie une requête DELETE pour supprimer le travail avec l'ID spécifié
      fetch("http://localhost:5678/api/works/" + id, init)
        .then((response) => {
          if (!response.ok) {
            console.log("impossible de supprimer !!");
          }
          if (response.ok) {
            alert("Le projet est été supprimé avec succès"); // Actualise la galerie de travaux
            galerieWorks(workData, ".supprime-photo");
            galerieWorks(workData, ".gallery");
            workFetch();
            closeModal();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });
}

/************************************************************* */
//  Ajout des travaux :
//    INDEX: 1- Afficher l'image selectionnée de notre pc
//           2- Créer la liste des catégories pour linput selecte
//           4- Verification du formulaire
//           5- Faire un POST
/**************************************************************** */

document.addEventListener("DOMContentLoaded", () => {
  //  INDEX:1- Afficher l'image selectionnée de notre pc */
  //  Récupérer tous les éléments qui :
  //           seront utilisés dans l'affichage de l'image (input file)
  const inputFile = document.getElementById("avatar");
  const labelFile = document.querySelector(".photoAjouter");
  const iconFile = document.querySelector(".fa-image");
  const pFile = document.querySelector(".photo-size");
  const contenuPhoto = document.querySelector(".photo-file");
  //         seront utiliser dans le formulaire
  const form = document.querySelector("#modale2 form");
  const title = document.getElementById("titre");
  const category = document.getElementById("categorie");
  const errorMessage = document.querySelector(".erreur");

  const btnValidForm = document.getElementById("btn-valider");

  // Afficher l'image dans input file
  function afficherImage() {
    //  l'image qui se trouve sur mon pc
    const image = this.files[0];
    if (image.size < 4 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => {
        const imgUrl = reader.result;
        const img = document.createElement("img");
        img.src = imgUrl;
        contenuPhoto.appendChild(img);
      };
      reader.readAsDataURL(image);

      labelFile.style.opacity = "0";
      iconFile.style.opacity = "0";
      pFile.style.opacity = "0";
    } else {
      alert(
        "Le fichier sélectionné est trop volumineux.La taille maximale est de 4 Mo."
      );
    }
  }

  inputFile.addEventListener("change", afficherImage); //  Ecouter le changement sur inputFile

  // // INDEX: 2- Créer la liste des catégories pour linput selecte
  function chargerCategories() {
    fetch("http://localhost:5678/api/categories")
      .then((response) => response.json())
      .then((data) => {
        const select = document.querySelector("#modale2 #categorie ");
        data.forEach((dataItem) => {
          const option = document.createElement("option");
          option.setAttribute("value", dataItem.id);
          option.textContent = dataItem.name;
          select.appendChild(option);
        });
      })
      .catch((error) =>
        console.error("Erreur lors de la récupérations des catégories", error)
      );
  }
  chargerCategories();

  // // INDEX: 4- Verification du formulaire
  form.addEventListener("input", function () {
    if (title.value !== "" && category.value !== "" && inputFile.value !== "") {
      btnValidForm.disabled = false;
      btnValidForm.classList.add("btnValid");
      errorMessage.textContent = "";
    } else {
      errorMessage.textContent =
        "Veuillez remplir tous les champs du formulaire.";
      btnValidForm.classList.remove("btnValid");
      btnValidForm.disabled = true;
    }
  });

  // INDEX: 5-Ajout travaux avec la méthode POST
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title.value);
    formData.append("category", category.value);
    formData.append("image", inputFile.files[0]);

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          alert("impossible d'ajouter le nouveau projet");
        }
        if (response.ok) {
          alert("Le projet est ajouté avec succès");
          console.log(response);
          workFetch();
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
        galerieWorks(workData, ".gallery");
        galerieWorks(workData, ".supprime-photo");

        form.reset(); // Réinitialiser les champs du formulaire.

        const myPhoto = contenuPhoto.querySelector("img");
        console.log(myPhoto);
        myPhoto.remove();
        labelFile.style.opacity = "100";
        iconFile.style.opacity = "100";
        pFile.style.opacity = "100";
        btnValidForm.classList.remove("btnValid");
        btnValidForm.disabled = true;
        closeModal();
      })
      .catch((error) =>
        console.error("Erreur lors de l'ajout des travaux", error)
      );
  });
});
