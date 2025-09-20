require('dotenv').config({ path: '.env' });

console.log('🔍 Testing Firebase Environment Variables...\n');

// Check if .env exists
const fs = require('fs');
if (!fs.existsSync('.env')) {
  console.error('❌ .env file not found!');
  console.log('Please create .env file with your Firebase credentials.');
  process.exit(1);
}

// Check Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

console.log('📱 Firebase Client Config:');
Object.entries(firebaseConfig).forEach(([key, value]) => {
  console.log(`  ${key}: ${value ? '✅ Set' : '❌ Missing'}`);
});

// Check Firebase Admin SDK credentials
const adminConfig = {
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY
};

console.log('\n🔐 Firebase Admin SDK:');
console.log(`  clientEmail: ${adminConfig.clientEmail ? '✅ Set' : '❌ Missing'}`);
console.log(`  privateKey: ${adminConfig.privateKey ? '✅ Set' : '❌ Missing'}`);

if (adminConfig.privateKey) {
  console.log(`  privateKey length: ${adminConfig.privateKey.length} characters`);
  console.log(`  privateKey starts with: ${adminConfig.privateKey.substring(0, 30)}...`);
  console.log(`  privateKey contains \\n: ${adminConfig.privateKey.includes('\\n') ? 'Yes' : 'No'}`);
}

// Check other required variables
const otherConfig = {
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET
};

console.log('\n🗄️ Other Config:');
Object.entries(otherConfig).forEach(([key, value]) => {
  console.log(`  ${key}: ${value ? '✅ Set' : '❌ Missing'}`);
});

// Test private key parsing
if (adminConfig.privateKey) {
  try {
    const parsedKey = adminConfig.privateKey.replace(/\\n/g, '\n');
    console.log('\n🔧 Private Key Parsing Test:');
    console.log(`  Original length: ${adminConfig.privateKey.length}`);
    console.log(`  Parsed length: ${parsedKey.length}`);
    console.log(`  Contains actual newlines: ${parsedKey.includes('\n') ? 'Yes' : 'No'}`);
    console.log(`  Starts with -----BEGIN: ${parsedKey.startsWith('-----BEGIN') ? 'Yes' : 'No'}`);
  } catch (error) {
    console.error('❌ Error parsing private key:', error.message);
  }
}

console.log('\n✨ Environment check complete!');
