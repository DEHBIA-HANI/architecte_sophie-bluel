// Tous les fonctions d'accessibilité pour les deux modales en même temps*/
window.onload = () => {
  // On récupère les bouttons d'ouverture de modale
  const btnOuvertureModal = document.querySelectorAll("[data-toggle=modal]");

  for (let button of btnOuvertureModal) {
    button.addEventListener("click", function (e) {
      //on empêche la navigation
      e.preventDefault();

      //On recupère la data-target(celle quand click dessus)
      const target = this.dataset.target;
      console.log(target);

      //On recupère la  bonne modale celle quand on clique dessus
      let modal = document.querySelector(target);

      //On recupère les elements sur notre dom
      const modale1 = document.getElementById("modale1");
      const modale2 = document.getElementById("modale2");
      const modaleGlobale = document.querySelector(".modale");

      // la fonction de fermeture de modale
      const closeModal = function () {
        modaleGlobale.style.display = "none";
      };

      modaleGlobale.style.display = "flex";
      if (modal === modale1) {
        modale2.style.display = "none";
        modale1.style.display = "block";
      }
      if (modal === modale2) {
        modale2.style.display = "block";
        modale1.style.display = "none";
      }

      // On recupère les bouttons de fermeture
      const modaleClose = document.querySelectorAll("[data-dismiss=dialog");
      for (let close of modaleClose) {
        close.addEventListener("click", () => {
          closeModal();
        });
      }
      //On recupère le bouton de retour en arrière
      const retourEnArriere = document.getElementById("retourEnArriere");
      retourEnArriere.addEventListener("click", () => {
        modale1.style.display = "block";
        modale2.style.display = "none";
      });

      //on gère la fermeture lors du clic sur la zone grise
      modaleGlobale.addEventListener("click", function () {
        closeModal();
      });
      //On évite la propagation du clic d'un enfant à son parent
      for (let i = 0; i < modaleGlobale.children.length; i++) {
        modaleGlobale.children[i].addEventListener("click", function (e) {
          e.stopPropagation();
        });
      }

      window.addEventListener("keydown", function (e) {
        //-1-On clic sur la touche "echap" du clavier pour fermer la modale
        if (e.key === "Escape" || e.key === "Esc") {
          closeModal(e);
        }
      });
    });
  }
};
//Pour la suppression et ajout des travaux c'est dans le fichier index.js
