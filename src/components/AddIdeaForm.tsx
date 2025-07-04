// PATTERN: Controlled form component with validation
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { IdeaFormData } from '../types';
import { APP_CONSTANTS } from '../utils/constants';

interface AddIdeaFormProps {
  onSubmit: (data: IdeaFormData) => Promise<boolean>;
  loading?: boolean;
  error?: string | null;
}

export const AddIdeaForm: React.FC<AddIdeaFormProps> = ({
  onSubmit,
  loading = false,
  error,
}) => {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');

  // PATTERN: Form validation
  const validateForm = useCallback(() => {
    let isValid = true;
    
    if (!title.trim()) {
      setTitleError('Title is required');
      isValid = false;
    } else if (title.length > APP_CONSTANTS.MAX_TITLE_LENGTH) {
      setTitleError(`Title must be less than ${APP_CONSTANTS.MAX_TITLE_LENGTH} characters`);
      isValid = false;
    } else {
      setTitleError('');
    }
    
    return isValid;
  }, [title]);

  // PATTERN: Form submission handler
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    const formData: IdeaFormData = {
      title: title.trim(),
      description: description.trim() || undefined,
    };

    const success = await onSubmit(formData);
    if (success) {
      // Clear form on success
      setTitle('');
      setDescription('');
      setTitleError('');
    }
  }, [title, description, validateForm, onSubmit]);

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
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <TextInput
            label="Idea Title"
            value={title}
            onChangeText={setTitle}
            error={!!titleError}
            mode="outlined"
            style={styles.input}
            maxLength={APP_CONSTANTS.MAX_TITLE_LENGTH + 50} // Allow slight overflow for validation
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
            label="Description (optional)"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            style={styles.input}
            multiline={true}
            numberOfLines={4}
            maxLength={APP_CONSTANTS.MAX_DESCRIPTION_LENGTH + 50} // Allow slight overflow for validation
            returnKeyType="done"
          />
          <View style={styles.helperContainer}>
            <Text variant="bodySmall" style={[styles.characterCount, { color: descriptionCharacterCountColor }]}>
              {descriptionCharacterCount}/{APP_CONSTANTS.MAX_DESCRIPTION_LENGTH}
            </Text>
          </View>
        </View>

        {error && (
          <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
        )}

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading || !title.trim()}
          style={styles.submitButton}
        >
          {loading ? 'Saving...' : 'Save Idea'}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 4,
  },
  helperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  characterCount: {
    fontSize: 12,
    marginLeft: 'auto',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    marginTop: 16,
  },
});