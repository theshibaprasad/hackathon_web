#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Generate a secure JWT secret
const jwtSecret = crypto.randomBytes(64).toString('hex');

// Environment variables template
const envContent = `# Database
MONGODB_URI=mongodb://localhost:27017/hackathon_web

# JWT Secret (automatically generated)
JWT_SECRET=${jwtSecret}

# Email Configuration (for future email features)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=${crypto.randomBytes(32).toString('hex')}
`;

// Write .env file
const envPath = path.join(__dirname, '.env');
fs.writeFileSync(envPath, envContent);

console.log('✅ Environment file created successfully!');
console.log('📝 Please update the following in your .env file:');
console.log('   - MONGODB_URI: Update with your MongoDB connection string');
console.log('   - EMAIL_*: Update with your email service credentials');
console.log('');
console.log('🔑 JWT_SECRET has been automatically generated for security');
console.log('🚀 You can now run: npm run dev');
