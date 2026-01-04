# 🚀 Guide de Configuration - Portfolio Ouzéfi

## ⚠️ IMPORTANT : Sécurité

**NE JAMAIS** mettre vos clés Supabase dans des fichiers publics (comme les .md) !
Les clés sont dans les variables d'environnement Netlify uniquement.

---

## 📋 Checklist de Configuration

### Étape 1 : Vérifier Supabase

1. Allez sur votre projet Supabase
2. **Table Editor** → Vérifiez les tables `services` et `projects`
3. Si absentes : **SQL Editor** → Copiez le contenu de `supabase-schema-v2.sql` → Run

### Étape 2 : Variables d'Environnement Netlify

1. Netlify → Votre site → **Site configuration** → **Environment variables**
2. Vérifiez ces 4 variables (NE PAS mettre les vraies valeurs ici) :
   - `SUPABASE_URL` = votre URL Supabase (commence par https://...supabase.co)
   - `SUPABASE_ANON_KEY` = votre clé anon (longue chaîne commençant par eyJ...)
   - `SUPABASE_SERVICE_ROLE_KEY` = votre clé service_role (longue chaîne commençant par eyJ...)
   - `ADMIN_PASSWORD` = votre mot de passe admin (ex: MonMotDePasse123!)

**Où trouver les clés Supabase ?**
- Supabase → **Settings** → **API**
- Copiez "Project URL" pour SUPABASE_URL
- Copiez "anon public" pour SUPABASE_ANON_KEY
- Copiez "service_role" pour SUPABASE_SERVICE_ROLE_KEY

### Étape 3 : Redéployer

1. **Deploys** → **Trigger deploy** → **Clear cache and deploy site**
2. Attendez 2-3 minutes

### Étape 4 : Tester

- `/services.html` → Devrait afficher 6 services
- `/projects.html` → Devrait afficher 3 projets
- `/admin.html` → Connexion avec votre ADMIN_PASSWORD

---

## 🐛 Erreurs Courantes

### Erreur 500 sur /services.html
**Cause** : Variables Supabase incorrectes ou manquantes
**Solution** : Vérifiez les 3 variables SUPABASE_* dans Netlify

### "Unauthorized" dans l'admin
**Cause** : ADMIN_PASSWORD incorrect
**Solution** : Vérifiez la variable ADMIN_PASSWORD dans Netlify

### Tables vides dans Supabase
**Cause** : Script SQL pas exécuté
**Solution** : Exécutez `supabase-schema-v2.sql` dans SQL Editor

---

## 📞 Besoin d'Aide ?

Vérifiez les logs Netlify Functions :
- Netlify → **Functions** → Cliquez sur une function → **Logs**

Les erreurs détaillées y seront affichées.
