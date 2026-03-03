import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Service from '../models/Service.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});

    // Seed Users
    const users = [
      {
        username: 'admin',
        email: 'admin@vibhaart.com',
        password: 'AdminPassword2024!',
        role: 'admin',
        profile: {
          firstName: 'Vibha',
          lastName: 'Art Admin'
        },
        isVerified: true
      }
    ];

    await User.insertMany(users);

    // Seed Services
    const services = [
      {
        title: 'Logo Design',
        slug: 'logo-design',
        category: 'graphic',
        description: 'Professional logo design that captures your brand essence',
        fullDescription: 'Our logo design service creates unique visual identities...',
        pricing: {
          basic: { 
            price: 299, 
            features: ['Basic Logo Design', '2 Revisions'] 
          },
          standard: { 
            price: 499, 
            features: ['Advanced Logo Design', '4 Revisions', 'Multiple Formats'] 
          },
          premium: { 
            price: 799, 
            features: ['Complete Branding Package', 'Unlimited Revisions', 'Brand Guidelines'] 
          }
        },
        images: [
          { url: 'https://example.com/logo1.jpg', alt: 'Logo Design Sample' }
        ],
        metaData: {
          keywords: ['logo design', 'branding', 'graphic design'],
          seoDescription: 'Create a memorable logo that represents your business'
        }
      }
      // Add more services here
    ];

    await Service.insertMany(services);

    console.log('🌱 Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();
