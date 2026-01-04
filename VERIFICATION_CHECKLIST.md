# ✅ Checklist de Vérification - Portfolio Ouzéfi

## 🔍 Étape 1 : Vérifier Supabase

### 1.1 Tables créées
- [ ] Allez sur https://jstczmjqazfvbjpmwwfa.supabase.co
- [ ] Cliquez **"Table Editor"**
- [ ] Vérifiez que vous voyez la table **`services`**
- [ ] Vérifiez que vous voyez la table **`projects`**
- [ ] Cliquez sur **`services`** → Devriez voir 6 lignes de données
- [ ] Cliquez sur **`projects`** → Devriez voir 3 lignes de données

❌ **Si les tables n'existent pas** :
1. **SQL Editor** → **New query**
2. Copiez TOUT le contenu de `supabase-schema-v2.sql`
3. Cliquez **"Run"**
4. Vérifiez à nouveau dans Table Editor

---

## 🌐 Étape 2 : Vérifier les Variables d'Environnement Netlify

- [ ] Allez sur https://app.netlify.com
- [ ] Sélectionnez votre site
- [ ] **Site configuration** → **Environment variables**
- [ ] Vérifiez que vous avez **EXACTEMENT 4 variables** :

```
✅ SUPABASE_URL
✅ SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY
✅ ADMIN_PASSWORD
```

### Vérification des valeurs :

**SUPABASE_URL** :
```
https://jstczmjqazfvbjpmwwfa.supabase.co
```

**SUPABASE_ANON_KEY** :
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzdGN6bWpxYXpmdmJqcG13d2ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NTczMjcsImV4cCI6MjA4MzEzMzMyN30.Dl_LJk0f-IWxwaKiVyqLFmmiNl8r2F7eZvTbgzUwsfY
```

**SUPABASE_SERVICE_ROLE_KEY** :
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzdGN6bWpxYXpmdmJqcG13d2ZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzU1NzMyNywiZXhwIjoyMDgzMTMzMzI3fQ.rLezh8nxHfSXs0Pkf5GOaVghZ7VAktWLFlAHwuhlTIM
```

**ADMIN_PASSWORD** :
```
OuzefiAdmin2024!
```

⚠️ **IMPORTANT** :
- Pas d'espaces
- Pas de guillemets
- Respectez exactement la casse

❌ **Si une variable est incorrecte** :
1. Cliquez sur **"Edit"** à côté de la variable
2. Corrigez la valeur
3. Cliquez **"Save"**
4. Redéployez (voir Étape 3)

---

## 🚀 Étape 3 : Redéployer le Site

- [ ] Dans Netlify, cliquez sur **"Deploys"**
- [ ] Cliquez **"Trigger deploy"** → **"Clear cache and deploy site"**
- [ ] Attendez 2-3 minutes (le statut doit passer à "Published")

---

## 🧪 Étape 4 : Tests

### Test 1 : Page Services
- [ ] Allez sur `https://votre-site.netlify.app/services.html`
- [ ] Vous devriez voir **6 services** affichés

✅ **Si ça marche** : Parfait ! Passez au test suivant
❌ **Si "Aucun service disponible"** : Variables Supabase incorrectes → Retour Étape 2

### Test 2 : Page Projets
- [ ] Allez sur `https://votre-site.netlify.app/projects.html`
- [ ] Vous devriez voir **3 projets** affichés

✅ **Si ça marche** : Parfait ! Passez au test suivant
❌ **Si "Aucun projet disponible"** : Variables Supabase incorrectes → Retour Étape 2

### Test 3 : Connexion Admin
- [ ] Allez sur `https://votre-site.netlify.app/admin.html`
- [ ] Entrez le mot de passe : `OuzefiAdmin2024!`
- [ ] Cliquez **"Se connecter"**
- [ ] Vous devriez voir le message "Vérification..." puis le panel admin

✅ **Si ça marche** : Parfait ! Passez au test suivant
❌ **Si erreur** : Notez le message d'erreur exact

### Test 4 : Voir les Services dans l'Admin
- [ ] Dans l'admin, onglet **"Services"**
- [ ] Vous devriez voir la liste des 6 services

✅ **Si ça marche** : Parfait ! Passez au test suivant
❌ **Si "Aucun service"** : Problème de connexion Supabase

### Test 5 : Créer un Service
- [ ] Dans l'admin, remplissez le formulaire :
  - Titre : `Test Service`
  - Catégorie : `Test`
  - Description courte : `Service de test`
- [ ] Cliquez **"Ajouter"**
- [ ] Devrait afficher **"Service ajouté !"**
- [ ] Le service apparaît dans la liste

✅ **Si ça marche** : Parfait !
❌ **Si "Unauthorized"** : `ADMIN_PASSWORD` incorrect → Retour Étape 2

### Test 6 : Modifier un Service
- [ ] Cliquez sur le bouton **"Edit"** (crayon) d'un service
- [ ] Modifiez le titre
- [ ] Cliquez **"Mettre à jour"**
- [ ] Devrait afficher **"Service mis à jour !"**

### Test 7 : Supprimer le Service de Test
- [ ] Trouvez le "Test Service" créé
- [ ] Cliquez sur le bouton **"Trash"** (poubelle)
- [ ] Confirmez la suppression
- [ ] Devrait afficher **"Service supprimé !"**

---

## 📊 Résultat Final

| Test | Status | Action si échec |
|------|--------|-----------------|
| Tables Supabase | ☐ | Exécuter le SQL |
| Variables Netlify | ☐ | Corriger les variables |
| Redéploiement | ☐ | Attendre fin du deploy |
| Page Services | ☐ | Vérifier variables |
| Page Projets | ☐ | Vérifier variables |
| Connexion Admin | ☐ | Vérifier ADMIN_PASSWORD |
| Liste Services Admin | ☐ | Vérifier connexion Supabase |
| Créer Service | ☐ | Vérifier ADMIN_PASSWORD |
| Modifier Service | ☐ | Vérifier permissions |
| Supprimer Service | ☐ | Vérifier permissions |

---

## 🆘 En Cas de Problème

### Erreur : "Impossible de se connecter à la base de données"
**Cause** : Supabase URL ou keys incorrectes
**Solution** : Revérifiez EXACTEMENT les 3 variables Supabase dans Netlify

### Erreur : "Unauthorized" lors de la création
**Cause** : `ADMIN_PASSWORD` incorrect ou pas défini
**Solution** : Vérifiez que `ADMIN_PASSWORD=OuzefiAdmin2024!` dans Netlify

### Erreur : Rien ne s'affiche sur /services.html
**Cause** : Tables Supabase pas créées OU variables incorrectes
**Solution** : 
1. Vérifiez les tables dans Supabase Table Editor
2. Si absentes, exécutez le SQL
3. Vérifiez les variables Netlify
4. Redéployez

### Les modifications ne s'appliquent pas
**Cause** : Cache Netlify
**Solution** : "Trigger deploy" → "Clear cache and deploy site"

---

## ✅ Une fois TOUT validé

Vous pouvez :
1. 🎨 Personnaliser les couleurs
2. 📝 Ajouter vos vrais projets
3. ✉️ Modifier email et WhatsApp
4. 🚀 Partager votre portfolio !

---

**Temps estimé total : 10-15 minutes**

Si un test échoue, notez le message d'erreur exact et suivez les actions de correction. 💪
