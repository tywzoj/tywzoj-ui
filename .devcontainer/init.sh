#!/bin/bash

# TYWZOJ UI - Initialization Script
echo "🚀 Initializing TYWZOJ UI development environment..."

# 0. Set default shell to zsh for the container
echo "🐚 Setting default shell to zsh..."
sudo chsh "$(id -un)" --shell "/usr/bin/zsh"

# 1. Enable Corepack to ensure Yarn is available
echo "🔧 Enabling Corepack..."
sudo COREPACK_ENABLE_DOWNLOAD_PROMPT=0 corepack enable

# 2. Install dependencies
echo "📥 Installing project dependencies..."
yarn install

# 3. Run i18n script
echo "🌐 Processing localization files..."
yarn i18n

# 4. Build project
echo "🏗️ Building project..."
yarn build

echo "✅ Initialization complete! Development environment is ready."
echo ""
echo "🎉 Available commands:"
echo "   yarn start          - Start development server (port 5055)"
echo "   yarn start:preview  - Start preview server (port 5056)"
echo "   yarn lint           - Run code linting"
echo "   yarn format         - Format code"
echo ""
echo "Happy coding! 🎯"
