// PATTERN: Add new idea screen with form, navigation and i18n
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { AddIdeaForm } from '../components/AddIdeaForm';
import { useAddIdea } from '../hooks/useAddIdea';
import { RootStackParamList, IdeaFormData } from '../types';

type AddIdeaScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddIdea'>;

export const AddIdeaScreen: React.FC = () => {
  const navigation = useNavigation<AddIdeaScreenNavigationProp>();
  const { addIdea, loading, error } = useAddIdea();
  const [successVisible, setSuccessVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const { t } = useTranslation();

  // PATTERN: Handle form submission
  const handleSubmit = async (data: IdeaFormData): Promise<boolean> => {
    const success = await addIdea(data.title, data.description, data.rating);
    
    if (success) {
      setSuccessVisible(true);
      // PATTERN: Navigate back after successful save
      setTimeout(() => {
        setSuccessVisible(false);
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate('MainTabs');
        }
      }, 1500);
      return true;
    } else {
      setErrorVisible(true);
      return false;
    }
  };

  // PATTERN: Show error snackbar when error occurs
  React.useEffect(() => {
    if (error) {
      setErrorVisible(true);
    }
  }, [error]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <AddIdeaForm
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      </View>

      <Snackbar
        visible={successVisible}
        onDismiss={() => setSuccessVisible(false)}
        duration={1500}
      >
        {`${t('saveIdea')} ✓`}
      </Snackbar>

      <Snackbar
        visible={errorVisible}
        onDismiss={() => setErrorVisible(false)}
        duration={4000}
        action={{
          label: t('retry'),
          onPress: () => {
            setErrorVisible(false);
          },
        }}
      >
        {error || t('saveError')}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});