const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Admin schema
const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

const Admin = mongoose.model('Admin', AdminSchema);

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hackathon');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'hackathon' });
    if (existingAdmin) {
      console.log('Admin already exists!');
      process.exit(0);
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('hackshiba@9988', saltRounds);

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
    console.log('Password: novoshiba@9988');
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
