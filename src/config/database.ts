export const MONGODB_URI = process.env.MONGODB_URI || 'your_connection_string';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}