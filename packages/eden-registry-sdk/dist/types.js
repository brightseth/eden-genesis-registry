"use strict";
// Generated TypeScript types from Eden Registry OpenAPI schema
// Do not edit manually - regenerate using: npm run generate:sdk
Object.defineProperty(exports, "__esModule", { value: true });
exports.EdenRegistryError = void 0;
class EdenRegistryError extends Error {
    constructor(message, status, details) {
        super(message);
        this.name = 'EdenRegistryError';
        this.status = status;
        this.details = details;
    }
}
exports.EdenRegistryError = EdenRegistryError;
