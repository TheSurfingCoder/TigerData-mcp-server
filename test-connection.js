#!/usr/bin/env node

import dotenv from 'dotenv';
import { TimescaleClient } from './dist/database.js';

dotenv.config();

async function testConnection() {
  try {
    console.log('Testing TimescaleDB connection...');
    
    const client = new TimescaleClient();
    
    // Test a simple query
    const result = await client.executeQuery('SELECT version()');
    console.log('Connection successful!');
    console.log('PostgreSQL version:', result.rows[0][0]);
    
    await client.close();
  } catch (error) {
    console.error('Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection(); 