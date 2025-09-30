import mongoose from 'mongoose';

export const connect = async () => {
  try {

    const mongoUrl = process.env.MONGO_URL;
       console.log("Connected to the database");
    if (!mongoUrl) {
      throw new Error("MONGO_URL is not defined in the environment variables");
    }
    await mongoose.connect(mongoUrl)
 
    const connection = mongoose.connection;

    connection.on('connected', () => {
      console.log('Mongoose connected to the dataase');
    });

    connection.on('error', (err) => {
      console.log('Mongoose connection error:', err);
      process.exit(1);
    });
  } catch (error) {
    console.log("Something went wrong:", error);
  }
};
