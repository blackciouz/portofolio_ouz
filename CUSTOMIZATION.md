# 🎨 Guide de Personnalisation

Ce guide vous aide à personnaliser votre portfolio selon vos besoins.

## 🎨 Modifier les Couleurs

### Palette de couleurs principale
Fichier : `public/css/styles.css` (lignes 8-26)

```css
:root {
  /* Modifier la couleur principale (bleu cyan) */
  --brand-500: #0ea5e9;  /* Votre couleur principale */
  --brand-400: #38bdf8;  /* Version plus claire */
  --brand-600: #0284c7;  /* Version plus foncée */
  
  /* Couleurs secondaires */
  --cyber-purple: #9333ea;  /* Violet cyber */
  --neon-emerald: #10b981; /* Vert néon */
  --alert-orange: #f97316; /* Orange alerte */
}
```

### Exemples de palettes alternatives

**Palette Verte (Écologique)** :
```css
--brand-500: #10b981;
--brand-400: #34d399;
--brand-600: #059669;
```

**Palette Violette (Créative)** :
```css
--brand-500: #8b5cf6;
--brand-400: #a78bfa;
--brand-600: #7c3aed;
```

**Palette Orange (Énergique)** :
```css
--brand-500: #f97316;
--brand-400: #fb923c;
--brand-600: #ea580c;
```

## 📝 Modifier les Textes

### Hero Section
Fichier : `public/index.html` (lignes 52-66)

```html
<h1>J'automatise à <span class="gradient-text">100%</span> votre prospection...</h1>
<p>Systèmes IA & SaaS sur mesure...</p>
```

### Section À propos
Fichier : `public/index.html` (lignes 88-110)

Modifiez votre bio et votre positionnement.

### Statistiques
Fichier : `public/index.html` (lignes 74-82)

```html
<div class="stat-number">100%</div>
<div class="stat-label">Automatisation</div>
```

## 🖼️ Ajouter des Images

### Logo/Favicon
1. Ajoutez votre logo dans `public/assets/`
2. Modifiez le header dans `public/index.html` :

```html
<head>
    <link rel="icon" type="image/png" href="assets/favicon.png">
    <meta property="og:image" content="assets/og-image.jpg">
</head>
```

### Images des projets
Ajoutez vos images via le panel admin ou directement dans les champs `image_url` lors de la création de projets.

## 📧 Modifier les Informations de Contact

### Email
Fichier : `public/index.html` (ligne ~490)

```html
<a href="mailto:votre-email@example.com" class="btn btn-primary">
```

### WhatsApp
Fichier : `public/index.html` (ligne ~494)

```html
<a href="https://wa.me/33612345678" target="_blank" class="btn btn-secondary">
```

Remplacez `33612345678` par votre numéro au format international (sans + ni espaces).

### Ajouter d'autres liens sociaux

Ajoutez dans le footer :

```html
<div style="display: flex; gap: 1rem; margin-top: 1rem;">
    <a href="https://linkedin.com/in/votre-profil" target="_blank" 
       style="color: var(--brand-400);">
        <i data-lucide="linkedin"></i>
    </a>
    <a href="https://github.com/votre-username" target="_blank"
       style="color: var(--brand-400);">
        <i data-lucide="github"></i>
    </a>
    <a href="https://twitter.com/votre-username" target="_blank"
       style="color: var(--brand-400);">
        <i data-lucide="twitter"></i>
    </a>
</div>
```

## 🔧 Personnaliser les Sections

### Ajouter une nouvelle section

```html
<section id="ma-nouvelle-section">
    <div class="container">
        <div class="section-header">
            <div class="section-tag">🎯 Ma Section</div>
            <h2>Titre de ma Section</h2>
            <p>Description</p>
        </div>
        
        <div class="grid-2">
            <div class="glass-card feature-card">
                <h3>Contenu 1</h3>
                <p>Description...</p>
            </div>
            <div class="glass-card feature-card">
                <h3>Contenu 2</h3>
                <p>Description...</p>
            </div>
        </div>
    </div>
</section>
```

### Supprimer une section

1. Trouvez la section dans `public/index.html`
2. Supprimez le bloc `<section>...</section>`
3. Mettez à jour la navigation si nécessaire

### Réorganiser les sections

Déplacez simplement les blocs `<section>` dans l'ordre souhaité dans `public/index.html`.

## 🎭 Modifier les Animations

### Désactiver les animations
Fichier : `public/css/styles.css`

Commentez ou supprimez :
```css
/* @keyframes fadeInUp { ... } */
/* .animate-fade-in { ... } */
```

### Changer la vitesse des animations
```css
section {
    transition: opacity 0.8s ease; /* Changez 0.8s à 0.3s pour plus rapide */
}
```

## 📱 Ajuster le Responsive

### Points de rupture
Fichier : `public/css/styles.css` (ligne ~426)

```css
@media (max-width: 768px) {
    /* Styles mobile */
}

/* Ajouter un point de rupture tablette */
@media (max-width: 1024px) and (min-width: 769px) {
    /* Styles tablette */
}
```

## 🌐 SEO et Meta Tags

### Modifier les meta tags
Fichier : `public/index.html` (head)

```html
<meta name="description" content="Votre description personnalisée">
<meta name="keywords" content="vos, mots, clés">
<meta property="og:title" content="Votre Nom - Titre">
<meta property="og:description" content="Votre description">
<meta property="og:image" content="https://votre-site.com/assets/og-image.jpg">
<meta name="twitter:card" content="summary_large_image">
```

### Ajouter Google Analytics

Avant la fermeture de `</head>` :

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🔒 Sécurité du Panel Admin

### Changer le mot de passe admin

1. Accédez aux variables d'environnement Netlify
2. Modifiez `ADMIN_PASSWORD`
3. Redéployez le site

### Changer l'URL du panel admin

1. Renommez `public/admin.html` en `public/secret-panel.html`
2. Mettez à jour le lien dans le footer
3. Redéployez

## 🎨 Modifier les Icônes

Les icônes utilisent [Lucide Icons](https://lucide.dev/).

Pour changer une icône :
```html
<!-- Avant -->
<i data-lucide="brain"></i>

<!-- Après -->
<i data-lucide="rocket"></i>
```

Liste des icônes disponibles : https://lucide.dev/icons/

## 📚 Ressources

- [Lucide Icons](https://lucide.dev/)
- [Google Fonts](https://fonts.google.com/)
- [Coolors (palettes)](https://coolors.co/)
- [CSS Gradient Generator](https://cssgradient.io/)

---

Besoin d'aide pour personnaliser davantage ? N'hésitez pas à consulter le code source ou à demander de l'assistance !
