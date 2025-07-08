#!/bin/bash

echo "Setting up MCP TimescaleDB Server..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "Please edit .env with your TimescaleDB credentials"
else
    echo ".env file already exists"
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building the project..."
npm run build

echo ""
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env with your TimescaleDB credentials"
echo "2. Test the connection: node test-connection.js"
echo "3. Add the server to your MCP client configuration"
echo ""
echo "Example MCP configuration:"
echo "See mcp-config-example.json for reference" 