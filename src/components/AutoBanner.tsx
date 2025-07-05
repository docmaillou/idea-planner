import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, Animated } from 'react-native';
import { adService } from '../services/adService';

// Only import ads on mobile platforms
let BannerAd: any = null;
let BannerAdSize: any = null;

if (Platform.OS !== 'web') {
  try {
    const ads = require('react-native-google-mobile-ads');
    BannerAd = ads.BannerAd;
    BannerAdSize = ads.BannerAdSize;
  } catch (error) {
    console.log('Google Mobile Ads not available', error);
  }
}

interface AutoBannerProps {
  showDelay?: number; // Délai avant d'afficher la bannière (en ms)
  hideDelay?: number; // Délai avant de cacher la bannière (en ms)
}

export const AutoBanner: React.FC<AutoBannerProps> = ({
  showDelay = 30000, // 30 secondes par défaut
  hideDelay = 30000, // 30 secondes par défaut
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Timer pour afficher la bannière après le délai
    const showTimer = setTimeout(() => {
      if (Platform.OS !== 'web' && BannerAd) {
        setIsVisible(true);
        // Animation d'apparition
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    }, showDelay);

    return () => clearTimeout(showTimer);
  }, [showDelay]);

  useEffect(() => {
    if (isVisible) {
      // Timer pour cacher la bannière après le délai
      const hideTimer = setTimeout(() => {
        // Animation de disparition
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          setIsVisible(false);
        });
      }, hideDelay);

      return () => clearTimeout(hideTimer);
    }
  }, [isVisible, hideDelay]);

  const handleAdLoaded = () => {
    console.log('Auto banner ad loaded successfully');
    setIsAdLoaded(true);
  };

  const handleAdFailedToLoad = (error: any) => {
    console.log('Auto banner ad failed to load:', error);
    setIsAdLoaded(false);
  };

  // Ne pas afficher sur web ou si BannerAd n'est pas disponible
  if (Platform.OS === 'web' || !BannerAd || !isVisible) {
    return null;
  }

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          }],
        }
      ]}
    >
      <View style={styles.bannerContainer}>
        <BannerAd
          size={BannerAdSize.SMART_BANNER}
          unitId={adService.getBannerAdId()}
          onAdLoaded={handleAdLoaded}
          onAdFailedToLoad={handleAdFailedToLoad}
          requestNonPersonalizedAdsOnly={true}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 10, // Pour Android
  },
  bannerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});