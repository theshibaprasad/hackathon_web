const fs = require('fs');

console.log('🔧 Formatting Firebase Private Key for Vercel\n');

// Read the current .env file
if (!fs.existsSync('.env')) {
  console.error('❌ .env file not found!');
  process.exit(1);
}

const envContent = fs.readFileSync('.env', 'utf8');

// Find the FIREBASE_PRIVATE_KEY line
const privateKeyLine = envContent.match(/FIREBASE_PRIVATE_KEY=(.+)/);
if (!privateKeyLine) {
  console.error('❌ FIREBASE_PRIVATE_KEY not found in .env file');
  process.exit(1);
}

// Extract the current private key value
let currentKey = privateKeyLine[1].replace(/^["']|["']$/g, '');

console.log('🔍 Current Private Key Analysis:');
console.log(`  Length: ${currentKey.length} characters`);
console.log(`  Starts with -----BEGIN: ${currentKey.startsWith('-----BEGIN')}`);
console.log(`  Contains \\n: ${currentKey.includes('\\n')}`);
console.log(`  Contains actual newlines: ${currentKey.includes('\n')}`);

// Format the private key for Vercel
let formattedKey = currentKey;

// If it contains actual newlines, convert them to \n
if (formattedKey.includes('\n')) {
  formattedKey = formattedKey.replace(/\n/g, '\\n');
  console.log('\n🔄 Converting actual newlines to \\n');
}

// Ensure it's properly quoted
if (!formattedKey.startsWith('"') || !formattedKey.endsWith('"')) {
  formattedKey = `"${formattedKey}"`;
  console.log('🔄 Adding quotes around the key');
}

// Update the .env file
const updatedEnvContent = envContent.replace(
  /FIREBASE_PRIVATE_KEY=.*/,
  `FIREBASE_PRIVATE_KEY=${formattedKey}`
);

fs.writeFileSync('.env', updatedEnvContent);

console.log('\n✅ Updated .env file with Vercel-compatible private key!');

console.log('\n📋 Next Steps for Vercel Deployment:');
console.log('1. Copy the FIREBASE_PRIVATE_KEY value from your .env file');
console.log('2. Go to Vercel Dashboard → Your Project → Settings → Environment Variables');
console.log('3. Add/Update FIREBASE_PRIVATE_KEY with the formatted value');
console.log('4. Add all other Firebase environment variables');
console.log('5. Redeploy your application');

console.log('\n🔑 Formatted Private Key (first 50 chars):');
console.log(`   ${formattedKey.substring(0, 50)}...`);

console.log('\n⚠️  Important:');
console.log('- The key should be on ONE LINE in Vercel');
console.log('- Use \\n for newlines (not actual line breaks)');
console.log('- Wrap the entire key in double quotes');
console.log('- Don\'t add extra spaces or characters');

// Also show all Firebase variables that need to be set in Vercel
console.log('\n📝 All Firebase Environment Variables for Vercel:');
const firebaseVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID', 
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY'
];

firebaseVars.forEach(varName => {
  const regex = new RegExp(`${varName}=(.+)`);
  const match = updatedEnvContent.match(regex);
  if (match) {
    const value = match[1];
    console.log(`\n${varName}=${value}`);
  }
});
