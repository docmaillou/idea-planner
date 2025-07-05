import { useState, useEffect, useCallback } from 'react';
import { adService } from '../services/adService';

export interface UseAdsResult {
  showInterstitialAd: () => Promise<boolean>;
  isAdReady: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAds(): UseAdsResult {
  const [isAdReady, setIsAdReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialiser le service publicitaire
  useEffect(() => {
    const initializeAds = async () => {
      try {
        setIsLoading(true);
        console.log('Initializing ad service...');
        await adService.initialize();
        console.log('Ad service initialized');
        adService.setupAdEvents();
        const ready = adService.isInterstitialReady();
        console.log('Ad ready status:', ready);
        setIsAdReady(ready);
      } catch (err) {
        console.error('Failed to initialize ads:', err);
        setError('Failed to initialize ads');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAds();
  }, []);

  // Vérifier périodiquement si une publicité est prête
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAdReady(adService.isInterstitialReady());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Afficher une publicité interstitielle
  const showInterstitialAd = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const success = await adService.showInterstitialAd();
      
      if (!success) {
        setError('Failed to show ad');
      }
      
      return success;
    } catch (err) {
      console.error('Error showing interstitial ad:', err);
      setError('Error showing ad');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    showInterstitialAd,
    isAdReady,
    isLoading,
    error,
  };
}