# ALEGRIA Paris - Site Vitrine

Site vitrine premium pour ALEGRIA Paris, joaillerie spécialisée dans les diamants de synthèse.

## 📋 Vue d'ensemble du projet

**Client:** ALEGRIA Paris  
**Budget:** 2 500 €  
**Équipe:** 3 développeurs  
**Stack:** HTML5, CSS3 (SCSS), JavaScript vanilla  

## 🎨 Identité de marque

### Couleurs
- **Violet foncé (Primary):** `#190042`
- **Lavande (Secondary):** `#E0D0FA`
- **Accent:** `#F6DDF0`
- **Noir/Blanc:** `#000000` / `#FFFFFF`

### Typographie
- **Titres:** Cinzel (serif) - élégant et luxueux
- **Corps de texte:** Montserrat Light (sans-serif) - moderne et lisible

### Thèmes visuels
- ✦ Étoiles et cosmos
- ✦ Diamants et lumière
- ✦ Innovation et futurisme
- ✦ Élégance et raffinement

## 📁 Structure du projet

```
alegria-paris/
├── index.html              # Page d'accueil
├── styles.css              # Styles principaux
├── script.js               # Animations et interactions
├── assets/
│   ├── images/            # Images et photos de bijoux
│   ├── logos/             # Logos ALEGRIA
│   └── icons/             # Icônes SVG
├── pages/
│   ├── collections.html   # Page des collections
│   ├── create.html        # Configurateur de bijoux
│   ├── universe.html      # L'univers ALEGRIA
│   └── contact.html       # Page de contact
└── README.md
```

## 🚀 Fonctionnalités implémentées (Page d'accueil)

### ✅ Navigation
- Navigation fixe avec effet de disparition au scroll
- Menu hamburger responsive
- Liens de navigation fluides

### ✅ Hero Section
- Animation d'étoiles dynamique (200 étoiles)
- Effet de parallaxe au scroll
- Animations de texte au chargement
- Call-to-actions vers collections et configurateur

### ✅ Section Introduction
- Présentation de la marque
- Animation de diamant 3D
- Statistiques animées (100% éthique, Type IIa, possibilités infinies)

### ✅ Section Collections
- Grid de 3 collections principales
- Effets de hover sophistiqués
- Overlay avec CTA

### ✅ Section Création
- Explication du processus en 3 étapes
- Animation de bague rotative
- Fond violet foncé pour contraste

### ✅ Section Valeurs
- 3 piliers: Innovation, Espoir, Futurisme
- Cards avec effets de hover
- Icônes SVG personnalisées

### ✅ Newsletter
- Formulaire d'inscription
- Validation d'email
- Design épuré

### ✅ Footer
- Navigation complète du site
- Réseaux sociaux (Instagram, Facebook, Pinterest)
- Design cohérent avec la charte

## 🎯 Pages à développer

### 1. Bijoux / Collections
- [ ] Page collections (liste toutes les collections)
- [ ] Pages individuelles par collection
- [ ] Galerie photos avec filtres
- [ ] Lien vers boutique SumUp

### 2. Configurateur "Créez votre bijou"
- [ ] Interface de sélection (type de bijou)
- [ ] Choix du métal (14k/18k, or jaune/blanc/rose)
- [ ] Sélection des diamants
- [ ] Aperçu visuel en temps réel
- [ ] Envoi par WhatsApp/Email/Tel avec récapitulatif

### 3. Univers ALEGRIA
- [ ] Notre histoire
- [ ] Le diamant de synthèse (page éducative)
- [ ] Nos engagements (éthique, environnement)
- [ ] Espace presse

### 4. On Discute
- [ ] Blog/Journal
- [ ] FAQ interactive
- [ ] Formulaire de contact
- [ ] Carte de localisation (si boutique physique)

## 💻 Installation et développement

### Prérequis
- Navigateur web moderne
- Éditeur de code (VS Code recommandé)
- Git

### Installation

```bash
# Cloner le repository
git clone [URL_DU_REPO]

# Accéder au dossier
cd alegria-paris

# Ouvrir avec live server ou simplement ouvrir index.html
```

### Compilation SCSS (si utilisé)

