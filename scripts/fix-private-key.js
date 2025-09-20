const fs = require('fs');

console.log('🔧 Fixing Firebase Private Key...\n');

// Read the Firebase JSON file
const jsonFile = 'novothon-f84b4-firebase-adminsdk-fbsvc-6fe3494332.json';
const firebaseData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

// Read the current .env file
let envContent = fs.readFileSync('.env', 'utf8');

// Extract the private key from JSON and properly format it
const privateKey = firebaseData.private_key;
const clientEmail = firebaseData.client_email;

console.log('📋 Firebase Credentials:');
console.log(`  Client Email: ${clientEmail}`);
console.log(`  Private Key Length: ${privateKey.length} characters`);
console.log(`  Private Key Starts With: ${privateKey.substring(0, 30)}...`);
console.log(`  Private Key Ends With: ...${privateKey.substring(privateKey.length - 30)}`);

// Update the .env file
envContent = envContent.replace(
  /FIREBASE_CLIENT_EMAIL=.*/,
  `FIREBASE_CLIENT_EMAIL=${clientEmail}`
);

envContent = envContent.replace(
  /FIREBASE_PRIVATE_KEY=.*/,
  `FIREBASE_PRIVATE_KEY="${privateKey}"`
);

// Write the updated .env file
fs.writeFileSync('.env', envContent);

console.log('\n✅ Updated .env file with correct Firebase credentials!');

// Verify the update
const updatedEnvContent = fs.readFileSync('.env', 'utf8');
const clientEmailLine = updatedEnvContent.split('\n').find(line => line.startsWith('FIREBASE_CLIENT_EMAIL='));
const privateKeyLine = updatedEnvContent.split('\n').find(line => line.startsWith('FIREBASE_PRIVATE_KEY='));

console.log('\n🔍 Verification:');
console.log(`  Client Email: ${clientEmailLine ? '✅ Updated' : '❌ Not found'}`);
console.log(`  Private Key: ${privateKeyLine ? '✅ Updated' : '❌ Not found'}`);

if (privateKeyLine) {
  const extractedKey = privateKeyLine.split('=')[1].replace(/^["']|["']$/g, '');
  console.log(`  Private Key Length: ${extractedKey.length} characters`);
  console.log(`  Private Key Starts With: ${extractedKey.substring(0, 30)}...`);
  console.log(`  Private Key Ends With: ...${extractedKey.substring(extractedKey.length - 30)}`);
  console.log(`  Contains \\n: ${extractedKey.includes('\\n')}`);
  
  // Test parsing
  const parsedKey = extractedKey.replace(/\\n/g, '\n');
  console.log(`  Parsed Key Length: ${parsedKey.length} characters`);
  console.log(`  Contains actual newlines: ${parsedKey.includes('\n')}`);
  console.log(`  Starts with -----BEGIN: ${parsedKey.startsWith('-----BEGIN')}`);
  console.log(`  Ends with -----END: ${parsedKey.endsWith('-----END PRIVATE KEY-----')}`);
  
  if (parsedKey.startsWith('-----BEGIN') && parsedKey.endsWith('-----END PRIVATE KEY-----')) {
    console.log('\n🎉 Private key format is now correct!');
  } else {
    console.log('\n❌ Private key format is still invalid.');
  }
}

console.log('\n✨ Fix complete!');

