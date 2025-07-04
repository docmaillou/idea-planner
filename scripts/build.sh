#!/bin/bash

# MinDrop Build Script v1.0.2
# Usage: ./scripts/build.sh [preview|production|development]

set -e

BUILD_TYPE=${1:-preview}
VERSION="1.0.2"

echo "🚀 Building MinDrop v$VERSION"
echo "📱 Build type: $BUILD_TYPE"
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI not found. Installing..."
    npm install -g @expo/eas-cli
fi

# Login check
echo "🔐 Checking EAS authentication..."
if ! eas whoami &> /dev/null; then
    echo "Please login to EAS:"
    eas login
fi

# Clear cache
echo "🧹 Clearing Expo cache..."
npx expo install --fix
rm -rf .expo
rm -rf node_modules/.cache

# Install dependencies
echo "📦 Installing dependencies..."
npm install

case $BUILD_TYPE in
  "development")
    echo "🛠️  Starting development server..."
    npx expo start
    ;;
  "preview")
    echo "🔍 Building preview version..."
    eas build --platform all --profile preview --message "v$VERSION: Themes and bug fixes"
    ;;
  "production")
    echo "🎯 Building production version..."
    eas build --platform all --profile production --message "v$VERSION: Production release"
    ;;
  *)
    echo "❌ Invalid build type. Use: development, preview, or production"
    exit 1
    ;;
esac

echo ""
echo "✅ Build process completed!"
echo "📊 Check build status at: https://expo.dev/accounts/docmaillou/projects/mindrop/builds"