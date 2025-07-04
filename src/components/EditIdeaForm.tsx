import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Idea } from '../types';
import { APP_CONSTANTS } from '../utils/constants';
import { RatingSelector } from './RatingSelector';

interface EditIdeaFormProps {
  idea: Idea;
  onSubmit: (data: { title: string; description?: string; rating?: number }) => Promise<boolean>;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

export const EditIdeaForm: React.FC<EditIdeaFormProps> = ({
  idea,
  onSubmit,
  onCancel,
  loading = false,
  error,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [title, setTitle] = useState(idea.title);
  const [description, setDescription] = useState(idea.description || '');
  const [rating, setRating] = useState<number | undefined>(idea.rating);
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  // PATTERN: Form validation
  const validateForm = useCallback(() => {
    let isValid = true;
    
    if (!title.trim()) {
      setTitleError(t('validationError'));
      isValid = false;
    } else if (title.length > APP_CONSTANTS.MAX_TITLE_LENGTH) {
      setTitleError(t('titleTooLong', { max: APP_CONSTANTS.MAX_TITLE_LENGTH }));
      isValid = false;
    } else {
      setTitleError('');
    }

    if (description.length > APP_CONSTANTS.MAX_DESCRIPTION_LENGTH) {
      setDescriptionError(t('descriptionTooLong', { max: APP_CONSTANTS.MAX_DESCRIPTION_LENGTH }));
      isValid = false;
    } else {
      setDescriptionError('');
    }
    
    return isValid;
  }, [title, description, t]);

  // PATTERN: Form submission handler
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    const formData = {
      title: title.trim(),
      description: description.trim() || undefined,
      rating: rating,
    };

    await onSubmit(formData);
  }, [title, description, rating, validateForm, onSubmit]);

  // PATTERN: Character count for title
  const titleCharacterCount = title.length;
  const titleCharacterCountColor = titleCharacterCount > APP_CONSTANTS.MAX_TITLE_LENGTH 
    ? theme.colors.error 
    : theme.colors.outline;

  // PATTERN: Character count for description
  const descriptionCharacterCount = description.length;
  const descriptionCharacterCountColor = descriptionCharacterCount > APP_CONSTANTS.MAX_DESCRIPTION_LENGTH 
    ? theme.colors.error 
    : theme.colors.outline;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <TextInput
            label={t('ideaTitle')}
            placeholder={t('ideaTitlePlaceholder')}
            value={title}
            onChangeText={setTitle}
            error={!!titleError}
            mode="outlined"
            style={styles.input}
            maxLength={APP_CONSTANTS.MAX_TITLE_LENGTH + 50}
            multiline={false}
            returnKeyType="next"
            blurOnSubmit={false}
          />
          <View style={styles.helperContainer}>
            {titleError ? (
              <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
                {titleError}
              </Text>
            ) : null}
            <Text variant="bodySmall" style={[styles.characterCount, { color: titleCharacterCountColor }]}>
              {titleCharacterCount}/{APP_CONSTANTS.MAX_TITLE_LENGTH}
            </Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            label={t('ideaDescription')}
            placeholder={t('ideaDescriptionPlaceholder')}
            value={description}
            onChangeText={setDescription}
            error={!!descriptionError}
            mode="outlined"
            style={styles.input}
            multiline={true}
            numberOfLines={4}
            maxLength={APP_CONSTANTS.MAX_DESCRIPTION_LENGTH + 50}
            returnKeyType="done"
          />
          <View style={styles.helperContainer}>
            {descriptionError ? (
              <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
                {descriptionError}
              </Text>
            ) : null}
            <Text variant="bodySmall" style={[styles.characterCount, { color: descriptionCharacterCountColor }]}>
              {descriptionCharacterCount}/{APP_CONSTANTS.MAX_DESCRIPTION_LENGTH}
            </Text>
          </View>
        </View>

        <RatingSelector
          rating={rating}
          onRatingChange={setRating}
        />

        {error && (
          <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
        )}

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={onCancel}
            disabled={loading}
            style={[styles.button, styles.cancelButton]}
          >
            {t('cancel')}
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading || !title.trim() || titleError !== '' || descriptionError !== ''}
            style={[styles.button, styles.submitButton]}
          >
            {loading ? t('save') + '...' : t('saveChanges')}
          </Button>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 6,
    backgroundColor: '#ffffff',
  },
  helperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    minHeight: 20,
  },
  characterCount: {
    fontSize: 12,
    marginLeft: 'auto',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 4,
  },
  cancelButton: {
    borderColor: '#cbd5e1',
  },
  submitButton: {
    // Uses theme primary color
  },
});