# Configuration Google AdMob pour MinDrop

## 📋 Étapes de Configuration

### 1. Créer un compte AdMob
1. Allez sur https://admob.google.com/
2. Connectez-vous avec votre compte Google
3. Acceptez les conditions d'utilisation

### 2. Créer votre application
1. Cliquez sur "Applications" → "Ajouter une application"
2. Sélectionnez "Non" pour "L'application est-elle publiée sur Google Play ou l'App Store ?"
3. Entrez les informations :
   - **Nom de l'application** : MinDrop
   - **Plateforme** : iOS et Android
   - **Bundle ID** : com.docmaillou.mindrop

### 3. Créer les unités publicitaires

#### Android
**App ID** : `ca-app-pub-uZFHRE3JrBx0do6dLgFgTA~APP_ANDROID_ID`

Créez ces unités publicitaires :
- **Interstitielle** : `ca-app-pub-uZFHRE3JrBx0do6dLgFgTA/INTERSTITIAL_ANDROID_ID`
- **Bannière** : `ca-app-pub-uZFHRE3JrBx0do6dLgFgTA/BANNER_ANDROID_ID`

#### iOS  
**App ID** : `ca-app-pub-uZFHRE3JrBx0do6dLgFgTA~APP_IOS_ID`

Créez ces unités publicitaires :
- **Interstitielle** : `ca-app-pub-uZFHRE3JrBx0do6dLgFgTA/INTERSTITIAL_IOS_ID`
- **Bannière** : `ca-app-pub-uZFHRE3JrBx0do6dLgFgTA/BANNER_IOS_ID`

### 4. Mettre à jour la configuration

#### A. Mettre à jour app.json
```json
{
  "expo": {
    "plugins": [
      [
        "expo-ads-admob",
        {
          "androidAppId": "ca-app-pub-uZFHRE3JrBx0do6dLgFgTA~APP_ANDROID_ID",
          "iosAppId": "ca-app-pub-uZFHRE3JrBx0do6dLgFgTA~APP_IOS_ID"
        }
      ]
    ]
  }
}
```

#### B. Mettre à jour src/config/adsConfig.ts
Remplacez les IDs de production :
```typescript
PRODUCTION_IDS: {
  INTERSTITIAL_ANDROID: 'ca-app-pub-uZFHRE3JrBx0do6dLgFgTA/INTERSTITIAL_ANDROID_ID',
  INTERSTITIAL_IOS: 'ca-app-pub-uZFHRE3JrBx0do6dLgFgTA/INTERSTITIAL_IOS_ID',
  BANNER_ANDROID: 'ca-app-pub-uZFHRE3JrBx0do6dLgFgTA/BANNER_ANDROID_ID',
  BANNER_IOS: 'ca-app-pub-uZFHRE3JrBx0do6dLgFgTA/BANNER_IOS_ID',
},
```

### 5. Test et Déploiement

#### Mode Développement
- Les IDs de test sont utilisés automatiquement (`USE_TEST_IDS: true`)
- Publicités de test s'affichent correctement

#### Mode Production
1. Changez `USE_TEST_IDS: false` dans adsConfig.ts
2. Construisez l'application avec EAS Build
3. Testez sur des appareils réels
4. Soumettez à AdMob pour approbation

### 6. Approbation AdMob

#### Prérequis
- Application déployée sur les stores
- Minimum 1000 utilisateurs actifs
- Contenu conforme aux politiques AdMob
- Implémentation correcte des publicités

#### Processus
1. Soumettez l'application sur App Store / Play Store
2. AdMob examinera automatiquement votre app
3. Approbation généralement en 24-48h
4. Activez les publicités réelles

## 🔧 Configuration Actuelle

### IDs de Test (Actuellement utilisés)
```
Android Interstitielle: ca-app-pub-3940256099942544/1033173712
iOS Interstitielle: ca-app-pub-3940256099942544/4411468910
Android Bannière: ca-app-pub-3940256099942544/6300978111
iOS Bannière: ca-app-pub-3940256099942544/2934735716
```

### Comportement des Publicités
- **Fréquence** : À chaque ajout d'idée
- **Type** : Interstitielle plein écran
- **Durée** : 15-30 secondes (selon la publicité)
- **Bannières** : Écran des paramètres

## 🎯 Optimisation des Revenus

### Emplacements Recommandés
1. **Interstitielles** :
   - ✅ Avant ajout d'idée (implémenté)
   - 🔄 Après suppression d'idée (optionnel)
   - 🔄 Toutes les 5 modifications (optionnel)

2. **Bannières** :
   - ✅ Écran des paramètres (implémenté)
   - 🔄 En bas de la liste d'idées (optionnel)

### Métriques à Surveiller
- **Fill Rate** : % de demandes publicitaires comblées
- **eCPM** : Revenus par 1000 impressions  
- **CTR** : Taux de clic
- **Retention** : Impact sur la rétention utilisateurs

## 🔍 Debug et Résolution de Problèmes

### Logs Utiles
```
AdMob initialized in test mode
Interstitial ad loaded successfully
Showing interstitial ad before adding idea...
```

### Problèmes Courants
1. **Publicités ne s'affichent pas** :
   - Vérifiez les IDs d'unités publicitaires
   - Assurez-vous d'être en mode test
   - Vérifiez la connexion internet

2. **Erreur "Ad failed to load"** :
   - IDs incorrects
   - Quota dépassé (mode test)
   - Problème réseau

3. **Application refusée par AdMob** :
   - Contenu non conforme
   - Pas assez d'utilisateurs
   - Implémentation incorrecte

## 📈 Revenus Estimés

### Estimation Conservative
- **Utilisateurs actifs** : 1000/jour
- **Ajouts d'idées** : 3/utilisateur/jour
- **Impressions** : 3000/jour
- **eCPM** : $1-3 (selon la région)
- **Revenus** : $3-9/jour

### Potentiel d'Optimisation
- Ajouter plus d'emplacements publicitaires
- Implémenter des publicités récompensées
- Optimiser la fréquence selon l'engagement
- Tester différents formats de bannières