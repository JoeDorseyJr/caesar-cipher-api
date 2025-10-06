import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { app } from "../app";
import {
  cleanupTestAuth,
  getAuthHeader,
  setupTestAuth,
} from "../test-helpers/auth";

let authToken: string;
