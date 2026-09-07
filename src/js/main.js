/* Les Saumons de Lionel : interactions.
   Animations activées UNIQUEMENT sur desktop (861px et plus) et si l'utilisateur
   n'a pas demandé de réduire les animations. Mobile = statique, instantané.
   Volontairement sobre : fondu et montée discrète, rien d'autre. */
(function () {
  "use strict";

  var motionOK =
    window.matchMedia("(min-width: 861px)").matches &&
    window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

  if (motionOK) document.documentElement.classList.add("anim");

  /* ---------- Header : état plein au scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("solid", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menu mobile ---------- */
  var burger = document.querySelector(".burger");
  if (burger) {
    burger.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".mobile-menu a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
      });
    });
  }

  /* ---------- Année courante (footer) ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Formulaire de contact ---------- */
  var form = document.getElementById("formulaire");
  if (form) {
    var params = new URLSearchParams(window.location.search);
    var merci = document.querySelector(".form-merci");

    function cocherProfil(valeur) {
      var r = form.querySelector('input[name="profil"][value="' + valeur + '"]');
      if (r) r.checked = true;
    }
    /* Pré-sélection du profil depuis l'adresse : ?profil=cse | particulier | code */
    var profil = params.get("profil");
    if (profil === "cse") cocherProfil("Responsable CSE ou entreprise");
    if (profil === "particulier") cocherProfil("Particulier");
    if (profil === "code") cocherProfil("Salarié avec un code CSE");
    /* Liens internes qui pré-remplissent le profil (bouton « Commander hors CSE ») */
    document.querySelectorAll("[data-profil]").forEach(function (a) {
      a.addEventListener("click", function () { cocherProfil(a.getAttribute("data-profil")); });
    });
    /* Retour après envoi (Netlify redirige vers ?envoye=1) */
    if (params.get("envoye") === "1" && merci) {
      merci.hidden = false;
      merci.focus();
    }
  }

  if (!motionOK) return; /* tout ce qui suit est desktop uniquement */

  /* ---------- Révélations au scroll ---------- */
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
  );
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
})();
