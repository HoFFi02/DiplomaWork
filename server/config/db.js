// import dotenv from 'dotenv';
// dotenv.config();

// const dbConfing = {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//     port: process.env.DB_PORT
// }

// export default dbConfing;
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',  // lub 'postgres' / 'sqlite' / 'mssql', w zależności od bazy danych
  port: process.env.DB_PORT,
  logging: false // wyłącz logowanie zapytań
});

export default sequelize;