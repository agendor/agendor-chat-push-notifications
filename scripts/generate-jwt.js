#!/usr/bin/env node

/**
 * Script para gerar tokens JWT de teste
 * 
 * Uso:
 *   node scripts/generate-jwt.js <account> <user> [secret_key] [expiration]
 * 
 * Exemplos:
 *   node scripts/generate-jwt.js account-123 user-456
 *   node scripts/generate-jwt.js account-123 user-456 my-secret-key
 *   node scripts/generate-jwt.js account-123 user-456 my-secret-key 24h
 */

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const account = process.argv[2];
const user = process.argv[3];
const secretKey = process.argv[4] || process.env.JWT_SECRET_KEY || 'test-secret-key';
const expiration = process.argv[5] || '24h';

if (!account || !user) {
  console.error('❌ Erro: account e user são obrigatórios');
  console.log('\nUso:');
  console.log('  node scripts/generate-jwt.js <account> <user> [secret_key] [expiration]');
  console.log('\nExemplos:');
  console.log('  node scripts/generate-jwt.js account-123 user-456');
  console.log('  node scripts/generate-jwt.js account-123 user-456 my-secret-key');
  console.log('  node scripts/generate-jwt.js account-123 user-456 my-secret-key 24h');
  process.exit(1);
}

const token = jwt.sign(
  { account, user },
  secretKey,
  { expiresIn: expiration }
);

console.log('\n✅ Token JWT gerado com sucesso!\n');
console.log('Account:', account);
console.log('User:', user);
console.log('Expiração:', expiration);
console.log('\nToken:');
console.log(token);
console.log('\nCurl de exemplo:');
console.log(`curl -X POST http://localhost:3000/v1/tokens \\`);
console.log(`  -H "Authorization: Bearer ${token}" \\`);
console.log(`  -H "Content-Type: application/json" \\`);
console.log(`  -d '{`);
console.log(`    "deviceId": "device-123",`);
console.log(`    "fcmToken": "fcm-token-abc123"`);
console.log(`  }'`);
console.log('');
