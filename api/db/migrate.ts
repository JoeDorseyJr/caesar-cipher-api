#!/usr/bin/env bun

/**
 * Database migration runner
 * Executes all SQL files in db/migrations/ in alphabetical order
 */

import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';

async function runMigrations() {
  console.log('🔄 Running database migrations...');
  
  const { config } = await import('../src/config');
  
  const pool = new Pool({
    connectionString: config.DATABASE_URL,
  });
  
  try {
    console.log(`📊 Connecting to database: ${config.DATABASE_URL.replace(/:[^:]*@/, ':****@')}`);
    
    const migrationsDir = join(import.meta.dir, 'migrations');
    const files = readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();
    
    if (files.length === 0) {
      console.log('ℹ️  No migration files found');
      await pool.end();
      return;
    }
    
    console.log(`📁 Found ${files.length} migration file(s)`);
    
    for (const file of files) {
      const filePath = join(migrationsDir, file);
      const sql = readFileSync(filePath, 'utf-8');
      console.log(`  ▶️  Executing: ${file}`);
      
      await pool.query(sql);
      console.log(`  ✅  Completed: ${file}`);
    }
    
    console.log('✨ Migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await pool.end();
    process.exit(1);
  }
  
  await pool.end();
}

runMigrations();
