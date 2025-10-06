import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { app } from '../app';
import { setupTestAuth, cleanupTestAuth, getAuthHeader } from '../test-helpers/auth';

let authToken: string;

