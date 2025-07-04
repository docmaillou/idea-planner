// PATTERN: React Navigation with bottom tabs and modal stack
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme, IconButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList, TabParamList } from '../types';
import { IdeasScreen } from '../screens/IdeasScreen';
import { AddIdeaScreen } from '../screens/AddIdeaScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// PATTERN: Bottom Tab Navigator
function TabNavigator() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap;

          if (route.name === 'IdeasTab') {
            iconName = 'lightbulb-outline';
          } else if (route.name === 'SettingsTab') {
            iconName = 'cog-outline';
          } else {
            iconName = 'circle-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="IdeasTab"
        component={IdeasScreen}
        options={{
          title: t('myIdeas'),
          tabBarLabel: t('myIdeas'),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          title: t('settings'),
          tabBarLabel: t('settings'),
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <NavigationContainer theme={{
      dark: false,
      colors: {
        primary: theme.colors.primary,
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.onSurface,
        border: theme.colors.outline,
        notification: theme.colors.primary,
      },
    }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
        />
        <Stack.Screen
          name="AddIdea"
          component={AddIdeaScreen}
          options={({ navigation }) => ({
            title: t('addNewIdea'),
            presentation: 'modal',
            headerShown: true,
            headerStyle: {
              backgroundColor: theme.colors.surface,
            },
            headerTintColor: theme.colors.onSurface,
            headerTitleStyle: {
              fontWeight: '600',
            },
            headerLeft: () => (
              <IconButton
                icon="close"
                size={24}
                onPress={() => navigation.goBack()}
                iconColor={theme.colors.onSurface}
              />
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}