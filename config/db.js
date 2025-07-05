import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();
async function ensureDatabase() {
 const mysql = await import('mysql2/promise');
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    multipleStatements: true,      // por si quieres ejecutar más de un statement
  });

  // Usa comillas invertidas para evitar problemas con nombres reservados
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NOMBRE}\` 
     DEFAULT CHARACTER SET utf8mb4 
     COLLATE utf8mb4_unicode_ci;`
  );

  await connection.end();
}

// 2) Ejecutamos la verificación antes de exponer el ORM
await ensureDatabase();

const db = new Sequelize(process.env.DB_NOMBRE,process.env.DB_USER,process.env.DB_PASS ?? '',{
    host:'localhost',
    port: process.env.DB_PORT,
    dialect: 'mysql',
    
    
    define: {
        timestamps: true
    },
    pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
})

export default db