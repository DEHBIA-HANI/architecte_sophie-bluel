const baseApiUrl = "http://localhost:5678/api/";

document.addEventListener("submit", (e) => {
  e.preventDefault();
  let form = {
    email: document.getElementById("email"),
    password: document.getElementById("password"),
  };
  // Envoi des identifiants au serveur pour vérification
  fetch(`${baseApiUrl}users/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: form.email.value,
      password: form.password.value,
    }),
  }).then((response) => {
    if (response.status !== 200) {
      alert("Email ou mot de passe erronés");
    } else {
      response
        .json()
        .then((data) => {
          // Stockage du token et redirection
          sessionStorage.setItem("token", data.token);
          window.location.replace("index.html");
        })
        .catch((error) => {
          console.error(
            "Identifiant(s) incorrect(s) ou problème de connexion.",
            error
          );
        });
    }
  });
});
