import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import AdminProfile from './models/AdminProfile.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure dotenv with correct path
dotenv.config({ path: 'c:\\Users\\DELL\\Desktop\\Nickz Construction\\backend\\.env' });

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await AdminProfile.findOne({ email: 'construction77@gmail.com' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const admin = new AdminProfile({
      full_name: 'Nickz Construction Admin',
      email: 'construction77@gmail.com',
      password: 'Nickz1234',
      role: 'super_admin',
      is_active: true
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('Email: construction77@gmail.com');
    console.log('Password: Nickz1234');
    console.log('Role: super_admin');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createAdmin();
