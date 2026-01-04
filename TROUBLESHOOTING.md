# 🔧 Dépannage - Portfolio Ouzéfi

## 🚨 Problèmes Courants et Solutions

### Erreur 500 sur /services.html ou /projects.html

**Symptômes** : 
- Console browser : "Failed to load resource: 500"
- Aucun service/projet ne s'affiche

**Causes possibles** :
1. Variables d'environnement Netlify incorrectes ou manquantes
2. Tables Supabase pas créées
3. Dépendances npm pas installées

**Solutions** :

#### Solution 1 : Vérifier les variables d'environnement
1. Netlify → Votre site → **Site configuration** → **Environment variables**
2. Vérifiez que vous avez ces 4 variables :
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`

3. Pour obtenir les vraies valeurs Supabase :
   - Allez sur votre projet Supabase
   - **Settings** → **API**
   - Copiez "Project URL" pour `SUPABASE_URL`
   - Copiez "anon public" pour `SUPABASE_ANON_KEY`
   - Copiez "service_role" pour `SUPABASE_SERVICE_ROLE_KEY`

4. Après modification, redéployez :
   - **Deploys** → **Trigger deploy** → **Deploy site**

#### Solution 2 : Vérifier les tables Supabase
1. Allez sur votre projet Supabase
2. **Table Editor** → Cherchez `services` et `projects`
3. Si absentes :
   - **SQL Editor** → New query
   - Copiez le contenu de `supabase-schema-v2.sql`
   - Cliquez "Run"

#### Solution 3 : Vérifier les logs Netlify Functions
1. Netlify → **Functions**
2. Cliquez sur `services-get`
3. Regardez les **Logs** pour voir l'erreur exacte
4. Erreurs courantes :
   - "Cannot find module '@supabase/supabase-js'" → Problème de dépendances
   - "Invalid API key" → Variables d'env incorrectes
   - "relation 'services' does not exist" → Tables pas créées

---

### Erreur "Unauthorized" dans l'admin

**Symptômes** :
- Vous vous connectez à `/admin.html`
- Quand vous essayez de créer/modifier → "Unauthorized"

**Cause** :
Le mot de passe admin (`ADMIN_PASSWORD`) ne correspond pas ou n'est pas défini

**Solution** :
1. Netlify → **Environment variables**
2. Vérifiez que `ADMIN_PASSWORD` existe
3. Sa valeur DOIT correspondre EXACTEMENT au mot de passe que vous utilisez
4. Pas d'espaces avant/après
5. Exemple : `ADMIN_PASSWORD=MonMotDePasse123!`
6. Redéployez après modification

---

### Le site ne se déploie pas (erreur build)

**Symptômes** :
- Deploy failed avec "Build script returned non-zero exit code"

**Causes possibles** :
1. Secrets détectés dans les fichiers (clés Supabase en clair)
2. Erreur dans package.json
3. Problème de dépendances

**Solutions** :

#### Si "Secrets scanning detected"
Les clés Supabase ne doivent JAMAIS être dans les fichiers .md ou .js publics.
Elles doivent uniquement être dans les variables d'environnement Netlify.

Si vous avez ce problème :
1. Supprimez les fichiers contenant les clés
2. Recréez-les sans les vraies valeurs
3. Poussez sur GitHub
4. Redéployez

#### Si erreur npm install
1. Vérifiez que `package.json` existe à la racine
2. Vérifiez que `netlify/functions/package.json` existe
3. Les dépendances doivent inclure `@supabase/supabase-js`

---

### Les services/projets ne s'affichent pas localement

**Si vous testez en local avec `netlify dev`** :

1. Créez un fichier `.env` à la racine :
```
SUPABASE_URL=votre_url_supabase
SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
ADMIN_PASSWORD=votre_mot_de_passe
```

2. Installez les dépendances :
```bash
npm install
```

3. Lancez le serveur :
```bash
netlify dev
```

⚠️ **IMPORTANT** : Ne committez JAMAIS le fichier `.env` (il est dans `.gitignore`)

---

### "Cannot read property 'length' of undefined"

**Cause** : Les données retournées par Supabase sont vides ou incorrectes

**Solution** :
1. Vérifiez que les tables contiennent des données
2. Dans Supabase → Table Editor → `services` → Devriez voir 6 lignes
3. Si vide, exécutez le script SQL complet

---

### Les modifications du code ne s'appliquent pas

**Cause** : Cache Netlify

**Solution** :
1. **Deploys** → **Trigger deploy**
2. Choisissez **"Clear cache and deploy site"**
3. Attendez le nouveau déploiement

---

## 📝 Comment obtenir les logs détaillés

### Logs Netlify Functions
1. Netlify → **Functions**
2. Cliquez sur la function concernée
3. **Logs** → Vous verrez toutes les erreurs en détail

### Logs Browser (Chrome/Firefox)
1. Ouvrez votre site
2. Appuyez sur **F12** (DevTools)
3. Onglet **Console** → Erreurs JavaScript
4. Onglet **Network** → Erreurs HTTP (500, 404, etc.)

### Logs Supabase
1. Supabase → **Logs** (dans le menu)
2. Filtrez par erreurs
3. Vous verrez les requêtes échouées

---

## ✅ Checklist de diagnostic rapide

Quand quelque chose ne fonctionne pas :

1. ☐ Les tables Supabase existent-elles ?
2. ☐ Les 4 variables d'environnement sont-elles définies dans Netlify ?
3. ☐ Le dernier déploiement a-t-il réussi ? (statut "Published")
4. ☐ Y a-t-il des erreurs dans les logs Netlify Functions ?
5. ☐ Y a-t-il des erreurs dans la console browser ?
6. ☐ Avez-vous vidé le cache et redéployé ?

---

## 🆘 Toujours bloqué ?

Si après avoir suivi tous ces steps le problème persiste :

1. Notez l'erreur EXACTE (message complet)
2. Notez ce que vous avez essayé
3. Envoyez ces informations

Les informations les plus utiles :
- Message d'erreur complet
- Logs Netlify Functions
- Ce qui fonctionne / ne fonctionne pas
- Quand le problème est apparu
