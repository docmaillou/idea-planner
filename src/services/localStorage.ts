// PATTERN: Local storage service for ideas using AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Idea } from '../types';

const STORAGE_KEY = 'ideas_storage';

// PATTERN: Local storage service with CRUD operations
export const localStorageService = {
  // PATTERN: Get all ideas from storage
  getIdeas: async (): Promise<Idea[]> => {
    try {
      const storedIdeas = await AsyncStorage.getItem(STORAGE_KEY);
      return storedIdeas ? JSON.parse(storedIdeas) : [];
    } catch (error) {
      console.error('Error getting ideas from storage:', error);
      return [];
    }
  },

  // PATTERN: Save ideas to storage
  saveIdeas: async (ideas: Idea[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
    } catch (error) {
      console.error('Error saving ideas to storage:', error);
      throw error;
    }
  },

  // PATTERN: Add a new idea
  addIdea: async (ideaData: Omit<Idea, 'id' | 'created_at' | 'updated_at'>): Promise<Idea> => {
    try {
      const ideas = await localStorageService.getIdeas();
      const newIdea: Idea = {
        ...ideaData,
        id: Date.now().toString(), // Simple ID generation
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const updatedIdeas = [newIdea, ...ideas];
      await localStorageService.saveIdeas(updatedIdeas);
      return newIdea;
    } catch (error) {
      console.error('Error adding idea:', error);
      throw error;
    }
  },

  // PATTERN: Update an existing idea
  updateIdea: async (id: string, updates: Partial<Omit<Idea, 'id' | 'created_at'>>): Promise<Idea> => {
    try {
      const ideas = await localStorageService.getIdeas();
      const ideaIndex = ideas.findIndex(idea => idea.id === id);
      
      if (ideaIndex === -1) {
        throw new Error('Idea not found');
      }
      
      const updatedIdea = {
        ...ideas[ideaIndex],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      
      ideas[ideaIndex] = updatedIdea;
      await localStorageService.saveIdeas(ideas);
      return updatedIdea;
    } catch (error) {
      console.error('Error updating idea:', error);
      throw error;
    }
  },

  // PATTERN: Delete an idea
  deleteIdea: async (id: string): Promise<void> => {
    try {
      const ideas = await localStorageService.getIdeas();
      const filteredIdeas = ideas.filter(idea => idea.id !== id);
      await localStorageService.saveIdeas(filteredIdeas);
    } catch (error) {
      console.error('Error deleting idea:', error);
      throw error;
    }
  },

  // PATTERN: Get paginated ideas
  getIdeasPaginated: async (offset: number, limit: number): Promise<Idea[]> => {
    try {
      const allIdeas = await localStorageService.getIdeas();
      // Sort by created_at descending
      const sortedIdeas = allIdeas.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      return sortedIdeas.slice(offset, offset + limit);
    } catch (error) {
      console.error('Error getting paginated ideas:', error);
      return [];
    }
  },

  // PATTERN: Clear all ideas (for testing)
  clearAll: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing all ideas:', error);
      throw error;
    }
  },
};