/* Configuration Eleventy : Les Saumons de Lionel.
   Principe : le design system (css/js/assets) et le widget de commande sont
   recopiés TELS QUELS (passthrough). Seules les 7 pages sont templatisées. */
module.exports = function (eleventyConfig) {
  /* Copies à l'identique, ne jamais templatiser ces fichiers. */
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/widget.html");
  eleventyConfig.addPassthroughCopy("src/admin");

  /* Le widget et le back-office ne doivent PAS être traités comme des
     templates : on les ignore du moteur (la copie passthrough suffit). */
  eleventyConfig.ignores.add("src/widget.html");
  eleventyConfig.ignores.add("src/admin/**");
  /* Ancienne sortie de build égarée dans src/ le 16/09 : publiée par erreur sous /_site/. */
  eleventyConfig.ignores.add("src/_site/**");

  /* Prix à la française : 98.9 donne « 98,90 € », 77 donne « 77 € ».
     Accepte aussi une saisie texte du back-office (« 98,9 »). */
  const nombre = (v) => typeof v === "number" ? v : parseFloat(String(v || "").replace(/\s/g, "").replace(",", "."));
  eleventyConfig.addFilter("prixFr", (v) => {
    const n = Math.round(nombre(v) * 100) / 100;
    if (!isFinite(n)) return "";
    return (Number.isInteger(n) ? String(n) : n.toFixed(2).replace(".", ",")) + " €";
  });
  /* Écart entre deux prix, arrondi au centime, et remise en pourcentage entier. */
  eleventyConfig.addFilter("ecartPrix", (barre, remise) => Math.round((nombre(barre) - nombre(remise)) * 100) / 100);
  eleventyConfig.addFilter("remisePct", (barre, remise) => Math.round((1 - nombre(remise) / nombre(barre)) * 100));

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    /* Les fichiers .md passent d'abord par Nunjucks (permet d'y utiliser
       les données globales), puis par Markdown. */
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
