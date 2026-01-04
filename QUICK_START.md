# 🚀 Quick Start - Portfolio Ouzéfi

Guide rapide pour mettre votre portfolio en ligne en 10 minutes !

## ✅ Checklist Rapide

### 1️⃣ Supabase (2 minutes)
- [ ] Créer un compte sur [supabase.com](https://supabase.com)
- [ ] Créer un nouveau projet
- [ ] Copier le contenu de `supabase-setup.sql`
- [ ] L'exécuter dans l'éditeur SQL de Supabase
- [ ] Noter vos 3 clés :
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

### 2️⃣ GitHub (1 minute)
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/VOTRE-REPO.git
git push -u origin main
```

### 3️⃣ Netlify (3 minutes)
- [ ] Se connecter sur [netlify.com](https://netlify.com)
- [ ] Cliquer "Add new site" → "Import an existing project"
- [ ] Connecter votre repo GitHub
- [ ] Configuration :
  - Build command : `echo 'No build'`
  - Publish directory : `public`
  - Functions directory : `netlify/functions`

### 4️⃣ Variables d'environnement (2 minutes)
Dans Netlify → Site settings → Environment variables :
```
SUPABASE_URL=votre_url_supabase
SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
ADMIN_PASSWORD=ChoisissezUnMotDePasseSecurise123!
```

### 5️⃣ Personnalisation (2 minutes)
Éditez `public/index.html` :
- Ligne 490 : Votre email
- Ligne 494 : Votre WhatsApp (format : 33612345678)

### 6️⃣ Déployer !
Cliquez sur "Deploy site" dans Netlify. ✨

Votre site sera en ligne à `https://votre-site.netlify.app` !

---

## 📱 Accéder au Panel Admin

1. Allez sur `https://votre-site.netlify.app/admin.html`
2. Entrez votre mot de passe admin
3. Ajoutez vos premiers projets !

---

## 🎨 Personnalisation Rapide

### Changer les couleurs
`public/css/styles.css` - ligne 10 :
```css
--brand-500: #0ea5e9; /* Votre couleur principale */
```

### Modifier le texte du hero
`public/index.html` - ligne 54 :
```html
<h1>J'automatise à <span class="gradient-text">100%</span> votre prospection...</h1>
```

### Ajouter votre photo
Ajoutez dans le hero section :
```html
<img src="assets/votre-photo.jpg" alt="Ouzéfi" style="border-radius: 50%; width: 200px; height: 200px;">
```

---

## 🆘 Problèmes Courants

**Les projets ne s'affichent pas ?**
→ Vérifiez les variables d'environnement dans Netlify

**Panel admin ne fonctionne pas ?**
→ Vérifiez que `ADMIN_PASSWORD` est bien défini

**Erreur 404 sur les functions ?**
→ Vérifiez que `netlify.toml` est à la racine

---

## 📚 Documentation Complète

- `DEPLOYMENT.md` - Guide détaillé de déploiement
- `CUSTOMIZATION.md` - Guide de personnalisation
- `README.md` - Documentation technique

---

## 🎯 Prochaines Étapes

1. ✅ Ajouter vos projets via le panel admin
2. ✅ Personnaliser les couleurs et textes
3. ✅ Configurer votre domaine personnalisé (optionnel)
4. ✅ Ajouter Google Analytics (optionnel)
5. ✅ Partager votre portfolio ! 🚀

---

**Temps total estimé : 10 minutes** ⏱️

Votre portfolio professionnel est prêt ! 🎉
