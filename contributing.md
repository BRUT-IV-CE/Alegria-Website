# Guide de contribution - ALEGRIA Paris

Merci de contribuer au projet ALEGRIA Paris ! Ce guide vous aidera à maintenir la qualité et la cohérence du code.

## 🔄 Workflow Git

### Branches

```bash
main              # Production (protégée)
├── develop       # Développement principal
├── feature/*     # Nouvelles fonctionnalités
├── fix/*         # Corrections de bugs
└── hotfix/*      # Corrections urgentes en production
```

### Créer une nouvelle branche

```bash
# Feature
git checkout develop
git pull origin develop
git checkout -b feature/nom-de-la-feature

# Fix
git checkout -b fix/description-du-bug
```

### Commits

Format des messages de commit (Convention Conventional Commits):

```
type(scope): description courte

[corps optionnel]

[footer optionnel]
```

**Types:**
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage, point-virgules manquants, etc.
- `refactor`: Refactorisation du code
- `perf`: Amélioration des performances
- `test`: Ajout ou modification de tests
- `chore`: Modifications des outils, config, etc.

**Exemples:**

```bash
git commit -m "feat(hero): add stars animation"
git commit -m "fix(nav): correct mobile menu z-index"
git commit -m "docs(readme): update installation steps"
git commit -m "style(collections): improve card hover effect"
```

### Pull Requests

1. **Créer une PR depuis votre branche vers `develop`**
2. **Titre clair:** `[TYPE] Description courte`
3. **Description complète:**
   ```markdown
   ## Changements
   - Liste des modifications
   
   ## Tests effectués
   - [ ] Chrome
   - [ ] Firefox
   - [ ] Safari
   - [ ] Mobile
   
   ## Screenshots
   [Si applicable]
   
   ## Notes
   Informations supplémentaires
   ```
4. **Demander une review** à au moins 1 membre de l'équipe
5. **Merger** seulement après approbation

## 📝 Standards de code

### HTML

```html
<!-- ✅ BON -->
<section class="hero">
    <div class="hero__content">
        <h1 class="hero__title">Titre</h1>
    </div>
</section>

<!-- ❌ MAUVAIS -->
<div class="hero">
    <div class="content">
        <h1>Titre</h1>
    </div>
</div>
```

**Règles:**
- Indentation: 4 espaces
- Toujours fermer les balises
- Utiliser des balises sémantiques
- Ajouter les attributs `alt` aux images
- Utiliser des `aria-label` pour l'accessibilité

### CSS/SCSS

```css
/* ✅ BON - Méthodologie BEM */
.collection-card {
    position: relative;
}

.collection-card__image {
    width: 100%;
}

.collection-card--featured {
    border: 2px solid var(--color-primary);
}

/* ❌ MAUVAIS */
.card {
    position: relative;
}

.card .image {
    width: 100%;
}
```

**Règles:**
- Utiliser les variables CSS
- Mobile-first (media queries min-width)
- BEM pour les noms de classes
- Commenter les sections importantes
- Éviter les `!important`

### JavaScript

```javascript
// ✅ BON
const initNavigation = () => {
    const nav = document.getElementById('mainNav');
    
    // Logic here
};

// ❌ MAUVAIS
function init() {
    var n = document.getElementById('mainNav');
    // Logic here
}
```

**Règles:**
- ES6+ (const/let, arrow functions)
- Noms de variables descriptifs
- Commenter les fonctions complexes
- Éviter les variables globales
- Gérer les erreurs (try/catch)

## 🎨 Design System

### Couleurs

```css
/* Toujours utiliser les variables */
color: var(--color-primary);    /* ✅ */
color: #190042;                  /* ❌ */
```

### Espacements

```css
/* Utiliser les variables d'espacement */
padding: var(--spacing-md);     /* ✅ */
padding: 32px;                   /* ❌ */
```

### Typographie

```css
/* Utiliser les variables de fonts */
font-family: var(--font-display);  /* ✅ */
font-family: 'Cinzel', serif;      /* ❌ */
```

## 🧪 Tests

### Checklist avant de commit

