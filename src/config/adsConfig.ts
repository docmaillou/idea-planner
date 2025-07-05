// Your AdMob Publisher ID (replace with your actual ID)
const PUBLISHER_ID = 'pub-7628385859803442'; // Replace with your AdMob Publisher ID

// AdMob Configuration
export const ADS_CONFIG = {
  // Test Ad Unit IDs (use during development)
  TEST_IDS: {
    INTERSTITIAL_ANDROID: 'ca-app-pub-3940256099942544/1033173712',
    INTERSTITIAL_IOS: 'ca-app-pub-3940256099942544/4411468910',
    BANNER_ANDROID: 'ca-app-pub-3940256099942544/6300978111',
    BANNER_IOS: 'ca-app-pub-3940256099942544/2934735716',
    REWARDED_ANDROID: 'ca-app-pub-3940256099942544/5224354917',
    REWARDED_IOS: 'ca-app-pub-3940256099942544/1712485313',
  },
  
  // Production Ad Unit IDs (replace with your actual IDs from AdMob)
  PRODUCTION_IDS: {
    INTERSTITIAL_ANDROID: 'ca-app-pub-7628385859803442/9203591030', // You'll need to create a separate interstitial unit
    INTERSTITIAL_IOS: 'ca-app-pub-7628385859803442/9203591030',     // You'll need to create a separate interstitial unit  
    BANNER_ANDROID: 'ca-app-pub-7628385859803442/9203591030',       // Your Banner ID from AdMob
    BANNER_IOS: 'ca-app-pub-7628385859803442/9203591030',           // Your Banner ID from AdMob
  },
  
  // App IDs for app.json (replace with your actual App IDs from AdMob)
  APP_IDS: {
    ANDROID: 'ca-app-pub-7628385859803442~7918714930', // Your Android App ID from AdMob
    IOS: 'ca-app-pub-7628385859803442~7918714930',     // Your iOS App ID from AdMob (same for now)
  },
  
  // Paramètres
  SETTINGS: {
    // Utiliser les IDs de test en développement
    USE_TEST_IDS: __DEV__,
    
    // Fréquence des publicités interstitielles
    INTERSTITIAL_FREQUENCY: {
      ADD_IDEA: 1, // Afficher à chaque ajout d'idée
      EDIT_IDEA: 3, // Afficher toutes les 3 modifications
      DELETE_IDEA: 5, // Afficher toutes les 5 suppressions
    },
    
    // Délai entre les publicités (en millisecondes)
    MIN_DELAY_BETWEEN_ADS: 30000, // 30 secondes
    
    // Bannières publicitaires
    SHOW_BANNERS: true,
    BANNER_PLACEMENT: {
      SETTINGS_SCREEN: true,
      IDEA_DETAIL_SCREEN: false, // Ne pas gêner la lecture
      IDEAS_LIST_BOTTOM: false, // Ne pas gêner le FAB
    },
  },
};

// Instructions pour configurer vos vrais IDs AdMob :
/*
1. Créez un compte AdMob sur https://admob.google.com/
2. Créez une nouvelle app avec le bundle ID de votre app
3. Créez des unités publicitaires pour :
   - Interstitiel Android/iOS
   - Bannière Android/iOS
   - Récompensée Android/iOS (optionnel)
4. Remplacez les IDs dans PRODUCTION_IDS avec vos vrais IDs
5. Mettez à jour les APP_IDS dans app.json
6. Testez avec USE_TEST_IDS: false en développement
7. Soumettez votre app à Google AdMob pour approbation
*/