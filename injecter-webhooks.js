/* =====================================================================
   Injection des webhooks Make dans le widget APRÈS le build Eleventy.
   ---------------------------------------------------------------------
   Le dépôt ne contient JAMAIS les URLs réelles ni le token (CLAUDE.md §7) :
   elles sont fournies par variables d'environnement (Netlify → Site
   configuration → Environment variables, ou en local avant le build) :

     WEBHOOK_LECTURE   = https://hook.eu2.make.com/…   (scénario A)
     WEBHOOK_ECRITURE  = https://hook.eu2.make.com/…   (scénario B)
     WIDGET_TOKEN      = secret partagé anti-spam

   Sans ces variables, le widget reste en SIMULATION LOCALE (démo).
   Usage : node injecter-webhooks.js   (après `npx @11ty/eleventy`)
   ===================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");

const FICHIER = path.join(__dirname, "_site", "widget.html");
const lecture = process.env.WEBHOOK_LECTURE || "";
const ecriture = process.env.WEBHOOK_ECRITURE || "";
const token = process.env.WIDGET_TOKEN || "";

if (!lecture || !ecriture || !token) {
  console.log("injecter-webhooks : variables absentes → widget laissé en simulation locale.");
  process.exit(0);
}

let html = fs.readFileSync(FICHIER, "utf8");
const avant = html;
html = html.replace('var WEBHOOK_LECTURE = "";', 'var WEBHOOK_LECTURE = "' + lecture + '";');
html = html.replace('var WEBHOOK_ECRITURE = "";', 'var WEBHOOK_ECRITURE = "' + ecriture + '";');
html = html.replace('var WIDGET_TOKEN = "SIMULATION-LOCALE";', 'var WIDGET_TOKEN = "' + token + '";');

if (html === avant) {
  console.error("injecter-webhooks : AUCUN remplacement effectué — constantes introuvables dans _site/widget.html.");
  process.exit(1);
}
fs.writeFileSync(FICHIER, html, "utf8");
console.log("injecter-webhooks : widget branché sur Make (lecture + écriture + token).");
