// PATTERN: TypeScript interfaces for local storage data models
export interface Idea {
  id: string;
  title: string;
  description?: string;
  rating?: number;
  created_at: string;
  updated_at: string;
}

// PATTERN: State management interfaces
export interface IdeaListState {
  ideas: Idea[];
  loading: boolean;
  hasMore: boolean;
  page: number;
}

// PATTERN: React Navigation types
export type RootStackParamList = {
  MainTabs: undefined;
  AddIdea: undefined;
  IdeaDetail: { ideaId: string };
};

export type TabParamList = {
  IdeasTab: undefined;
  SettingsTab: undefined;
};

// PATTERN: Hook return types
export interface UseIdeasResult {
  ideas: Idea[];
  loading: boolean;
  hasMore: boolean;
  page: number;
  fetchIdeas: (pageNum?: number) => Promise<void>;
  refreshIdeas: () => Promise<void>;
  error: string | null;
}

export interface UseAddIdeaResult {
  addIdea: (title: string, description?: string, rating?: number) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

// PATTERN: Form data types
export interface IdeaFormData {
  title: string;
  description?: string;
  rating?: number;
}

// PATTERN: Local storage response types
export interface LocalStorageResponse<T> {
  data: T | null;
  error: any;
}