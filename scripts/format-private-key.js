const fs = require('fs');

console.log('🔧 Firebase Private Key Formatter\n');

// Check if there's a JSON file to read from
const jsonFiles = fs.readdirSync('.').filter(file => file.endsWith('.json') && file.includes('firebase'));
if (jsonFiles.length > 0) {
  console.log('📁 Found Firebase JSON files:');
  jsonFiles.forEach((file, index) => {
    console.log(`  ${index + 1}. ${file}`);
  });
  console.log('');
}

// Read the current .env file
if (!fs.existsSync('.env')) {
  console.error('❌ .env file not found!');
  process.exit(1);
}

const envContent = fs.readFileSync('.env', 'utf8');
const lines = envContent.split('\n');

// Find the FIREBASE_PRIVATE_KEY line
let privateKeyLine = lines.find(line => line.startsWith('FIREBASE_PRIVATE_KEY='));
if (!privateKeyLine) {
  console.error('❌ FIREBASE_PRIVATE_KEY not found in .env file');
  process.exit(1);
}

// Extract the current private key value
const currentKey = privateKeyLine.split('=')[1].replace(/^["']|["']$/g, '');

console.log('🔍 Current Private Key Analysis:');
console.log(`  Length: ${currentKey.length} characters`);
console.log(`  Starts with: ${currentKey.substring(0, 30)}...`);
console.log(`  Contains \\n: ${currentKey.includes('\\n')}`);
console.log(`  Contains actual newlines: ${currentKey.includes('\n')}`);
console.log(`  Starts with -----BEGIN: ${currentKey.startsWith('-----BEGIN')}`);

if (currentKey === 'your_firebase_private_key_here') {
  console.log('\n❌ You still have the placeholder value!');
  console.log('Please replace it with your actual Firebase private key.');
  console.log('\n📋 Instructions:');
  console.log('1. Go to Firebase Console → Project Settings → Service Accounts');
  console.log('2. Click "Generate new private key"');
  console.log('3. Download the JSON file');
  console.log('4. Copy the "private_key" value from the JSON file');
  console.log('5. Replace the FIREBASE_PRIVATE_KEY value in your .env file');
  console.log('\n💡 The private key should look like this:');
  console.log('FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\\n-----END PRIVATE KEY-----\\n"');
} else if (!currentKey.startsWith('-----BEGIN')) {
  console.log('\n❌ Invalid private key format!');
  console.log('The private key should start with "-----BEGIN PRIVATE KEY-----"');
  console.log('\n💡 Make sure you copied the entire private key from the JSON file.');
} else if (!currentKey.includes('\\n')) {
  console.log('\n❌ Missing newline characters!');
  console.log('The private key should contain \\n characters for newlines.');
  console.log('\n💡 When copying from JSON, make sure to preserve the \\n characters.');
} else {
  console.log('\n✅ Private key format looks correct!');
  
  // Test the key parsing
  const parsedKey = currentKey.replace(/\\n/g, '\n');
  console.log('\n🔧 Parsed Key Analysis:');
  console.log(`  Parsed length: ${parsedKey.length} characters`);
  console.log(`  Contains actual newlines: ${parsedKey.includes('\n')}`);
  console.log(`  Starts with -----BEGIN: ${parsedKey.startsWith('-----BEGIN')}`);
  console.log(`  Ends with -----END: ${parsedKey.endsWith('-----END PRIVATE KEY-----')}`);
  
  if (parsedKey.startsWith('-----BEGIN') && parsedKey.endsWith('-----END PRIVATE KEY-----')) {
    console.log('\n🎉 Private key format is correct!');
  } else {
    console.log('\n❌ Private key format is still invalid.');
    console.log('Make sure the key starts with "-----BEGIN PRIVATE KEY-----" and ends with "-----END PRIVATE KEY-----"');
  }
}

console.log('\n✨ Analysis complete!');

