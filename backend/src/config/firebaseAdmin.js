import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db = null;
let firebaseInitialized = false;

try {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || path.join(__dirname, 'serviceAccountKey.json');

  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }

    db = admin.firestore();
    firebaseInitialized = true;
    logger.info(`[FIREBASE] Firestore Database connected successfully! Project ID: ${serviceAccount.project_id || 'Firebase'}`);
  } else {
    logger.info(`[FIREBASE] serviceAccountKey.json not found in backend/src/config/. Using built-in high performance DataStore.`);
  }
} catch (err) {
  logger.warn(`[FIREBASE] Unable to initialize Firestore credentials: ${err.message}. Using built-in DataStore.`);
}

export { db, firebaseInitialized };
