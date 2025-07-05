import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { adService } from "../services/adService";

// Only import ads on mobile platforms
let BannerAd: any = null;
let BannerAdSize: any = null;

if (Platform.OS !== "web") {
  try {
    const ads = require("react-native-google-mobile-ads");
    BannerAd = ads.BannerAd;
    BannerAdSize = ads.BannerAdSize;
  } catch (error) {
    console.log("Google Mobile Ads not available", error);
  }
}

interface AdBannerProps {
  size?: BannerAdSize;
  style?: any;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  size = BannerAdSize?.SMART_BANNER,
  style,
}) => {
  const handleAdFailedToLoad = (error: any) => {
    console.log("Banner ad failed to load:", error);
  };

  const handleAdLoaded = () => {
    console.log("Banner ad loaded successfully");
  };

  // Don't render ads on web
  if (Platform.OS === "web" || !BannerAd) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <BannerAd
        size={size}
        unitId={adService.getBannerAdId()}
        onAdFailedToLoad={handleAdFailedToLoad}
        onAdLoaded={handleAdLoaded}
        requestNonPersonalizedAdsOnly={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    paddingVertical: 8,
  },
});
