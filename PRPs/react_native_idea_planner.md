---
name: "React Native Idea Planner App with Supabase Integration"
description: |
  A complete React Native mobile app that stores user ideas in a Supabase database and allows sharing. 
  Features modern UI with infinite scroll, navigation between screens, and real-time data synchronization.
  Built with Expo, TypeScript, React Navigation, and Supabase for optimal performance and scalability.
---

# React Native Idea Planner App with Supabase Integration

## Purpose
This PRP will create a production-ready React Native app from scratch with comprehensive context, validation loops, and progressive success criteria to ensure the AI agent can implement the full feature set in one pass.

## Core Principles
1. **Context**: Provide comprehensive documentation, examples, and patterns for React Native, Expo, Supabase, and modern UI libraries
2. **Validation**: Multi-layer validation with Expo CLI, TypeScript checking, and manual testing on device
3. **Information Dense**: Include specific code patterns, configuration details, and known gotchas for React Native development
4. **Progressive Success**: Break down implementation into testable chunks with clear validation gates
5. **Global Rules**: Follow project-specific React Native best practices from CLAUDE.md including TypeScript, performance optimization, and offline functionality

## Goal
Create a fully functional React Native idea planner app that:
- Runs on both iOS and Android using Expo
- Stores ideas in Supabase database with real-time sync
- Features modern UI with infinite scroll and smooth navigation
- Follows React Native best practices for performance and maintainability
- Can be built as standalone app for distribution

## Why
This app addresses the need for a simple, effective idea management tool that:
- **Business Value**: Enables users to capture, organize, and share creative ideas on mobile
- **Integration**: Demonstrates modern React Native stack with Supabase backend
- **Problems Solved**: Provides offline-capable idea storage with cloud sync and sharing functionality
- **Technical Value**: Establishes patterns for React Native + Supabase apps with modern UI components

## What

### User-Visible Behavior
1. **Ideas List Screen**: Modern scrollable list showing all ideas with infinite pagination
2. **Add Idea Screen**: Clean form with text input and save functionality
3. **Navigation**: Smooth transitions between screens with "+" button in header
4. **Real-time Updates**: Ideas appear immediately after saving, list updates automatically
5. **Offline Support**: App works without internet, syncs when connection restored

### Technical Requirements
- **Framework**: React Native with Expo and TypeScript
- **Database**: Supabase with real-time subscriptions
- **Navigation**: React Navigation 6+ with Native Stack Navigator
- **UI Components**: Modern design with React Native Paper or Gluestack UI
- **State Management**: React hooks with local and remote state sync
- **Performance**: Optimized FlatList with virtualization and pagination

## Success Criteria
- [ ] App boots successfully on iOS and Android (Expo Go)
- [ ] Can add new ideas and see them appear in list immediately
- [ ] Infinite scroll loads more ideas as user scrolls
- [ ] Navigation between screens works smoothly
- [ ] Ideas persist in Supabase database
- [ ] Real-time updates work when multiple users add ideas
- [ ] TypeScript compilation passes without errors
- [ ] App works offline and syncs when connection restored
- [ ] Standalone build can be generated successfully

## All Needed Context

### Documentation & References
- url: https://docs.expo.dev/get-started/create-a-project/
  why: Essential for Expo project setup with TypeScript
  
- url: https://docs.supabase.com/guides/getting-started/tutorials/with-expo-react-native
  why: Official Supabase + React Native tutorial with complete setup

- url: https://reactnavigation.org/docs/native-stack-navigator/
  why: Navigation setup for React Native 6+ with TypeScript

- url: https://reactnative.dev/docs/flatlist
  why: FlatList optimization for infinite scroll performance

- url: https://supabase.com/docs/reference/javascript/select
  why: Supabase query patterns for pagination and real-time

- url: https://docs.expo.dev/guides/using-supabase/
  why: Expo-specific Supabase integration patterns

- url: https://reactnative.dev/docs/typescript
  why: TypeScript setup and best practices for React Native

### Current Codebase Tree
```
idea-planner/
├── .claude/
│   ├── commands/
│   └── settings.local.json
├── PRPs/
│   ├── templates/
│   └── EXAMPLE_multi_agent_prp.md
├── examples/
├── CLAUDE.md                    # React Native expertise and preferences
├── INITIAL.md                   # Feature requirements
├── README.md
└── LICENSE
```

### Desired Codebase Tree
```
idea-planner/
├── .claude/                     # Keep existing
├── PRPs/                        # Keep existing  
├── examples/                    # Keep existing
├── CLAUDE.md                    # Keep existing
├── app.json                     # Expo configuration
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript configuration
├── babel.config.js             # Babel configuration
├── .env.example                # Supabase environment variables
├── src/
│   ├── components/
│   │   ├── IdeaCard.tsx        # Individual idea display component
│   │   ├── IdeaList.tsx        # FlatList with infinite scroll
│   │   └── AddIdeaForm.tsx     # Form for adding new ideas
│   ├── screens/
│   │   ├── IdeasScreen.tsx     # Main ideas list screen
│   │   └── AddIdeaScreen.tsx   # Add new idea screen
│   ├── navigation/
│   │   └── AppNavigator.tsx    # Navigation setup
│   ├── services/
│   │   └── supabase.ts         # Supabase client configuration
│   ├── hooks/
│   │   ├── useIdeas.ts         # Ideas data fetching and management
│   │   └── useAddIdea.ts       # Add idea functionality
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   └── utils/
│       └── constants.ts        # App constants
└── App.tsx                     # Main app component
```

