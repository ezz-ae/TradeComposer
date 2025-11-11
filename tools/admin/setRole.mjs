
import admin from 'firebase-admin';
import fs from 'fs';

// Usage:
// node tools/admin/setRole.mjs serviceAccount.json uid editor
const [,, keyPath, uid, role] = process.argv;
if(!keyPath || !uid || !role){ 
  console.error('Usage: node tools/admin/setRole.mjs <serviceAccount.json> <uid> <admin|editor|viewer>'); 
  process.exit(1); 
}

admin.initializeApp({ credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, 'utf8'))) });

const allowed = new Set(['admin','editor','viewer']);
if(!allowed.has(role)){ throw new Error('invalid role'); }

await admin.auth().setCustomUserClaims(uid, { role });
console.log(`Set role=${role} for uid=${uid}`);
process.exit(0);
