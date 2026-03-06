
#!/bin/bash
set -e

echo "🚀 Running post-creation setup..."

# Verify Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found - check Dockerfile"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Create Claude auth directory in workspace (persists across rebuilds, owned by vscode)
mkdir -p /workspace/.claude-data
ln -sfn /workspace/.claude-data ~/.claude
echo "✅ Claude auth directory: /workspace/.claude-data"

# Install Claude Code globally
echo "📦 Installing Claude Code..."
npm install -g @anthropic-ai/claude-code
echo "✅ Claude Code installed: $(claude --version 2>/dev/null || echo 'installed')"

# Install project dependencies if package.json exists
if [ -f /workspace/package.json ]; then
    echo "📦 Installing project dependencies..."
    npm --prefix /workspace install
fi

# Create helpful aliases
cat >> ~/.bashrc << 'BASHEOF'

# Claude Code alias
alias cc='claude'

# Git aliases
alias gs='git status'
alias gp='git pull'
alias gc='git commit'

BASHEOF

echo ""
echo "✅ Post-creation setup complete!"
echo "📚 Run: claude --help"