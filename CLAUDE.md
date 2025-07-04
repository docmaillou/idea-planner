# General Expertise
- You are an expert in TypeScript, React Native, Expo, and Mobile App Development.
- User wants to build a React Native POS app that replicates Clover machine functionality.
- User prefers standalone app builds that can be used directly on phone and shared with others, indicating a preference for distribution-ready builds over development-only builds.
- User prefers to run the app offline without API connections or development servers for local testing.
- User prefers pushing branches to EAS for mobile testing rather than building standalone apps locally.
- User prefers standalone app builds and Expo Go builds that can run independently without requiring local development server console sessions.
- User prefers preview builds without development settings over development builds for mobile deployment.
- User prefers to run the app with `expo start` for development rather than requiring native builds when possible.
- User prefers to implement all PRD requirements first before starting the Expo development server with npx expo start.

# POS App Functionality
- POS app should include a tip page after the amount selection step in the payment flow.
- POS app should support manual tip entry functionality where users can input a fixed tip amount that gets added to the total.
- POS app should calculate total amount including tip, generate invoices after transactions, and provide email sending functionality for invoices.
- POS app should support contactless payments where customers can tap their phone/card to transfer money directly to merchant accounts via NFC technology.
- POS app should support touchless payments via phone contacts.
- POS app should support peer-to-peer payment functionality where another phone can act as a payment card for direct transfers in the POS app.
- User prefers to test real Stripe integration with actual API keys in development builds rather than using mock implementations.
- User prefers builds that work with real Stripe integration using their actual API key rather than mock implementations.
- User prefers to skip payment method selection screen and go directly to contactless NFC payment reception with 30-second timeout in POS app.
- User prefers to keep the 30-second timeout in the POS payment flow to allow time for peer-to-peer payment detection rather than launching Apple Pay immediately.
- User prefers POS payment screens to wait 30 seconds for actual payment instead of faking success, and cancel transaction if no payment is received within that timeframe.

# Code Style and Structure
- Write concise, type-safe TypeScript code.
- Use functional components and hooks over class components.
- Ensure components are modular, reusable, and maintainable.
- Organize files by feature, grouping related components, hooks, and styles.

# Naming Conventions
- Use camelCase for variable and function names (e.g., `isFetchingData`, `handleUserInput`).
- Use PascalCase for component names (e.g., `UserProfile`, `ChatScreen`).
- Directory names should be lowercase and hyphenated (e.g., `user-profile`, `chat-screen`).

# TypeScript Usage
- Use TypeScript for all components, favoring interfaces for props and state.
- Enable strict typing in `tsconfig.json`.
- Avoid using `any`; strive for precise types.
- Utilize `React.FC` for defining functional components with props.

# Performance Optimization
- Minimize `useEffect`, `useState`, and heavy computations inside render methods.
- Use `React.memo()` for components with static props to prevent unnecessary re-renders.
- Optimize FlatLists with props like `removeClippedSubviews`, `maxToRenderPerBatch`, and `windowSize`.
- Use `getItemLayout` for FlatLists when items have a consistent size to improve performance.
- Avoid anonymous functions in `renderItem` or event handlers to prevent re-renders.

# UI and Styling
- Use consistent styling, either through `StyleSheet.create()` or Styled Components.
- Ensure responsive design by considering different screen sizes and orientations.
- Optimize image handling using libraries designed for React Native, like `react-native-fast-image`.

# Best Practices
- Follow React Native's threading model to ensure smooth UI performance.
- Utilize Expo's EAS Build and Updates for continuous deployment and Over-The-Air (OTA) updates.
- Use React Navigation for handling navigation and deep linking with best practices.
- `expo publish` command is deprecated in local CLI and should use `eas update` instead for publishing apps.

# Offline Functionality
- User prefers to run the app offline without API connections or development servers for local testing.

# iOS App Store Requirements
- iOS apps require ITSAppUsesNonExemptEncryption boolean in app.json ios.infoPlist section for App Store Connect testing.