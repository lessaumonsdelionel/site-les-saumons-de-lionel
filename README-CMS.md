# Site « Les Saumons de Lionel » — 11ty + Sveltia CMS

Templatisation du site statique `../site/` (rendu **strictement identique**, prouvé par
diff binaire) avec externalisation du contenu éditorial et back-office Sveltia CMS.

## Commandes

```bash
npm install            # une seule fois
npx @11ty/eleventy     # build → _site/
npx @11ty/eleventy --serve   # build + serveur local (port 8080)
```

## Architecture

```
src/
├─ _includes/        base.njk (layout : <head> SEO, header, nav, footer, scripts)
│                    header.njk · footer.njk · footer-simple.njk (pages légales)
│                    prose.njk (layout des pages Markdown : légales)
├─ _data/            LE CONTENU ÉDITABLE (JSON) :
│  ├─ site.json      marque, coordonnées, image OG, favicon (global)
│  ├─ accueil.json   hero, manifesto, cartes produits, process, bloc CSE, SEO
│  ├─ produits.json  les fiches produits de « La sélection » (liste extensible)
│  ├─ selection.json habillage de la page sélection (hero, note froid, SEO)
│  ├─ histoire.json  récit, timeline, citation, SEO
│  ├─ cse.json       page Espace CSE complète, SEO
│  └─ commande.json  habillage de la page commande (hero, SEO)
├─ index.njk … commande.njk   les 7 pages (structure HTML, lisent _data/)
├─ mentions.md · confidentialite.md   pages légales (corps Markdown éditable)
├─ css/ js/ assets/  RECOPIÉS TELS QUELS (design system intouché)
├─ widget.html       RECOPIÉ TEL QUEL (application autonome — ne pas templatiser)
└─ admin/            Sveltia CMS (index.html + config.yml)
```

**Règles à respecter :**
- `css/`, `js/`, `assets/`, `widget.html` sont en *passthrough* : toute retouche design
  se fait dans ces fichiers, jamais dans les templates.
- Le widget de commande reste une application autonome chargée en iframe par
  `commande.njk`. Sa logique (codes partenaires, prix, webhooks Make) vit dans
  Airtable/Make, pas dans ce dépôt.
- Aucun secret (token, URL de webhook) ne doit être committé.

## Fidélité au site d'origine (preuve)

- Les 5 pages `.njk` produisent un HTML **identique octet par octet** à `../site/*.html`.
- Les 2 pages légales (Markdown) produisent un DOM identique (diff normalisé = 0),
  seule l'indentation interne du HTML diffère.
- Vérification : `node compare` — voir scripts de recette dans les notes projet, ou
  refaire un hash SHA-256 des fichiers `_site/*.html` vs `../site/*.html`.

## CMS (Sveltia)

- Back-office : `https://LE-SITE/admin/` (ou `http://localhost:8080/admin/` en local).
- En local (Chrome/Edge) : bouton **« Work with local repository »** → sélectionner le
  dossier du projet ; les modifications s'écrivent directement dans `src/`.
  Relancer `npx @11ty/eleventy` pour voir le résultat.
- En production : backend GitHub (voir prérequis ci-dessous) ; chaque enregistrement
  fait un commit, Netlify rebuilde automatiquement (~1 minute).
- Guide utilisatrice non technique : `GUIDE-RITA.md`.

## ⚠️ Prérequis de mise en production (à faire par Baptiste)

Rien de tout cela n'est inventé ni committé — à créer puis renseigner :

1. **Compte GitHub au nom de Rita** (ou organisation à son nom).
2. **Dépôt GitHub** (privé possible) contenant ce dossier `saumon-cse-11ty/` à la racine.
   Puis remplacer `repo: COMPTE-GITHUB-RITA/site-les-saumons-de-lionel` dans
   `src/admin/config.yml`.
3. **Compte Netlify au nom de Rita**, site relié au dépôt. `netlify.toml` est déjà prêt
   (build `npm install && npx @11ty/eleventy`, publication `_site`).
4. **Authentification GitHub du CMS** : dans GitHub → Settings → Developer settings →
   **OAuth App** (Homepage = URL du site ; callback = `https://api.netlify.com/auth/done`),
   puis dans Netlify → Site configuration → **OAuth** → installer le provider GitHub avec
   le Client ID / Secret de l'OAuth App. (Méthode standard Decap/Sveltia via Netlify.)
5. **Domaine** : rattacher le domaine choisi au site Netlify (DNS chez le registrar).
6. Après mise en ligne : compléter les mentions légales (SIREN/SIRET, hébergeur = Netlify)
   depuis le CMS — les emplacements sont balisés « À compléter ».

## Ce que ce dépôt ne couvre PAS (autres phases)

Branchement réel Airtable/Make du widget (webhooks + token), paiement en ligne,
reporting, multilingue — voir `../AGENTS.md` §3.