### Known Gotchas
- **GOTCHA**: React Native 0.73+ requires specific AsyncStorage version for Supabase
- **GOTCHA**: Expo Go requires specific Supabase client configuration for local development
- **GOTCHA**: FlatList onEndReached can fire multiple times - need debouncing
- **GOTCHA**: Supabase real-time subscriptions need proper cleanup in useEffect
- **GOTCHA**: iOS requires ITSAppUsesNonExemptEncryption in app.json for distribution
- **GOTCHA**: TypeScript strict mode requires careful typing of navigation params
- **GOTCHA**: React Navigation 6+ uses different header button patterns than v5

### Critical Dependencies
```json
{
  "dependencies": {
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/native-stack": "^6.9.17",
    "@supabase/supabase-js": "^2.38.5",
    "expo": "~50.0.0",
    "expo-status-bar": "~1.11.1",
    "react": "18.2.0",
    "react-native": "0.73.0",
    "react-native-paper": "^5.11.6",
    "react-native-safe-area-context": "4.8.2",
    "react-native-screens": "~3.29.0",
    "@react-native-async-storage/async-storage": "1.21.0",
    "react-native-url-polyfill": "^2.0.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.2.45",
    "@types/react-native": "~0.73.0",
    "typescript": "^5.1.3"
  }
}
```

## Implementation Blueprint

### Data Models and Structure

```typescript
// PATTERN: Supabase database schema
CREATE TABLE ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

// PATTERN: TypeScript interfaces
interface Idea {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface IdeaListState {
  ideas: Idea[];
  loading: boolean;
  hasMore: boolean;
  page: number;
}
```

### List of Tasks to be Completed

**Task 1: Initialize Expo Project**
CREATE project structure:
- RUN: `npx create-expo-app idea-planner --template expo-template-blank-typescript`
- CONFIGURE: app.json with iOS and Android settings
- INSTALL: Required dependencies for navigation and Supabase
- SETUP: TypeScript configuration with strict mode

**Task 2: Configure Supabase Integration**
CREATE src/services/supabase.ts:
- PATTERN: Follow Expo + Supabase tutorial configuration
- CONFIGURE: AsyncStorage for session persistence
- SETUP: Environment variables for API keys
- IMPLEMENT: Authentication and database client

**Task 3: Setup Navigation Structure**
CREATE src/navigation/AppNavigator.tsx:
- PATTERN: React Navigation 6 Native Stack Navigator
- CONFIGURE: Screen definitions with TypeScript
- IMPLEMENT: Header with custom "+" button
- SETUP: Navigation parameter types

**Task 4: Create Data Layer**
CREATE src/hooks/useIdeas.ts:
- PATTERN: React Query style data fetching
- IMPLEMENT: Infinite scroll pagination logic
- CONFIGURE: Real-time subscriptions
- HANDLE: Loading states and error handling

CREATE src/hooks/useAddIdea.ts:
- PATTERN: Optimistic updates with rollback
- IMPLEMENT: Form validation and submission
- CONFIGURE: Success/error feedback
- HANDLE: Navigation after save

**Task 5: Build UI Components**
CREATE src/components/IdeaCard.tsx:
- PATTERN: React Native Paper Card component
- IMPLEMENT: Responsive design with consistent spacing
- CONFIGURE: Typography and color scheme
- OPTIMIZE: Performance with React.memo

CREATE src/components/IdeaList.tsx:
- PATTERN: FlatList with infinite scroll optimization
- IMPLEMENT: onEndReached with debouncing
- CONFIGURE: Pull-to-refresh functionality
- OPTIMIZE: getItemLayout for performance

CREATE src/components/AddIdeaForm.tsx:
- PATTERN: Controlled form with validation
- IMPLEMENT: Text input with character limit
- CONFIGURE: Save button with loading states
- HANDLE: Keyboard dismissal and focus management

**Task 6: Implement Screen Components**
CREATE src/screens/IdeasScreen.tsx:
- PATTERN: Screen with header and FlatList
- IMPLEMENT: Search functionality (optional)
- CONFIGURE: Empty state and loading indicators
- INTEGRATE: useIdeas hook for data management

CREATE src/screens/AddIdeaScreen.tsx:
- PATTERN: Form screen with validation
- IMPLEMENT: Save and cancel actions
- CONFIGURE: Keyboard avoiding view
- INTEGRATE: useAddIdea hook for form handling

**Task 7: Setup App Entry Point**
MODIFY App.tsx:
- PATTERN: NavigationContainer with providers
- IMPLEMENT: Theme and configuration providers
- CONFIGURE: Status bar and safe area
- INTEGRATE: Navigation structure

