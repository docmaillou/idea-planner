# Changelog

## [1.0.3] - 2025-07-05

### 📺 Système publicitaire AdMob
- **Publicités interstitielles** : Affichage après la sauvegarde d'une idée
- **Bannières automatiques** : Apparition après 30 secondes d'utilisation, visible 30 secondes
- **Intégration AdMob** : Configuration avec de vrais IDs publicitaires
- **Gestion multi-plateforme** : Publicités désactivées sur web, actives sur mobile

### 🐛 Corrections de bugs
- **Erreur web bundling** : Résolution du problème "react-native-google-mobile-ads" sur web
- **Variables non définies** : Correction de l'erreur "adLoading doesn't exist"
- **Compatibilité plateforme** : Gestion conditionelle des modules natifs

### 🔧 Améliorations techniques
- **Service publicitaire** : Nouvelle architecture pour la gestion des ads
- **Hook useAds** : Interface simplifiée pour l'affichage des publicités
- **Configuration centralisée** : Gestion des IDs de test et production dans adsConfig.ts
- **Animations fluides** : Transitions d'apparition/disparition des bannières

### 🎯 Stratégie publicitaire
- **Récompense utilisateur** : Publicité après action productive (sauvegarde)
- **UX non intrusive** : Bannières discrètes en bas d'écran
- **Timing optimisé** : Délais adaptés pour éviter la frustration

## [1.0.2] - 2025-07-04

### ✨ Nouvelles fonctionnalités
- **Système de thèmes couleur** : 5 thèmes disponibles (Bleu, Orange, Vert, Violet, Rose)
- **Sélection de thème** : Interface dans les paramètres avec aperçu des couleurs
- **Persistance des thèmes** : Sauvegarde automatique du thème sélectionné

### 🐛 Corrections de bugs
- **Correction du crash lors du filtrage** : Résolu l'erreur "Cannot read property 'trim' of undefined"
- **Amélioration de la gestion des filtres** : Préservation de searchQuery lors des changements de tri
- **Validation renforcée** : Ajout de vérifications null/undefined pour éviter les crashes

### 🔧 Améliorations techniques
- **Architecture thème** : Nouveau système ThemeProvider avec context React
- **Service de thème** : Gestion centralisée des couleurs et persistance
- **Logs de débogage** : Ajout de logs pour diagnostiquer les problèmes de sauvegarde des notes

### 🎨 Améliorations visuelles
- **Couleurs dynamiques** : Les éléments d'interface s'adaptent au thème sélectionné
- **Cohérence visuelle** : Application uniforme des couleurs dans toute l'application
- **Aperçu des thèmes** : Visualisation des couleurs avant sélection

## [1.0.1] - 2025-07-04

### ✨ Fonctionnalités initiales
- **Gestion d'idées** : Création, modification, suppression d'idées
- **Système de notation** : Échelle de 0 à 10 pour évaluer les idées
- **Recherche et filtres** : Recherche textuelle et tri par date/note
- **Support multilingue** : Français et anglais
- **Interface moderne** : Design Material Design avec React Native Paper
- **Stockage local** : Fonctionnement hors ligne avec AsyncStorage

### 📱 Plateformes
- iOS (iPhone et iPad)
- Android
- Support web basique