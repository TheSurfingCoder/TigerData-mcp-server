import { CallToolRequest, ListToolsRequest, CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { TimescaleClient } from './database.js';

export class TimescaleServer {
  private dbClient: TimescaleClient;
  
  // Schemas for request handlers
  public listToolsSchema = ListToolsRequestSchema;
  public callToolSchema = CallToolRequestSchema;

  constructor() {
    this.dbClient = new TimescaleClient();
  }

  async handleListTools(request: ListToolsRequest) {
    return {
      tools: [
        {
          name: 'timescale_query',
          description: 'Execute SQL queries on TimescaleDB Cloud',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'SQL query to execute',
              },
              timeout: {
                type: 'number',
                description: 'Query timeout in milliseconds (optional)',
              },
            },
            required: ['query'],
          },
        },
        {
          name: 'timescale_list_tables',
          description: 'List all tables in the current database',
          inputSchema: {
            type: 'object',
            properties: {
              schema: {
                type: 'string',
                description: 'Schema name (optional, defaults to public)',
              },
            },
          },
        },
        {
          name: 'timescale_describe_table',
          description: 'Get table schema information',
          inputSchema: {
            type: 'object',
            properties: {
              table: {
                type: 'string',
                description: 'Table name',
              },
              schema: {
                type: 'string',
                description: 'Schema name (optional, defaults to public)',
              },
            },
            required: ['table'],
          },
        },
      ],
    };
  }

  async handleCallTool(request: CallToolRequest) {
    const { name, arguments: args } = request.params;

    if (!args) {
      throw new Error('Arguments are required');
    }

    try {
      switch (name) {
        case 'timescale_query':
          return await this.executeQuery(args.query as string, args.timeout as number | undefined);
        case 'timescale_list_tables':
          return await this.listTables(args.schema as string | undefined);
        case 'timescale_describe_table':
          return await this.describeTable(args.table as string, args.schema as string | undefined);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      throw new Error(`Tool execution failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async executeQuery(query: string, timeout?: number) {
    const result = await this.dbClient.executeQuery(query, timeout);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async listTables(schema: string = 'public') {
    const query = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = $1 
      ORDER BY table_name
    `;
    const result = await this.dbClient.executeQuery(query, undefined, [schema]);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async describeTable(table: string, schema: string = 'public') {
    const query = `
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_schema = $1 AND table_name = $2 
      ORDER BY ordinal_position
    `;
    const result = await this.dbClient.executeQuery(query, undefined, [schema, table]);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
} 