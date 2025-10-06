#!/usr/bin/env bun

/**
 * Local database seeder
 * Seeds the database with test credentials for local development
 * CC-AUTH-003: Provide local seed script for test credentials
 */

import { Pool } from 'pg';
import { createHash, randomBytes } from 'crypto';

async function seedDatabase() {
  console.log('🌱 Seeding local database...');
  
  const { config } = await import('../src/config');
  
  const pool = new Pool({
    connectionString: config.DATABASE_URL,
  });
  
  try {
    console.log(`📊 Connecting to database: ${config.DATABASE_URL.replace(/:[^:]*@/, ':****@')}`);
    
    // Generate a test API key
    const testToken = randomBytes(32).toString('hex');
    const keyHash = createHash('sha256').update(testToken).digest('hex');
    
    // Check if seed key already exists
    const existing = await pool.query(
      'SELECT * FROM api_keys WHERE name = $1',
      ['local-dev-key']
    );
    
    if (existing.rows.length > 0) {
      console.log('ℹ️  Seed key already exists, skipping...');
      console.log('\n📋 Existing API Key:');
      console.log('   Name: local-dev-key');
      console.log('   (Use the token from previous seed or delete and re-run)');
    } else {
      // Insert test API key
      await pool.query(
        'INSERT INTO api_keys (key_hash, name) VALUES ($1, $2)',
        [keyHash, 'local-dev-key']
      );
      
      console.log('✅ Test API key created successfully!');
      console.log('\n📋 API Key Details:');
      console.log('   Name: local-dev-key');
      console.log(`   Token: ${testToken}`);
      console.log('\n💡 Usage:');
      console.log(`   curl -X POST http://localhost:3000/encrypt \\`);
      console.log(`     -H "Content-Type: application/json" \\`);
      console.log(`     -H "Authorization: Bearer ${testToken}" \\`);
      console.log(`     -d '{"text": "Hello, World!", "shift": 3}'`);
      console.log('\n⚠️  Save this token - it will not be displayed again!');
    }
    
    console.log('\n✨ Seed completed!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    await pool.end();
    process.exit(1);
  }
  
  await pool.end();
}

seedDatabase();
