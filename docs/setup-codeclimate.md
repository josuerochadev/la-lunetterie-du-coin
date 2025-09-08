# Configuration CodeClimate

## 🔧 Setup CodeClimate pour le projet

CodeClimate est intégré dans notre pipeline CI/CD pour le monitoring qualité continu.

### 1. Créer un compte CodeClimate

1. Aller sur [https://codeclimate.com](https://codeclimate.com)
2. Se connecter avec votre compte GitHub
3. Ajouter le repository `la-lunetterie-du-coin`

### 2. Obtenir le Test Reporter ID

1. Dans CodeClimate, aller dans votre repository
2. Aller dans **Settings** > **Test Coverage**
3. Copier le `TEST REPORTER ID`

### 3. Configurer le Secret GitHub

1. Aller dans les **Settings** de votre repository GitHub
2. Aller dans **Secrets and variables** > **Actions**
3. Ajouter un nouveau secret :
   - **Name**: `CC_TEST_REPORTER_ID`
   - **Value**: [Coller votre Test Reporter ID]

### 4. Mise à jour du badge README

Une fois configuré, mettez à jour le badge dans le README.md :

```markdown
[![Maintainability](https://api.codeclimate.com/v1/badges/VOTRE_REPO_ID/maintainability)](https://codeclimate.com/github/josuerochadev/la-lunetterie-du-coin/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/VOTRE_REPO_ID/test_coverage)](https://codeclimate.com/github/josuerochadev/la-lunetterie-du-coin/test_coverage)
```

Remplacez `VOTRE_REPO_ID` par l'ID de votre repository CodeClimate.

## 📊 Configuration locale (optionnelle)

Pour analyser la qualité localement :

```bash
# Installer Docker si pas déjà fait
# Puis lancer l'analyse
pnpm run quality:codeclimate
```

## 🔍 Métriques surveillées

CodeClimate analyse automatiquement :

- **Complexité du code**
- **Duplication**  
- **Maintenabilité**
- **Couverture de tests**
- **Issues de sécurité**

## 📈 Seuils configurés

Voir `.codeclimate.yml` pour les seuils :

- **Complexité méthode** : ≤ 5
- **Lignes par fichier** : ≤ 300  
- **Arguments par fonction** : ≤ 4
- **Code similaire** : ≤ 60 caractères
- **Code identique** : ≤ 40 caractères

## 🆘 Dépannage

Si l'intégration échoue :

1. Vérifier que le secret `CC_TEST_REPORTER_ID` est configuré
2. Vérifier que le repository est public ou que vous avez un plan CodeClimate approprié
3. L'action continue même si CodeClimate échoue (grâce à `continue-on-error: true`)

Le pipeline génère un rapport alternatif si CodeClimate n'est pas disponible.