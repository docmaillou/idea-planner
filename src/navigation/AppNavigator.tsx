// PATTERN: React Navigation 6 Native Stack Navigator with TypeScript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { IconButton, useTheme } from 'react-native-paper';
import { RootStackParamList } from '../types';
import { IdeasScreen } from '../screens/IdeasScreen';
import { AddIdeaScreen } from '../screens/AddIdeaScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const theme = useTheme();

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
        initialRouteName="Ideas"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.onSurface,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen
          name="Ideas"
          component={IdeasScreen}
          options={({ navigation }) => ({
            title: 'My Ideas',
            headerRight: () => (
              <IconButton
                icon="plus"
                size={24}
                onPress={() => navigation.navigate('AddIdea')}
                iconColor={theme.colors.primary}
              />
            ),
          })}
        />
        <Stack.Screen
          name="AddIdea"
          component={AddIdeaScreen}
          options={{
            title: 'Add New Idea',
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}