```bash
# Installer Sass globalement
npm install -g sass

# Compiler SCSS vers CSS
sass --watch styles.scss:styles.css
```

## 🎨 Conventions de code

### HTML
- Indentation: 4 espaces
- Attributs: doubles guillemets
- Sémantique HTML5
- Accessibilité (ARIA labels, alt text)

### CSS
- Méthodologie: BEM pour les classes
- Mobile-first responsive design
- Variables CSS pour les couleurs et espacements
- Commentaires pour chaque section majeure

### JavaScript
- ES6+ moderne
- Commentaires pour chaque fonction
- Éviter jQuery (vanilla JS uniquement)
- Performance optimisée

## 📱 Responsive Design

Breakpoints:
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

## ⚡ Performance

### Optimisations implémentées
- Lazy loading des images
- Animations CSS (hardware accelerated)
- Minification des assets (à faire en prod)
- Service Worker (PWA ready)

### À faire
- [ ] Optimiser les images (WebP, compression)
- [ ] Minifier CSS/JS pour production
- [ ] Configurer CDN pour assets statiques
- [ ] Implémenter le cache navigateur

## 🔗 Intégrations externes

### SumUp (Boutique e-commerce)
- Lien vers boutique externe: [À définir]
- Boutons CTA vers la boutique intégrés

### WhatsApp Business
- Envoi des configurations de bijoux
- Numéro: [À définir]

### Réseaux sociaux
- Instagram: [À définir]
- Facebook: [À définir]
- Pinterest: [À définir]

## 🧪 Tests

### Navigateurs supportés
- Chrome (dernière version)
- Firefox (dernière version)
- Safari (dernière version)
- Edge (dernière version)

### Tests à effectuer
- [ ] Navigation sur tous les breakpoints
- [ ] Formulaires et validation
- [ ] Animations et performances
- [ ] Accessibilité (WCAG 2.1 AA)
- [ ] SEO (meta tags, structured data)

## 📊 Suivi du projet

### Phase 1: Page d'accueil ✅
- [x] Structure HTML
- [x] Styles CSS complets
- [x] Animations JavaScript
- [x] Responsive design

### Phase 2: Pages secondaires 🔄
- [ ] Page Collections
- [ ] Configurateur de bijoux
- [ ] Pages Univers
- [ ] Blog et Contact

### Phase 3: Intégrations 📋
- [ ] Connexion SumUp
- [ ] WhatsApp Business API
- [ ] Formulaires de contact
- [ ] Analytics (Google Analytics ou Plausible)

### Phase 4: Tests et déploiement 📋
- [ ] Tests cross-browser
- [ ] Tests de performance
- [ ] SEO optimization
- [ ] Déploiement production

## 👥 Équipe

**Développeur 1 (Lead):** Page d'accueil, architecture générale  
**Développeur 2:** Pages collections et configurateur  
**Développeur 3:** Pages univers, blog et intégrations  

## 📝 Notes importantes

1. **Qualité premium:** Le client paie 2 500 €, le site doit être irréprochable
2. **Éthique:** Mettre en avant les diamants de synthèse comme alternative éthique
3. **Expérience utilisateur:** Navigation fluide, animations subtiles mais percutantes
4. **Mobile-first:** Grande partie du trafic attendu sur mobile
5. **Conversion:** CTAs clairs vers la boutique et le configurateur

## 🔧 Outils recommandés

- **Design:** Figma (pour mockups si besoin)
- **Icons:** Heroicons, Phosphor Icons
- **Fonts:** Google Fonts (Cinzel, Montserrat)
- **Images:** Unsplash, Pexels (temporaire)
- **Animation:** Anime.js (si besoin d'animations complexes)
- **Forms:** Formspree ou Netlify Forms

## 📄 License

© 2024 ALEGRIA Paris. Tous droits réservés.  
Code développé par [Votre équipe].

## 🆘 Support

Pour toute question ou problème:
- Créer une issue sur GitHub
- Contacter le lead développeur
- Documentation: [Lien vers docs]

---

**Dernière mise à jour:** Décembre 2024  
**Version:** 1.0.0 (Page d'accueil)