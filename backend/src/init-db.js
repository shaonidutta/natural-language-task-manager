const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
    let connection;
    try {
        console.log('Initializing database...');
        
        // First connect without database
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        // Create database
        console.log('Creating database...');
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'task_manager'}`);
        console.log('Database created successfully');

        // Use the database
        await connection.query(`USE ${process.env.DB_NAME || 'task_manager'}`);

        // Create tasks table
        console.log('Creating tasks table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id VARCHAR(36) PRIMARY KEY,
                task_name TEXT NOT NULL,
                assignee TEXT NOT NULL,
                due_datetime DATETIME NOT NULL,
                priority ENUM('P1', 'P2', 'P3', 'P4') NOT NULL DEFAULT 'P3',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('Tasks table created successfully');

        console.log('\nDatabase initialization completed successfully!');
    } catch (error) {
        console.error('\nDatabase initialization failed:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

initializeDatabase(); 