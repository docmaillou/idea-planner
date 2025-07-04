import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Share, Alert } from 'react-native';
import { Text, Button, Card, Chip, IconButton, useTheme, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList, Idea } from '../types';
import { localStorageService } from '../services/localStorage';
import { EditIdeaForm } from '../components/EditIdeaForm';
import { useUpdateIdea } from '../hooks/useUpdateIdea';

type IdeaDetailScreenRouteProp = RouteProp<RootStackParamList, 'IdeaDetail'>;
type IdeaDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'IdeaDetail'>;

export const IdeaDetailScreen: React.FC = () => {
  const route = useRoute<IdeaDetailScreenRouteProp>();
  const navigation = useNavigation<IdeaDetailScreenNavigationProp>();
  const theme = useTheme();
  const { t } = useTranslation();
  const { ideaId } = route.params;

  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { updateIdea, loading: updateLoading, error: updateError } = useUpdateIdea();

  // Load idea data
  useEffect(() => {
    loadIdea();
  }, [ideaId]);

  const loadIdea = async () => {
    try {
      setLoading(true);
      const ideas = await localStorageService.getIdeas();
      const foundIdea = ideas.find(i => i.id === ideaId);
      setIdea(foundIdea || null);
    } catch (error) {
      console.error('Error loading idea:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 0 && rating <= 3) {
      return '#ef4444'; // Rouge
    } else if (rating >= 4 && rating <= 7) {
      return '#f59e0b'; // Jaune/Orange
    } else if (rating >= 8 && rating <= 10) {
      return '#22c55e'; // Vert
    }
    return theme.colors.outline; // Fallback
  };

  const handleShare = async () => {
    if (!idea) return;

    try {
      const message = `💡 ${idea.title}\n\n${idea.description || ''}\n\n${idea.rating !== undefined ? `Note: ${idea.rating}/10` : ''}`;
      await Share.share({
        message,
        title: idea.title,
      });
    } catch (error) {
      console.error('Error sharing idea:', error);
      setSnackbarMessage(t('shareError'));
      setSnackbarVisible(true);
    }
  };

  const handleEdit = async (data: { title: string; description?: string; rating?: number }) => {
    if (!idea) return false;

    const success = await updateIdea(idea.id, data.title, data.description, data.rating);
    
    if (success) {
      // Reload idea to show updated data
      await loadIdea();
      setIsEditing(false);
      setSnackbarMessage(t('ideaUpdated'));
      setSnackbarVisible(true);
    } else if (updateError) {
      setSnackbarMessage(updateError);
      setSnackbarVisible(true);
    }
    
    return success;
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert(
      t('deleteIdea'),
      t('deleteIdeaConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await localStorageService.deleteIdea(ideaId);
              setSnackbarMessage(t('ideaDeleted'));
              setSnackbarVisible(true);
              setTimeout(() => {
                navigation.goBack();
              }, 1000);
            } catch (error) {
              console.error('Error deleting idea:', error);
              setSnackbarMessage(t('deleteError'));
              setSnackbarVisible(true);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text variant="bodyLarge">{t('loading')}...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!idea) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text variant="bodyLarge">{t('ideaNotFound')}</Text>
          <Button mode="contained" onPress={() => navigation.goBack()}>
            {t('goBack')}
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.headerActions}>
          <IconButton
            icon="share-variant"
            size={24}
            onPress={handleShare}
          />
          <IconButton
            icon="pencil"
            size={24}
            onPress={() => setIsEditing(!isEditing)}
          />
          <IconButton
            icon="delete"
            size={24}
            iconColor={theme.colors.error}
            onPress={handleDelete}
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {isEditing ? (
          <Card style={styles.card}>
            <Card.Content>
              <EditIdeaForm
                idea={idea}
                onSubmit={handleEdit}
                onCancel={handleCancelEdit}
                loading={updateLoading}
                error={updateError}
              />
            </Card.Content>
          </Card>
        ) : (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.titleRow}>
                <Text variant="headlineSmall" style={styles.title}>
                  {idea.title}
                </Text>
                {idea.rating !== undefined && idea.rating >= 0 && (
                  <Chip
                    style={[
                      styles.ratingChip,
                      { backgroundColor: getRatingColor(idea.rating) },
                    ]}
                    textStyle={[styles.ratingText, { color: '#ffffff' }]}
                    compact
                  >
                    {idea.rating}
                  </Chip>
                )}
              </View>

              <Text variant="bodySmall" style={[styles.date, { color: theme.colors.outline }]}>
                {t('createdOn')} {formatDate(idea.created_at)}
              </Text>
              {idea.updated_at !== idea.created_at && (
                <Text variant="bodySmall" style={[styles.date, { color: theme.colors.outline }]}>
                  {t('modifiedOn')} {formatDate(idea.updated_at)}
                </Text>
              )}

              {idea.description && (
                <View style={styles.descriptionContainer}>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    {t('description')}
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
                  >
                    {idea.description}
                  </Text>
                </View>
              )}
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerActions: {
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 3,
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    marginRight: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  ratingChip: {
    height: 32,
    borderRadius: 16,
    minWidth: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  date: {
    fontSize: 12,
    marginBottom: 4,
  },
  descriptionContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: '600',
    color: '#0f172a',
  },
  description: {
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  editingMessage: {
    padding: 16,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
});