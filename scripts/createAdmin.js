const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import the existing Admin model to avoid duplicate schema definitions
const Admin = require('../src/models/Admin').default;

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hackathon');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin already exists!');
      process.exit(0);
    }

    // Hash the password
    const saltRounds = 12;
    const password = 'hackshiba@9988';
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create admin
    const admin = new Admin({
      username: 'admin',
      password: hashedPassword,
      email: 'admin@novothon.com',
      role: 'super_admin',
      isActive: true
    });

    await admin.save();
    console.log('Admin created successfully!');
    console.log('Username: admin');
    console.log('Password: hackshiba@9988');
    console.log('Email: admin@novothon.com');
    console.log('Role: super_admin');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

createAdmin();
