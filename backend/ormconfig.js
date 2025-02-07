// backend/ormconfig.js

// Load environment variables from .env file
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';


module.exports = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'postgres',
  port: process.env.POSTGRES_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.POSTGRES_USER || 'your_db_user',
  password: process.env.POSTGRES_PASSWORD || 'your_db_password',
  database: process.env.POSTGRES_DB || 'your_db_name',
  synchronize: true, // For development only—use migrations in production!
  logging: false,
  entities: [isProduction ? "dist/entity/**/*.js" : "src/entity/**/*.ts"],
  migrations: [isProduction ? "dist/migration/**/*.js" : "src/migration/**/*.ts"],
  subscribers: [isProduction ? "dist/subscriber/**/*.js" : "src/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber"
  }
};
