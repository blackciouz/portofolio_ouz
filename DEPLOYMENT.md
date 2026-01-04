# 🚀 Guide de Déploiement - Portfolio Ouzéfi

Ce guide vous explique comment déployer votre portfolio sur Netlify avec Supabase.

## 📋 Prérequis

- Compte [Netlify](https://netlify.com)
- Compte [Supabase](https://supabase.com)
- Git installé
- Node.js installé (pour tester en local)

## 🗄️ Étape 1 : Configuration Supabase

### 1.1 Créer un projet Supabase

1. Connectez-vous à [Supabase](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre `Project URL` et vos clés API

### 1.2 Créer la table des projets

1. Allez dans l'éditeur SQL de Supabase
2. Copiez le contenu du fichier `supabase-setup.sql`
3. Exécutez le script SQL
4. Vérifiez que la table `projects` est bien créée

### 1.3 Récupérer les clés API

Dans les paramètres de votre projet Supabase :
- **Project URL** : `https://xxxxx.supabase.co`
- **anon/public key** : `eyJhbGc...`
- **service_role key** : `eyJhbGc...` (à garder secrète !)

## 🌐 Étape 2 : Déploiement sur Netlify

### 2.1 Créer un repository Git

```bash
# Initialiser Git (si pas déjà fait)
git init
git add .
git commit -m "Initial commit - Portfolio Ouzéfi"

# Pousser sur GitHub/GitLab/Bitbucket
git remote add origin https://github.com/votre-username/votre-repo.git
git push -u origin main
```

### 2.2 Connecter à Netlify

1. Connectez-vous à [Netlify](https://app.netlify.com)
2. Cliquez sur **"Add new site"** → **"Import an existing project"**
3. Choisissez votre provider Git (GitHub, GitLab, etc.)
4. Sélectionnez votre repository
5. Configurez les paramètres :
   - **Build command** : `echo 'No build required'`
   - **Publish directory** : `public`
   - **Functions directory** : `netlify/functions`

### 2.3 Configurer les variables d'environnement

Dans les **Site settings** → **Environment variables**, ajoutez :

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_PASSWORD=votre_mot_de_passe_admin_securise
```

⚠️ **Important** : Choisissez un mot de passe admin fort et sécurisé !

### 2.4 Déployer

Cliquez sur **"Deploy site"** et attendez quelques secondes.

Votre site sera accessible à l'URL : `https://votre-site-name.netlify.app`

## 🔧 Étape 3 : Configuration post-déploiement

### 3.1 Configurer le domaine personnalisé (optionnel)

1. Dans Netlify, allez dans **Domain settings**
2. Ajoutez votre domaine personnalisé (ex: `ouzefi.com`)
3. Suivez les instructions pour configurer les DNS

### 3.2 Activer HTTPS

Netlify active automatiquement HTTPS avec Let's Encrypt. Vérifiez que c'est bien actif dans **Domain settings** → **HTTPS**.

### 3.3 Tester le panel admin

1. Accédez à `https://votre-site.netlify.app/admin.html`
2. Entrez votre mot de passe admin
3. Testez l'ajout/modification/suppression de projets

## 📝 Étape 4 : Personnalisation

### 4.1 Modifier les informations de contact

Dans `public/index.html`, ligne ~490 :
```html
<a href="mailto:votre-email@example.com" class="btn btn-primary">
<a href="https://wa.me/votre_numero_whatsapp" target="_blank" class="btn btn-secondary">
```

### 4.2 Ajouter vos premiers projets

Via le panel admin, ajoutez vos projets :
- MultiGPT1
- Vos automatisations
- Vos SaaS
- Etc.

### 4.3 Mettre à jour les stats

Dans `public/index.html`, ligne ~74-82, modifiez les statistiques selon vos besoins.

## 🧪 Test en Local (optionnel)

Pour tester en local avant de déployer :

```bash
# Installer les dépendances
npm install

# Créer un fichier .env avec vos clés
cp .env.example .env
# Éditer .env avec vos vraies valeurs

# Lancer le serveur de développement
npm run dev
```

Le site sera accessible à `http://localhost:8888`

## 🔄 Mise à jour du site

Pour mettre à jour votre portfolio :

```bash
git add .
git commit -m "Description des modifications"
git push
```

Netlify redéploiera automatiquement votre site !

## ⚡ Optimisations supplémentaires

### Cache et Performance
Netlify gère automatiquement :
- CDN global
- Compression gzip/brotli
- Cache des assets statiques

### SEO
- Le site est déjà optimisé pour le SEO
- Pensez à ajouter un `robots.txt` si nécessaire
- Configurez Google Analytics si souhaité

## 🆘 Troubleshooting

### Les projets ne se chargent pas
1. Vérifiez que les variables d'environnement sont bien configurées dans Netlify
2. Vérifiez que la table Supabase est bien créée
3. Regardez les logs dans Netlify Functions

### Le panel admin ne fonctionne pas
1. Vérifiez que `ADMIN_PASSWORD` est bien défini dans les variables d'environnement
2. Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` est correcte

### Erreur 404 sur les functions
1. Vérifiez que le dossier `netlify/functions` est bien présent
2. Vérifiez que `package.json` contient les dépendances nécessaires

## 📚 Ressources

- [Documentation Netlify](https://docs.netlify.com)
- [Documentation Supabase](https://supabase.com/docs)
- [Support Netlify](https://answers.netlify.com)

---

**Besoin d'aide ?** Contactez-moi ou consultez les logs dans Netlify pour diagnostiquer les problèmes.

Bon déploiement ! 🚀
