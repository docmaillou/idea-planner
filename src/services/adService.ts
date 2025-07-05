import { Platform } from 'react-native';
import { ADS_CONFIG } from '../config/adsConfig';

// Only import ads on mobile platforms
let InterstitialAd: any = null;
let TestIds: any = null;
let RewardedAd: any = null;
let MobileAds: any = null;

if (Platform.OS !== 'web') {
  try {
    const ads = require('react-native-google-mobile-ads');
    InterstitialAd = ads.InterstitialAd;
    TestIds = ads.TestIds;
    RewardedAd = ads.RewardedAd;
    MobileAds = ads.MobileAds;
  } catch (error) {
    console.log('Google Mobile Ads not available');
  }
}

class AdService {
  private isInitialized = false;
  private interstitialAd: InterstitialAd | null = null;

  // Initialiser le service publicitaire
  async initialize(): Promise<void> {
    if (Platform.OS === 'web' || !MobileAds) {
      console.log('AdService not available on web platform');
      return;
    }
    
    try {
      await MobileAds().initialize();
      
      if (ADS_CONFIG.SETTINGS.USE_TEST_IDS) {
        console.log('AdMob initialized in test mode');
      }
      
      this.isInitialized = true;
      await this.loadInterstitialAd();
    } catch (error) {
      console.error('Failed to initialize AdService:', error);
    }
  }

  // Charger une publicité interstitielle
  private async loadInterstitialAd(): Promise<void> {
    if (Platform.OS === 'web' || !InterstitialAd) {
      return;
    }
    
    try {
      const adUnitId = ADS_CONFIG.SETTINGS.USE_TEST_IDS 
        ? (Platform.OS === 'ios' ? ADS_CONFIG.TEST_IDS.INTERSTITIAL_IOS : ADS_CONFIG.TEST_IDS.INTERSTITIAL_ANDROID)
        : (Platform.OS === 'ios' ? ADS_CONFIG.PRODUCTION_IDS.INTERSTITIAL_IOS : ADS_CONFIG.PRODUCTION_IDS.INTERSTITIAL_ANDROID);

      this.interstitialAd = InterstitialAd.createForAdRequest(adUnitId);
      await this.interstitialAd.load();
      
      console.log('Interstitial ad loaded successfully');
    } catch (error) {
      console.error('Failed to load interstitial ad:', error);
      this.interstitialAd = null;
    }
  }

  // Afficher une publicité interstitielle
  async showInterstitialAd(): Promise<boolean> {
    if (Platform.OS === 'web') {
      console.log('Ads not available on web platform');
      return false;
    }
    
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      if (!this.interstitialAd) {
        console.log('No interstitial ad loaded, loading now...');
        await this.loadInterstitialAd();
      }

      if (this.interstitialAd && this.interstitialAd.loaded) {
        await this.interstitialAd.show();
        console.log('Interstitial ad shown successfully');
        
        // Précharger la prochaine publicité
        this.interstitialAd = null;
        setTimeout(() => {
          this.loadInterstitialAd();
        }, 1000);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
      return false;
    }
  }

  // Vérifier si une publicité est prête
  isInterstitialReady(): boolean {
    if (Platform.OS === 'web') {
      return false;
    }
    return this.isInitialized && this.interstitialAd?.loaded === true;
  }

  // Obtenir l'ID de bannière
  getBannerAdId(): string {
    if (Platform.OS === 'web') {
      return '';
    }
    return ADS_CONFIG.SETTINGS.USE_TEST_IDS 
      ? (Platform.OS === 'ios' ? ADS_CONFIG.TEST_IDS.BANNER_IOS : ADS_CONFIG.TEST_IDS.BANNER_ANDROID)
      : (Platform.OS === 'ios' ? ADS_CONFIG.PRODUCTION_IDS.BANNER_IOS : ADS_CONFIG.PRODUCTION_IDS.BANNER_ANDROID);
  }

  // Configurer les événements publicitaires
  setupAdEvents(): void {
    // Les événements sont maintenant gérés directement sur l'instance InterstitialAd
    // Ils peuvent être configurés lors de la création de l'annonce
  }
}

// Singleton instance
export const adService = new AdService();