#!/usr/bin/env bun

/**
 * Generate OpenAPI specification
 */

import { writeFileSync } from 'fs';
import { join } from 'path';
import packageJson from '../package.json';

const spec = {
  openapi: '3.0.0',
  info: {
    title: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'API Key',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        required: ['code', 'message'],
        properties: {
          code: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
    responses: {
      ValidationError: {
        description: 'Validation error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
          },
        },
      },
      Unauthorized: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
          },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        tags: ['System'],
        responses: {
          '200': {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/info': {
      get: {
        summary: 'API metadata',
        tags: ['System'],
        responses: {
          '200': {
            description: 'API information',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    version: { type: 'string' },
                    description: { type: 'string' },
                    endpoints: { type: 'array' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/encrypt': {
      post: {
        summary: 'Encrypt text',
        tags: ['Cipher'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['text', 'shift'],
                properties: {
                  text: { type: 'string', minLength: 1 },
                  shift: { type: 'integer', minimum: 0, maximum: 25 },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Encrypted text',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    encrypted: { type: 'string' },
                    shift: { type: 'integer' },
                  },
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/decrypt': {
      post: {
        summary: 'Decrypt text',
        tags: ['Cipher'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['text', 'shift'],
                properties: {
                  text: { type: 'string', minLength: 1 },
                  shift: { type: 'integer', minimum: 0, maximum: 25 },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Decrypted text',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    decrypted: { type: 'string' },
                    shift: { type: 'integer' },
                  },
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/encode': {
      post: {
        summary: 'Encode with default shift',
        tags: ['Cipher'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['text'],
                properties: {
                  text: { type: 'string', minLength: 1 },
                  shift: { type: 'integer', minimum: 0, maximum: 25, default: 3 },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Encoded text',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    encoded: { type: 'string' },
                    shift: { type: 'integer' },
                  },
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/rot13': {
      post: {
        summary: 'ROT13 encoding',
        tags: ['Cipher'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['text'],
                properties: {
                  text: { type: 'string', minLength: 1 },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'ROT13 encoded text',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    encoded: { type: 'string' },
                    shift: { type: 'integer', example: 13 },
                  },
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/bruteforce': {
      post: {
        summary: 'Show all possible shifts',
        tags: ['Cipher'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['text'],
                properties: {
                  text: { type: 'string', minLength: 1 },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'All possible decryptions',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    possibilities: {
                      type: 'object',
                      additionalProperties: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/auto-decrypt': {
      post: {
        summary: 'Auto-detect plaintext',
        tags: ['Cipher'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['text'],
                properties: {
                  text: { type: 'string', minLength: 1 },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Auto-decrypted text',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    decrypted: { type: 'string' },
                    shift: { type: 'integer' },
                    candidates: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          shift: { type: 'integer' },
                          text: { type: 'string' },
                          score: { type: 'number' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
  },
};

const outputPath = join(import.meta.dir, '../openapi.json');
writeFileSync(outputPath, JSON.stringify(spec, null, 2));
console.log(`✅ OpenAPI spec generated: ${outputPath}`);