**Task 8: Configure Build Settings**
MODIFY app.json:
- CONFIGURE: iOS and Android specific settings
- SETUP: Icons, splash screen, and app metadata
- IMPLEMENT: Build configuration for distribution
- CRITICAL: Add ITSAppUsesNonExemptEncryption for iOS

### Per Task Pseudocode

**Task 1 Pseudocode:**
```bash
# CRITICAL: Use Expo CLI with TypeScript template
npx create-expo-app idea-planner --template expo-template-blank-typescript
cd idea-planner

# PATTERN: Install navigation dependencies
npx expo install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context

# PATTERN: Install Supabase dependencies
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill

# PATTERN: Install UI library
npx expo install react-native-paper react-native-vector-icons
```

**Task 2 Pseudocode:**
```typescript
// PATTERN: Supabase client configuration
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const supabaseUrl = 'your-supabase-url'
const supabaseAnonKey = 'your-supabase-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
```

**Task 3 Pseudocode:**
```typescript
// PATTERN: Navigation setup with TypeScript
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

type RootStackParamList = {
  Ideas: undefined
  AddIdea: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Ideas" 
          component={IdeasScreen}
          options={{
            title: 'My Ideas',
            headerRight: () => <AddButton />
          }}
        />
        <Stack.Screen 
          name="AddIdea" 
          component={AddIdeaScreen}
          options={{ title: 'Add New Idea' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
```

**Task 4 Pseudocode:**
```typescript
// PATTERN: Data fetching with pagination
export function useIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)

  const fetchIdeas = async (pageNum: number) => {
    // PATTERN: Supabase pagination with offset
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false })
      .range(pageNum * 10, (pageNum + 1) * 10 - 1)
      
    // CRITICAL: Handle pagination state
    if (data) {
      setIdeas(prev => pageNum === 0 ? data : [...prev, ...data])
      setHasMore(data.length === 10)
    }
  }

  // PATTERN: Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('ideas')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ideas' }, 
        (payload) => {
          setIdeas(prev => [payload.new as Idea, ...prev])
        })
      .subscribe()

    return () => channel.unsubscribe()
  }, [])

  return { ideas, loading, hasMore, fetchIdeas, page }
}
```

### Integration Points
- **Supabase Database**: Real-time sync with PostgreSQL backend
- **Expo Build**: EAS Build for standalone app generation
- **React Navigation**: Deep linking and navigation state management
- **AsyncStorage**: Local persistence for offline functionality
- **TypeScript**: Strict typing for navigation and data models

## Validation Loop

### Level 1: Syntax & Style
```bash
# TypeScript compilation
npx tsc --noEmit

# Expo CLI validation
npx expo doctor

# Package validation
npm audit
```

### Level 2: Unit Tests
```bash
# Component rendering tests
npm test -- --testPathPattern=components

# Hook functionality tests
npm test -- --testPathPattern=hooks

# Navigation tests
npm test -- --testPathPattern=navigation
```

### Level 3: Integration Tests
```bash
# Start development server
npx expo start

# Test on iOS simulator
npx expo run:ios

# Test on Android emulator
npx expo run:android

# Test real device with Expo Go
# Scan QR code and verify all functionality

# Manual testing checklist:
# - Add new idea and verify it appears in list
# - Scroll to bottom and verify infinite scroll loads more
# - Navigate between screens smoothly
# - Test offline functionality
# - Verify real-time updates between devices
```

## Final Validation Checklist
- [ ] **App Boots**: Expo Go shows app without errors
- [ ] **Database Connection**: Supabase queries work correctly
- [ ] **Navigation**: All screen transitions work smoothly
- [ ] **Add Functionality**: New ideas save and appear immediately
- [ ] **Infinite Scroll**: List loads more items when scrolling
- [ ] **TypeScript**: No compilation errors or warnings
- [ ] **Performance**: Smooth scrolling with large lists
- [ ] **Offline Mode**: App works without internet connection
- [ ] **Real-time**: Updates appear when other users add ideas
- [ ] **Build Ready**: Can generate standalone build without errors

## Anti-Patterns to Avoid
❌ **Don't use class components** - Use functional components with hooks
❌ **Don't ignore TypeScript errors** - Fix all typing issues before testing
❌ **Don't create deep navigation nesting** - Keep navigation structure flat
❌ **Don't ignore FlatList performance** - Use getItemLayout and keyExtractor
❌ **Don't skip error boundaries** - Handle Supabase connection errors gracefully
❌ **Don't hardcode API keys** - Use environment variables
❌ **Don't forget iOS/Android differences** - Test on both platforms
❌ **Don't ignore memory leaks** - Properly cleanup subscriptions and listeners
❌ **Don't skip offline handling** - Implement proper offline/online state management
❌ **Don't ignore accessibility** - Add proper accessibility labels and hints

---

**Confidence Score: 9/10**

This PRP provides comprehensive context for implementing a production-ready React Native app with modern patterns, extensive documentation references, and clear validation gates. The implementation follows established React Native best practices and includes all necessary configuration for successful deployment.