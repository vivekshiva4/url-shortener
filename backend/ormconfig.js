require('dotenv').config();

module.exports = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'postgres',
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432,
  username: process.env.POSTGRES_USER || 'myuser',
  password: process.env.POSTGRES_PASSWORD || 'your_db_password',
  database: process.env.POSTGRES_DB || 'url_shortener_db',
  synchronize: true,
  logging: false,
  entities: ['dist/entity/**/*.js'],
};
