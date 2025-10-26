# 🤖 Dependabot Configuration

Ce projet utilise **Dependabot** pour automatiser les mises à jour de dépendances et maintenir la sécurité du projet.

## 📋 Configuration

### Fréquence des vérifications

- **npm/pnpm** : Hebdomadaire (lundi 09:00 Europe/Paris)
- **GitHub Actions** : Hebdomadaire (lundi 09:00 Europe/Paris)

### Stratégie de mise à jour

#### Dépendances de production

- ✅ **Patch** : Auto-groupées et auto-mergées si tests passent
- ⚠️ **Minor** : Groupées, revue manuelle recommandée
- 🔴 **Major** : Revue manuelle obligatoire

#### Dépendances de développement

- ✅ **Patch & Minor** : Auto-groupées
- 🔴 **Major** : Revue manuelle

### Dépendances ignorées

Les mises à jour **majeures** sont ignorées pour :

- `react` / `react-dom` : Nécessite tests approfondis
- `vite` : Peut nécessiter migration de config

## 🔄 Workflow automatique

### Auto-approval

Les PRs suivantes sont **auto-approuvées** :

- Patches de sécurité
- Mises à jour mineures de dépendances dev

### Auto-merge

Les PRs suivantes sont **auto-mergées** (si tests passent) :

- Patches de sécurité uniquement

### Revue manuelle requise

- ⚠️ Mises à jour majeures
- ⚠️ Changements dans `react`, `react-dom`, `vite`
- ⚠️ PRs échouant les tests

## 🛡️ Sécurité

### Alertes de sécurité

Dependabot crée automatiquement des PRs pour :

- Vulnérabilités détectées dans les dépendances
- Patches de sécurité disponibles

### Process de validation

1. ✅ Dependabot crée une PR
2. 🧪 Quality pipeline s'exécute (tests, lint, build, security)
3. 🔍 Revue automatique ou manuelle selon le type
4. ✅ Merge automatique ou manuel

## 📊 Groupement des PRs

### Development Dependencies Group

Regroupe les mises à jour mineures et patches de :

- TypeScript, ESLint, Prettier
- Vitest, Playwright
- Build tools (rollup-plugin-\*, etc.)

### Production Dependencies Group

Regroupe les patches de :

- React ecosystem (non-major)
- Routing, animation libraries
- Utilitaires (clsx, tailwind-merge, etc.)

## 🎯 Bonnes pratiques

### Pour les mainteneurs

1. **Vérifier les PRs Dependabot régulièrement**
   - Consulter les CHANGELOGs
   - Vérifier les breaking changes

2. **Mises à jour majeures**
   - Créer une branche dédiée
   - Tester manuellement toutes les fonctionnalités
   - Mettre à jour la documentation si nécessaire

3. **Conflits de merge**
   - Rebaser avec `@dependabot rebase`
   - Ou merger manuellement si nécessaire

### Commandes Dependabot

Dans les commentaires de PR, vous pouvez utiliser :

```
@dependabot rebase          # Rebaser la PR
@dependabot recreate        # Recréer la PR
@dependabot merge           # Merger la PR
@dependabot squash and merge # Squash et merger
@dependabot cancel merge    # Annuler le merge automatique
@dependabot close           # Fermer la PR
@dependabot ignore this dependency # Ignorer cette dépendance
@dependabot ignore this major version # Ignorer cette version majeure
```

## 📈 Métriques

### Objectifs

- 🎯 Zéro vulnérabilités de sécurité
- 🎯 Dépendances à jour (patches/minor)
- 🎯 Temps de réponse < 1 semaine

### Surveillance

- GitHub Security tab : Vulnérabilités détectées
- Dependabot alerts : Mises à jour disponibles
- Quality pipeline : Tests passent automatiquement

## 🔗 Ressources

- [Dependabot documentation](https://docs.github.com/en/code-security/dependabot)
- [Semver specification](https://semver.org/)
- [Package security best practices](https://docs.npmjs.com/packages-and-modules/securing-your-code)

---

**Dernière mise à jour** : 26 octobre 2025
