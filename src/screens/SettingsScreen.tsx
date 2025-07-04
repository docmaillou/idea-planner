// PATTERN: Settings screen with language selection and theme selection
import React from "react";
import { View, StyleSheet } from "react-native";
import { List, useTheme, Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../hooks/useTheme";
import { ThemeSelector } from "../components/ThemeSelector";
import { AdBanner } from "../components/AdBanner";

export const SettingsScreen: React.FC = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const { currentTheme, availableThemes, setTheme } = useAppTheme();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <List.Section>
          <List.Subheader>{t("theme")}</List.Subheader>
          <ThemeSelector
            themes={availableThemes}
            currentTheme={currentTheme}
            onThemeSelect={setTheme}
          />
        </List.Section>

        <Divider style={styles.divider} />

        <List.Section>
          <List.Subheader>{t("language")}</List.Subheader>

          <List.Item
            title={t("english")}
            left={(props) => <List.Icon {...props} icon="translate" />}
            right={(props) =>
              i18n.language === "en" ? (
                <List.Icon
                  {...props}
                  icon="check"
                  color={theme.colors.primary}
                />
              ) : null
            }
            onPress={() => changeLanguage("en")}
          />

          <List.Item
            title={t("french")}
            left={(props) => <List.Icon {...props} icon="translate" />}
            right={(props) =>
              i18n.language === "fr" ? (
                <List.Icon
                  {...props}
                  icon="check"
                  color={theme.colors.primary}
                />
              ) : null
            }
            onPress={() => changeLanguage("fr")}
          />
        </List.Section>

        <Divider style={styles.divider} />

        <List.Section>
          <List.Subheader>{t("about")}</List.Subheader>

          <List.Item
            title={t("version")}
            description="1.0.3"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
        </List.Section>
      </View>
      
      <AdBanner size="smartBannerPortrait" style={styles.adBanner} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  divider: {
    marginVertical: 12,
  },
  adBanner: {
    marginTop: 'auto',
  },
});
