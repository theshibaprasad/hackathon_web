const fs = require('fs');

console.log('🚀 Vercel Firebase Setup Guide\n');

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.error('❌ .env file not found!');
  process.exit(1);
}

const envContent = fs.readFileSync('.env', 'utf8');

// Check current Firebase configuration
console.log('🔍 Current Firebase Configuration:');
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
  const match = envContent.match(regex);
  if (match) {
    const value = match[1];
    if (varName === 'FIREBASE_PRIVATE_KEY') {
      console.log(`  ${varName}: ${value.length > 50 ? '✅ Set (long key)' : '❌ Too short'}`);
    } else {
      console.log(`  ${varName}: ${value ? '✅ Set' : '❌ Missing'}`);
    }
  } else {
    console.log(`  ${varName}: ❌ Missing`);
  }
});

console.log('\n📋 Vercel Environment Variables Setup:');
console.log('1. Go to your Vercel dashboard → Project Settings → Environment Variables');
console.log('2. Add the following variables:');
console.log('');

firebaseVars.forEach(varName => {
  console.log(`   ${varName}`);
});

console.log('\n🔑 Firebase Private Key Format for Vercel:');
console.log('The private key should be formatted as a single line with \\n for newlines:');
console.log('Example: "-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\\n-----END PRIVATE KEY-----\\n"');

console.log('\n⚠️  Important Notes for Vercel:');
console.log('1. Make sure the private key is wrapped in double quotes');
console.log('2. Use \\n for newline characters (not actual newlines)');
console.log('3. The entire key should be on one line');
console.log('4. Don\'t add extra spaces or characters');

console.log('\n🔧 If you have a Firebase JSON file, run:');
console.log('   node scripts/fix-private-key.js');

console.log('\n✅ After setting up environment variables in Vercel:');
console.log('1. Redeploy your application');
console.log('2. Test Firebase authentication');
console.log('3. Check Vercel function logs for any errors');

// Check if there's a Firebase JSON file
const jsonFiles = fs.readdirSync('.').filter(file => file.endsWith('.json') && file.includes('firebase'));
if (jsonFiles.length > 0) {
  console.log('\n📁 Found Firebase JSON files:');
  jsonFiles.forEach((file, index) => {
    console.log(`   ${index + 1}. ${file}`);
  });
  console.log('\n💡 You can use these to automatically update your .env file');
}
