# Build Notes - MinDrop v1.0.3

## 📋 Checklist de Build

### ✅ Préparation
- [x] Version mise à jour dans `app.json` (1.0.3)
- [x] Version mise à jour dans `package.json` (1.0.3)
- [x] Version mise à jour dans `SettingsScreen.tsx` (1.0.3)
- [x] CHANGELOG.md mis à jour avec v1.0.3
- [x] Logs de débogage supprimés pour la production

### 📺 Nouvelles fonctionnalités v1.0.3 - Système publicitaire
- [x] Intégration AdMob avec vrais IDs publicitaires
- [x] Publicités interstitielles après sauvegarde d'idée
- [x] Bannières automatiques (30s après lancement, visible 30s)
- [x] Service publicitaire avec gestion d'erreurs
- [x] Hook useAds pour interface simplifiée
- [x] Configuration des IDs de test et production
- [x] Gestion multi-plateforme (mobile uniquement)
- [x] Animations fluides pour les bannières

### 🐛 Corrections v1.0.3
- [x] Erreur web bundling avec react-native-google-mobile-ads
- [x] Correction de l'erreur "adLoading doesn't exist"
- [x] Gestion conditionnelle des modules natifs
- [x] Compatibilité web améliorée

### 📱 Commandes de Build

#### Development Build
```bash
npx expo start
```

#### Preview Build (recommandé pour test ads)
```bash
eas build --platform all --profile preview
```

#### Production Build
```bash
eas build --platform all --profile production
```

#### Update (OTA)
```bash
eas update --branch main --message "v1.0.3: AdMob integration and ads system"
```

### 🧪 Tests à effectuer avant release

#### Fonctionnalités principales
- [ ] Création d'idée avec titre, description et note
- [ ] Modification d'idée existante
- [ ] Suppression d'idée avec confirmation
- [ ] Recherche et filtres fonctionnent
- [ ] Thèmes couleur fonctionnent correctement

#### Nouveau système publicitaire
- [ ] Publicité interstitielle s'affiche après sauvegarde d'idée
- [ ] Bannière automatique apparaît après 30 secondes
- [ ] Bannière disparaît après 30 secondes de visibilité
- [ ] Aucune publicité ne s'affiche sur web
- [ ] Gestion d'erreur si AdMob non disponible
- [ ] IDs de test utilisés en développement
- [ ] IDs de production utilisés en build de production

#### Test des publicités
- [ ] Bannière dans Settings screen (statique)
- [ ] Bannière automatique en bas d'écran (temporisée)
- [ ] Interstitielle après "Sauvegarder" une idée
- [ ] Console logs indiquent le statut des publicités
- [ ] Pas de crash si publicité échoue

#### Plateformes
- [ ] iOS fonctionne avec publicités
- [ ] Android fonctionne avec publicités
- [ ] Web fonctionne sans publicités (fallback)

### 📺 Configuration AdMob

#### IDs de Production
- **Publisher ID**: `pub-7628385859803442`
- **App ID**: `ca-app-pub-7628385859803442~7918714930`
- **Banner ID**: `ca-app-pub-7628385859803442/9203591030`
- **Interstitial ID**: À créer dans AdMob (utilise Banner ID temporairement)

#### Points de vérification AdMob
- [ ] Compte AdMob créé et vérifié
- [ ] App ajoutée dans AdMob console
- [ ] Unités publicitaires créées (Banner + Interstitial)
- [ ] IDs copiés dans `src/config/adsConfig.ts`
- [ ] App IDs ajoutés dans `app.json`

### 🚀 Déploiement

#### App Stores
1. **iOS App Store Connect**
   - Build via EAS Build
   - Upload automatique vers TestFlight
   - Soumission pour review Apple + AdMob

2. **Google Play Console**
   - Build via EAS Build
   - Upload vers Internal Testing
   - Soumission pour review Google + AdMob

#### Processus d'approbation
1. **Build et test** avec IDs de test
2. **Submit à AdMob** pour review (1-7 jours)
3. **Submit aux stores** pour review
4. **Activation des vraies publicités** après approbation AdMob

### 🔍 Points d'attention

#### Problèmes connus
- [ ] Vérifier que les publicités se chargent correctement
- [ ] S'assurer que l'app ne crash pas sans internet
- [ ] Confirmer que les délais de bannière sont respectés
- [ ] Tester le comportement si AdMob est indisponible

#### Performances avec publicités
- [ ] Temps de chargement acceptable avec ads
- [ ] Fluidité de l'interface maintenue
- [ ] Pas de fuite mémoire avec les publicités
- [ ] Bannières ne bloquent pas l'interface

#### Conformité stores
- [ ] Respect des guidelines Apple pour les publicités
- [ ] Respect des policies Google Play pour les ads
- [ ] Déclaration AdMob dans les métadonnées
- [ ] Privacy policy mise à jour (si nécessaire)

### 📝 Notes de Release

**Titre:** MinDrop v1.0.3 - Système publicitaire AdMob

**Description:**
Cette mise à jour intègre un système publicitaire non-intrusif avec AdMob pour soutenir le développement de l'application tout en préservant l'expérience utilisateur.

**Nouveautés:**
• 📺 Système publicitaire AdMob intégré
• 🎯 Publicités interstitielles après sauvegarde d'idées
• 📱 Bannières automatiques temporisées (30s/30s)
• 🌐 Compatibilité web maintenue (sans publicités)
• 🐛 Corrections de bugs et améliorations de stabilité

**Monétisation:**
• Publicités non-intrusives et bien intégrées
• Récompense l'action productive de l'utilisateur
• Support financier pour le développement continu

**Prérequis:**
- iOS 12.0+ / Android 8.0+
- 60MB d'espace libre
- Connexion internet recommandée (pour les publicités)

### 🎯 Stratégie de lancement

#### Phase 1: Test interne
- Build preview avec IDs de test
- Validation du comportement publicitaire
- Tests sur différents appareils

#### Phase 2: AdMob Review
- Soumission app à AdMob pour approbation
- Attente validation (1-7 jours)
- Tests avec vraies publicités

#### Phase 3: Store Release
- Build production avec IDs validés
- Soumission aux app stores
- Communication sur les nouvelles fonctionnalités