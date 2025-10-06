#!/usr/bin/env bun

/**
 * Local database seeder
 * Seeds the database with test credentials for local development
 */

async function seedDatabase() {
  console.log('🌱 Seeding local database...');
  
  const { config } = await import('../src/config');
  
  try {
    console.log(`📊 Connecting to database: ${config.DATABASE_URL.replace(/:[^:]*@/, ':****@')}`);
    
    // TODO: Implement seeding logic in Phase 4 when auth tables are created
    // This will insert test API keys into the api_keys table
    
    console.log('ℹ️  Seed logic will be implemented in Phase 4 (Authentication & Database Layer)');
    console.log('✨ Seed placeholder completed!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seedDatabase();
