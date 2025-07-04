// PATTERN: TypeScript interfaces for Supabase data models
export interface Idea {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
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
  Ideas: undefined;
  AddIdea: undefined;
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
  addIdea: (title: string, description?: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

// PATTERN: Form data types
export interface IdeaFormData {
  title: string;
  description?: string;
}

// PATTERN: Supabase response types
export interface SupabaseResponse<T> {
  data: T | null;
  error: any;
}