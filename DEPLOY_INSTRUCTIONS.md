# 🚀 Instructions de Déploiement - Portfolio Ouzéfi V2

## ⚠️ IMPORTANT : Mise à jour Supabase

Votre base de données Supabase doit être mise à jour avec le nouveau schéma !

### Étape 1 : Mettre à jour Supabase

1. Allez sur votre projet Supabase : https://jstczmjqazfvbjpmwwfa.supabase.co
2. Cliquez sur **"SQL Editor"** dans le menu
3. Cliquez sur **"New query"**
4. **Copiez TOUT le contenu** du fichier `supabase-schema-v2.sql`
5. **Collez** dans l'éditeur SQL
6. Cliquez sur **"Run"** (ou Ctrl+Enter)

✅ Vos tables `services` et `projects` seront créées avec des exemples de données !

---

## 📦 Étape 2 : Pousser le code sur GitHub

```bash
# Ajouter tous les nouveaux fichiers
git add .

# Créer un commit
git commit -m "Portfolio V2 complet - Multi-pages, Services, Projects, Admin panel"

# Pousser sur GitHub
git push origin main
```

---

## 🌐 Étape 3 : Redéployer sur Netlify

### Option A : Déploiement automatique
Si vous avez déjà connecté le repo à Netlify, le site se redéploiera automatiquement après le push !

### Option B : Déploiement manuel
1. Allez sur [app.netlify.com](https://app.netlify.com)
2. Sélectionnez votre site
3. Cliquez sur **"Trigger deploy"** → **"Deploy site"**

---

## ✅ Étape 4 : Vérification

Une fois déployé, testez ces URLs :

- ✅ **Accueil** : `https://votre-site.netlify.app/`
- ✅ **Services** : `https://votre-site.netlify.app/services.html`
- ✅ **Projets** : `https://votre-site.netlify.app/projects.html`
- ✅ **À propos** : `https://votre-site.netlify.app/about.html`
- ✅ **Contact** : `https://votre-site.netlify.app/contact.html`
- ✅ **Admin** : `https://votre-site.netlify.app/admin.html`

### Test du Panel Admin

1. Allez sur `/admin.html`
2. Entrez le mot de passe : `OuzefiAdmin2024!`
3. Vérifiez que vous voyez les services et projets d'exemple
4. Testez l'ajout d'un nouveau service ou projet

---

## 🎨 Personnalisations à faire

### 1. Email et WhatsApp

Fichier : `public/contact.html` (ligne ~112 et ~125)

```html
<!-- Changez l'email -->
<a href="mailto:VOTRE-EMAIL@example.com">

<!-- Changez le WhatsApp (format international sans + ni espaces) -->
<a href="https://wa.me/33612345678" target="_blank">
```

### 2. Changer le mot de passe Admin

Dans Netlify → Site settings → Environment variables :
- Modifiez `ADMIN_PASSWORD` avec un mot de passe plus fort

### 3. Ajouter vos vrais projets

Via le panel admin :
1. Allez sur `/admin.html`
2. Connectez-vous
3. Onglet **Services** : ajoutez vos services
4. Onglet **Projets** : ajoutez vos projets

---

## 📊 Ce qui a changé

### ✅ Nouveau dans la V2

1. **Architecture multi-pages** (au lieu d'une seule page)
2. **Navigation professionnelle** avec menu mobile
3. **Pages dédiées** :
   - Home avec hero moderne
   - Services (catalogue complet)
   - Service Detail (vue détaillée)
   - Projects (catalogue avec filtres)
   - Project Detail (avec fichiers embed)
   - About (présentation professionnelle)
   - Contact (formulaire)

4. **Design system professionnel** :
   - Glassmorphism
   - Animations fluides
   - Responsive parfait (Desktop, Tablet, Mobile)
   - Palette de couleurs cohérente

5. **Base de données améliorée** :
   - Table `services` complète
   - Table `projects` avec fichiers embed
   - Slugs pour URLs propres
   - Featured items

6. **API complète** :
   - 8 Netlify Functions (4 pour services, 4 pour projects)
   - CRUD complet
   - Authentification sécurisée

7. **Panel Admin refait** :
   - Interface moderne
   - Gestion Services ET Projects
   - Tabs pour organiser
   - CRUD complet sur chaque entité

---

## 🔧 Structure des fichiers

```
public/
├── index.html              ← Home
├── services.html           ← Liste des services
├── service-detail.html     ← Détail d'un service
├── projects.html           ← Liste des projets
├── project-detail.html     ← Détail d'un projet
├── about.html              ← À propos
├── contact.html            ← Contact
├── admin.html              ← Panel admin
├── css/
│   └── main.css           ← Design system complet
└── js/
    ├── nav.js             ← Navigation
    ├── home.js            ← Page d'accueil
    ├── services.js        ← Page services
    ├── service-detail.js  ← Détail service
    ├── projects.js        ← Page projets
    ├── project-detail.js  ← Détail projet
    └── admin-panel.js     ← Panel admin

netlify/functions/
├── services-get.js        ← GET services
├── services-create.js     ← POST service
├── services-update.js     ← PUT service
├── services-delete.js     ← DELETE service
├── projects-get.js        ← GET projects
├── projects-create.js     ← POST project
├── projects-update.js     ← PUT project
└── projects-delete.js     ← DELETE project
```

---

## 🆘 Troubleshooting

### Les services/projets ne s'affichent pas

1. ✅ Vérifiez que le script SQL a bien été exécuté dans Supabase
2. ✅ Vérifiez que les variables d'environnement sont bien configurées dans Netlify
3. ✅ Regardez les logs Netlify Functions

### Le panel admin ne fonctionne pas

1. ✅ Vérifiez que `ADMIN_PASSWORD` est défini dans Netlify
2. ✅ Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` est correcte

### Erreur 404 sur les pages

1. ✅ Vérifiez que tous les fichiers HTML sont bien dans `public/`
2. ✅ Redéployez le site sur Netlify

### Les fichiers embed ne s'affichent pas

Les fichiers embed (vidéos YouTube, PDFs) nécessitent des URLs valides.
Exemple pour YouTube : `https://www.youtube.com/embed/VIDEO_ID`

---

## 🎉 C'est prêt !

Votre nouveau portfolio est **production-ready** et **ultra-professionnel** !

**Prochaines étapes :**
1. ✅ Testez toutes les pages
2. ✅ Ajoutez vos vrais projets
3. ✅ Personnalisez email et WhatsApp
4. ✅ Partagez votre portfolio ! 🚀

---

**Questions ?** Consultez les logs Netlify ou vérifiez la configuration Supabase.

Bon déploiement ! 💙
