#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { TimescaleServer } from './server.js';

async function main() {
  const transport = new StdioServerTransport();
  const server = new Server(
    {
      name: 'mcp-timescale',
      version: '1.0.0',
    }
  );

  const timescaleServer = new TimescaleServer();
  
  // Set up request handlers
  server.setRequestHandler(timescaleServer.listToolsSchema, timescaleServer.handleListTools.bind(timescaleServer));
  server.setRequestHandler(timescaleServer.callToolSchema, timescaleServer.handleCallTool.bind(timescaleServer));

  await server.connect(transport);
  console.error('MCP TimescaleDB server started');
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 