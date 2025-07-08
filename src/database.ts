import { Client, ClientConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export class TimescaleClient {
  private client: Client | null = null;
  private config: ClientConfig;

  constructor() {
    this.config = {
      host: process.env.TIMESCALE_HOST,
      port: parseInt(process.env.TIMESCALE_PORT || '31316'),
      database: process.env.TIMESCALE_DB,
      user: process.env.TIMESCALE_USER,
      password: process.env.TIMESCALE_PASSWORD,
      ssl: process.env.TIMESCALE_SSL_MODE === 'require' ? {
        rejectUnauthorized: true,
      } : false,
      connectionTimeoutMillis: parseInt(process.env.TIMESCALE_CONNECT_TIMEOUT || '30000'),
      statement_timeout: parseInt(process.env.TIMESCALE_QUERY_TIMEOUT || '30000'),
    };

    this.validateConfig();
  }

  private validateConfig() {
    const required = ['host', 'database', 'user', 'password'];
    for (const field of required) {
      if (!this.config[field as keyof ClientConfig]) {
        throw new Error(`Missing required environment variable: TIMESCALE_${field.toUpperCase()}`);
      }
    }
  }

  private async getClient(): Promise<Client> {
    if (!this.client) {
      this.client = new Client(this.config);
      await this.client.connect();
    }
    return this.client;
  }

  async executeQuery(query: string, timeout?: number, params?: any[]): Promise<any> {
    const client = await this.getClient();
    
    try {
      const result = await client.query({
        text: query,
        values: params,
        rowMode: 'array', // Return as arrays for better JSON serialization
      });

      return {
        rows: result.rows,
        rowCount: result.rowCount,
        fields: result.fields.map(field => ({
          name: field.name,
          dataTypeID: field.dataTypeID,
        })),
      };
    } catch (error) {
      throw new Error(`Query execution failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.end();
    }
  }
} 