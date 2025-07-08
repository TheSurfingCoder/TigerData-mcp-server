# MCP TimescaleDB Server

A Model Context Protocol (MCP) server for TimescaleDB Cloud that provides secure access to PostgreSQL databases.

## Features

- Secure SSL/TLS connections to TigerData Cloud
- SQL query execution
- Table listing and schema inspection
- Environment-based configuration
- TypeScript implementation

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

3. Configure your TimescaleDB credentials in `.env`:
   ```env
   TIMESCALE_HOST=your-timescale-host.tsdb.cloud.timescale.com
   TIMESCALE_PORT=31316
   TIMESCALE_DB=tsdb
   TIMESCALE_USER=tsdbadmin
   TIMESCALE_PASSWORD=your_password
   TIMESCALE_SSL_MODE=require
   ```

## Building

```bash
npm run build
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## MCP Configuration

Add this to your MCP client configuration:

```json
{
  "mcpServers": {
    "mcp-timescale": {
      "command": "node",
      "args": ["/path/to/your/dist/index.js"],
      "env": {
        "TIMESCALE_HOST": "<your-timescale-host>",
        "TIMESCALE_PORT": "31316",
        "TIMESCALE_DB": "tsdb",
        "TIMESCALE_USER": "tsdbadmin",
        "TIMESCALE_PASSWORD": "<your-password>",
        "TIMESCALE_SSL_MODE": "require"
      }
    }
  }
}
```

## Security

- All database connections use SSL/TLS encryption
- Credentials are managed through environment variables
- Connection timeouts are configurable
- Query timeouts prevent long-running queries

## Available Tools

### `timescale_query`
Execute SQL queries on TimescaleDB Cloud.

**Parameters:**
- `query` (string, required): SQL query to execute
- `timeout` (number, optional): Query timeout in milliseconds

**Example:**
```json
{
  "name": "timescale_query",
  "arguments": {
    "query": "SELECT * FROM users LIMIT 10"
  }
}
```

### `timescale_list_tables`
List all tables in the current database.

**Parameters:**
- `schema` (string, optional): Schema name (defaults to 'public')

**Example:**
```json
{
  "name": "timescale_list_tables",
  "arguments": {
    "schema": "public"
  }
}
```

### `timescale_describe_table`
Get table schema information.

**Parameters:**
- `table` (string, required): Table name
- `schema` (string, optional): Schema name (defaults to 'public')

**Example:**
```json
{
  "name": "timescale_describe_table",
  "arguments": {
    "table": "users",
    "schema": "public"
  }
}
```

## Development

### Project Structure
```
TimescaleMCPServer/
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── .env.example         # Environment variables template
├── src/
│   ├── index.ts         # Main entry point
│   ├── server.ts        # MCP server implementation
│   └── database.ts      # Database client
└── README.md           # This file
```

### Scripts
- `npm run build`: Compile TypeScript to JavaScript
- `npm run start`: Run the compiled server
- `npm run dev`: Run in development mode with hot reload
- `npm run clean`: Remove compiled files

## Troubleshooting

### Connection Issues
1. Verify your TigerData credentials in `.env`
2. Ensure SSL is properly configured
3. Check network connectivity to your TigerData host

### Build Issues
1. Make sure TypeScript is installed: `npm install -g typescript`
2. Clear the dist folder: `npm run clean && npm run build`

### Runtime Issues
1. Check that all environment variables are set
2. Verify the database is accessible
3. Check the server logs for detailed error messages 