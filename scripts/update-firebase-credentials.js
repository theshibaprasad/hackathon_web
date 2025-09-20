const fs = require('fs');

console.log('🔧 Updating Firebase Credentials from JSON file...\n');

// Read the Firebase JSON file
const jsonFile = 'novothon-f84b4-firebase-adminsdk-fbsvc-6fe3494332.json';
if (!fs.existsSync(jsonFile)) {
  console.error('❌ Firebase JSON file not found!');
  process.exit(1);
}

const firebaseData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

console.log('📋 Extracted Firebase Credentials:');
console.log(`  Client Email: ${firebaseData.client_email}`);
console.log(`  Private Key Length: ${firebaseData.private_key.length} characters`);
console.log(`  Private Key Starts With: ${firebaseData.private_key.substring(0, 30)}...`);

// Read the current .env file
if (!fs.existsSync('.env')) {
  console.error('❌ .env file not found!');
  process.exit(1);
}

let envContent = fs.readFileSync('.env', 'utf8');

// Update FIREBASE_CLIENT_EMAIL
envContent = envContent.replace(
  /FIREBASE_CLIENT_EMAIL=.*/,
  `FIREBASE_CLIENT_EMAIL=${firebaseData.client_email}`
);

// Update FIREBASE_PRIVATE_KEY
envContent = envContent.replace(
  /FIREBASE_PRIVATE_KEY=.*/,
  `FIREBASE_PRIVATE_KEY="${firebaseData.private_key}"`
);

// Write the updated .env file
fs.writeFileSync('.env', envContent);

console.log('\n✅ Updated .env file with Firebase credentials!');

// Verify the update
const updatedEnvContent = fs.readFileSync('.env', 'utf8');
const clientEmailLine = updatedEnvContent.split('\n').find(line => line.startsWith('FIREBASE_CLIENT_EMAIL='));
const privateKeyLine = updatedEnvContent.split('\n').find(line => line.startsWith('FIREBASE_PRIVATE_KEY='));

console.log('\n🔍 Verification:');
console.log(`  Client Email: ${clientEmailLine ? '✅ Updated' : '❌ Not found'}`);
console.log(`  Private Key: ${privateKeyLine ? '✅ Updated' : '❌ Not found'}`);

if (privateKeyLine) {
  const privateKey = privateKeyLine.split('=')[1].replace(/^["']|["']$/g, '');
  console.log(`  Private Key Length: ${privateKey.length} characters`);
  console.log(`  Private Key Starts With: ${privateKey.substring(0, 30)}...`);
  console.log(`  Contains \\n: ${privateKey.includes('\\n')}`);
}

console.log('\n🎉 Firebase credentials updated successfully!');
console.log('You can now restart your development server.');

