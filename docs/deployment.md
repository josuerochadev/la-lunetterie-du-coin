# Deployment Guide - La Lunetterie du Coin

## Hebergement

Le site est deploye sur **Vercel**, qui surveille le repo GitHub et deploie automatiquement.

| Branche     | Environnement     | URL                               |
| ----------- | ----------------- | --------------------------------- |
| `main`      | Production        | https://www.lalunetterieducoin.fr |
| `dev`       | Staging / Preview | URL de preview Vercel             |
| PR branches | Preview           | URL unique par PR                 |

## Strategie de staging

Le branch `dev` sert d'environnement de staging. Chaque push sur `dev` declenche un deploiement preview sur Vercel.

### Configuration Vercel (dashboard)

1. Aller dans **Settings > Git**
2. **Production Branch** : `main`
3. **Preview Branches** : toutes les branches (par defaut)
4. Dans **Settings > Environment Variables**, configurer :
   - `VITE_APP_ENV=staging` pour les preview deployments
   - `VITE_APP_ENV=production` pour le branch `main`
   - `VITE_SITE_LIVE=true` pour tous les environnements

### Variables d'environnement

| Variable                | Description                                            | Requis |
| ----------------------- | ------------------------------------------------------ | ------ |
| `VITE_APP_ENV`          | Environnement (`production`, `staging`, `development`) | Oui    |
| `VITE_SITE_LIVE`        | Active le site (`true`/`false`)                        | Oui    |
| `VITE_SENTRY_DSN`       | DSN Sentry pour le monitoring d'erreurs                | Non    |
| `VITE_ANALYTICS_DOMAIN` | Domaine pour Plausible/analytics                       | Non    |

## Workflow de deploiement

```
feature branch → PR → merge dev → staging preview → merge main → production
```

1. Developper sur un feature branch
2. Ouvrir une PR vers `dev`
3. La CI valide (lint, tests, build, a11y, Lighthouse)
4. Merge dans `dev` → deploiement staging automatique
5. Valider sur staging
6. Merge `dev` dans `main` → deploiement production automatique

## Procedure de rollback

### Rollback instantane via Vercel

1. Aller dans le **dashboard Vercel** du projet
2. Ouvrir l'onglet **Deployments**
3. Trouver le dernier deploiement stable
4. Cliquer sur **"..."** → **"Promote to Production"**
5. Le site revient instantanement a la version precedente

### Rollback via git

```bash
# Identifier le commit problematique
git log --oneline -10

# Creer un commit de revert (prefere a reset pour garder l'historique)
git revert <commit-sha>

# Pousser — Vercel deploie automatiquement
git push origin main
```

### En cas de panne critique

1. **Verifier le statut** : le workflow `uptime-monitor.yml` cree automatiquement une issue GitHub en cas de panne
2. **Rollback immediat** via le dashboard Vercel (methode la plus rapide)
3. **Investiguer** la cause dans les logs Vercel et Sentry
4. **Corriger** sur un feature branch, tester sur staging, puis redeployer

## Monitoring

- **Uptime** : GitHub Actions verifie le site toutes les 5 minutes (`uptime-monitor.yml`)
- **Erreurs** : Sentry (si configure via `VITE_SENTRY_DSN`)
- **Performance** : Lighthouse CI sur chaque PR
- **Alertes** : Issue GitHub automatique en cas de panne detectee
