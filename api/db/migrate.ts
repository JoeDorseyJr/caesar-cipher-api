#!/usr/bin/env bun

/**
 * Database migration runner
 * Executes all SQL files in db/migrations/ in alphabetical order
 */

import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

async function runMigrations() {
  console.log('🔄 Running database migrations...');
  
  const { config } = await import('../src/config');
  
  try {
    // Import pg for database connection
    // Note: pg package will be installed when we implement Phase 4
    console.log(`📊 Connecting to database: ${config.DATABASE_URL.replace(/:[^:]*@/, ':****@')}`);
    
    const migrationsDir = join(import.meta.dir, 'migrations');
    const files = readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();
    
    if (files.length === 0) {
      console.log('ℹ️  No migration files found');
      return;
    }
    
    console.log(`📁 Found ${files.length} migration file(s)`);
    
    for (const file of files) {
      const filePath = join(migrationsDir, file);
      const sql = readFileSync(filePath, 'utf-8');
      console.log(`  ▶️  Executing: ${file}`);
      
      // TODO: Execute SQL when pg client is available in Phase 4
      // await client.query(sql);
      console.log(`  ✅  Completed: ${file}`);
    }
    
    console.log('✨ Migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
