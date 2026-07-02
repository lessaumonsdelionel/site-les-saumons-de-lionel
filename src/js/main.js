/* Les Saumons de Lionel — interactions.
   Animations activées UNIQUEMENT sur desktop (≥861px) et si l'utilisateur
   n'a pas demandé de réduire les animations. Mobile = statique, instantané. */
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

  if (!motionOK) return; /* ↓ tout ce qui suit est desktop uniquement */

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

  /* ---------- Parallaxe douce du hero ---------- */
  var bg = document.querySelector(".hero .bg");
  if (bg) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          bg.style.transform = "translateY(" + y * 0.18 + "px)";
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- Compteurs (réassurance) ---------- */
  var ioN = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        ioN.unobserve(e.target);
        var el = e.target,
          target = parseFloat(el.getAttribute("data-count")),
          suffix = el.getAttribute("data-suffix") || "",
          dur = 1400,
          t0 = null;
        function tick(t) {
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / dur, 1);
          p = 1 - Math.pow(1 - p, 3); /* easeOutCubic */
          el.firstChild.nodeValue = Math.round(target * p);
          if (p < 1) requestAnimationFrame(tick);
          else el.firstChild.nodeValue = target;
          void suffix;
        }
        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll("[data-count]").forEach(function (el) { ioN.observe(el); });
})();
