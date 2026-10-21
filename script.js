(function () {
  "use strict";

  /* ------------------------------------------------------------------
     ⚠️ À CONFIGURER AVANT LA MISE EN LIGNE
     Adresse qui reçoit les messages du formulaire de contact.
     ------------------------------------------------------------------ */
  var EMAIL_CONTACT = "mspsomainetenvirons@gmail.com";

  var an = document.getElementById("annee");
  if (an) { an.textContent = String(new Date().getFullYear()); }

  /* --- Menu mobile --- */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav-liens");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var ouvert = nav.classList.toggle("ouvert");
      burger.setAttribute("aria-expanded", ouvert ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("ouvert");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* --- Recherche et filtre des praticiens --- */
  var filtres = Array.prototype.slice.call(document.querySelectorAll(".filtre"));
  var fiches = Array.prototype.slice.call(document.querySelectorAll(".praticien"));
  var champRech = document.getElementById("rech");
  var retourFiltre = document.getElementById("resultat-filtre");
  var aucun = document.getElementById("aucun-resultat");
  var catActive = "tous";

  function sansAccent(t) {
    return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function appliquer() {
    var q = sansAccent(champRech ? champRech.value.trim() : "");
    var visibles = 0;

    fiches.forEach(function (f) {
      var okCat = (catActive === "tous" || f.getAttribute("data-cat") === catActive);
      var okQ = (q === "" || sansAccent(f.getAttribute("data-rech") || "").indexOf(q) !== -1);
      var ok = okCat && okQ;
      f.classList.toggle("masque", !ok);
      if (ok) { visibles++; }
    });

    if (aucun) { aucun.hidden = (visibles !== 0); }
    if (retourFiltre) {
      retourFiltre.textContent = (catActive === "tous" && q === "")
        ? ""
        : visibles + (visibles > 1 ? " praticiens affichés." : " praticien affiché.");
    }
  }

  filtres.forEach(function (btn) {
    btn.addEventListener("click", function () {
      catActive = btn.getAttribute("data-cat");
      filtres.forEach(function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
      appliquer();
    });
  });

  if (champRech) { champRech.addEventListener("input", appliquer); }

  /* --- Formulaire de contact (ouvre le logiciel de messagerie) --- */
  var form = document.getElementById("form-contact");
  var retour = document.getElementById("form-retour");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nom = form.nom.value.trim();
      var mail = form.mail.value.trim();
      var tel = form.tel.value.trim();
      var msg = form.message.value.trim();

      if (!nom || !mail || !msg) {
        retour.textContent = "Merci de renseigner votre nom, votre email et votre message.";
        return;
      }
      if (!EMAIL_CONTACT) {
        retour.textContent = "Le formulaire n'est pas encore relié à une adresse email. Contactez la MSP par téléphone en attendant.";
        return;
      }

      var corps = "Nom : " + nom + "\n"
                + "Email : " + mail + "\n"
                + "Téléphone : " + (tel || "non renseigné") + "\n\n"
                + msg;

      window.location.href = "mailto:" + EMAIL_CONTACT
        + "?subject=" + encodeURIComponent("Message depuis le site — " + nom)
        + "&body=" + encodeURIComponent(corps);

      retour.textContent = "Votre logiciel de messagerie va s'ouvrir avec le message pré-rempli.";
    });
  }

  document.querySelectorAll("[data-todo]").forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); });
  });
})();
