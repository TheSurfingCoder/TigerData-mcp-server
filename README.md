# MCP TimescaleDB Server

A Model Context Protocol (MCP) server for TimescaleDB Cloud that provides secure access to PostgreSQL databases.

## Prerequisites

- **Node.js** (v16 or newer recommended)
- **npm** (comes with Node.js)
- **TypeScript** (installed as a dev dependency, but you may want it globally for development: `npm install -g typescript`)

A TimescaleDB Cloud account and credentials are also required.

---

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

> **Note:** If you are using this server as part of an MCP client (see the "MCP Configuration" section below), you do **not** need to run `npm run dev` or `npm start` manually—the MCP client will launch the server automatically using the specified command. The scripts below are for local development and testing only.

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



