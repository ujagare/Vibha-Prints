import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Enhanced MongoDB Connection Configuration
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: parseInt(process.env.DB_CONNECTION_TIMEOUT || 30000),
  maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || 50),
  minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE || 10),
  socketTimeoutMS: 45000,
  family: 4 // Use IPv4, skip trying IPv6
};

// Secure Connection Function
const connectDB = async () => {
  try {
    // Construct connection URI with authentication
    const connectionURI = process.env.MONGODB_URI.replace(
      '://', 
      `://${encodeURIComponent(process.env.MONGODB_USERNAME)}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@`
    );

    await mongoose.connect(connectionURI, mongoOptions);
    
    console.log('✅ MongoDB Connected Successfully');
    
    // Connection Event Listeners
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to database');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB Connection Error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB connection disconnected');
    });

  } catch (error) {
    console.error(`❌ Database Connection Failed: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

// Graceful Shutdown
const gracefulShutdown = () => {
  mongoose.connection.close(false, () => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
};

// Listen for termination signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

export default connectDB;