- [ ] Le code fonctionne localement
- [ ] Testé sur Chrome, Firefox, Safari
- [ ] Testé sur mobile (responsive)
- [ ] Pas de console.log() en debug
- [ ] Code formaté et indenté
- [ ] Variables CSS utilisées
- [ ] Commentaires ajoutés si nécessaire
- [ ] Pas d'erreurs dans la console

### Tests de régression

Avant chaque PR, tester:
1. Navigation (desktop et mobile)
2. Tous les liens
3. Formulaires
4. Animations
5. Scroll fluide

## 📦 Gestion des assets

### Images

```
assets/
├── images/
│   ├── hero/           # Images du hero
│   ├── collections/    # Photos de collections
│   ├── about/          # Images "à propos"
│   └── blog/           # Images du blog
├── logos/
│   ├── Logo_blanc_sur_fond_violet.png
│   ├── Logo_ALEGRIA_violet_sur_fond_blanc.png
│   └── ...
└── icons/
    ├── social/         # Icônes réseaux sociaux
    └── ui/             # Icônes interface
```

### Optimisation images

```bash
# Avant de commit, optimiser les images
# Utiliser ImageOptim, TinyPNG, ou Squoosh

# Formats recommandés:
# - Photos: WebP (fallback JPG)
# - Logos: SVG
# - Icons: SVG
```

## 🚀 Déploiement

### Environnements

1. **Local**: Développement
2. **Staging**: Tests (`develop` branch)
3. **Production**: Site live (`main` branch)

### Processus de déploiement

```bash
# 1. Merge develop -> main
git checkout main
git pull origin main
git merge develop

# 2. Tag la version
git tag -a v1.0.0 -m "Version 1.0.0 - Page d'accueil"
git push origin v1.0.0

# 3. Déployer (selon hébergeur)
# Netlify, Vercel, ou autre
```

## 🐛 Signaler un bug

### Template d'issue

```markdown
## Description
[Description claire du bug]

## Étapes pour reproduire
1. Aller sur...
2. Cliquer sur...
3. Observer...

## Comportement attendu
[Ce qui devrait se passer]

## Comportement actuel
[Ce qui se passe réellement]

## Screenshots
[Si applicable]

## Environnement
- Navigateur: Chrome 120
- OS: macOS Sonoma
- Device: MacBook Pro / iPhone 15

## Informations supplémentaires
[Notes additionnelles]
```

## ✨ Proposer une feature

### Template de feature request

```markdown
## Feature proposée
[Description de la fonctionnalité]

## Motivation
[Pourquoi cette feature est importante]

## Solution proposée
[Comment implémenter cette feature]

## Alternatives considérées
[Autres approches possibles]

## Ressources nécessaires
- [ ] Design
- [ ] Développement frontend
- [ ] Développement backend
- [ ] Tests

## Priorité
- [ ] Critique
- [ ] Haute
- [ ] Moyenne
- [ ] Basse
```

## 📞 Communication

### Channels

- **GitHub Issues**: Bugs et features
- **Pull Requests**: Code reviews
- **[Slack/Discord]**: Communication quotidienne
- **Email**: Communication formelle avec le client

### Code reviews

**En tant que reviewer:**
- Soyez constructif et respectueux
- Proposez des solutions, pas seulement des critiques
- Testez le code localement si possible
- Approuvez si tout est OK

**En tant qu'auteur:**
- Répondez aux commentaires
- Faites les modifications demandées
- Remerciez pour les retours

## 🎯 Bonnes pratiques

### Performance

- Optimiser les images
- Minifier CSS/JS en production
- Lazy loading des images
- Utiliser le cache navigateur

### Accessibilité

- Balises sémantiques
- Attributs ARIA
- Contraste des couleurs (WCAG AA)
- Navigation au clavier

### SEO

- Meta tags appropriés
- Structured data (JSON-LD)
- Sitemap.xml
- robots.txt

### Sécurité

- Valider les inputs
- Échapper les outputs
- HTTPS uniquement
- CSP headers

## 📚 Ressources

### Documentation

- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS-Tricks](https://css-tricks.com/)
- [Can I Use](https://caniuse.com/)
- [BEM Methodology](http://getbem.com/)

### Outils

- [Figma](https://figma.com) - Design
- [VS Code](https://code.visualstudio.com/) - Editor
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

**Merci de contribuer au projet ALEGRIA Paris !** ✨

Pour toute question, contactez le lead développeur.