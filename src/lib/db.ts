import mysql from 'mysql2/promise'

export async function connectDB() {
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: 'edu123',
      database: 'sistema_turnos'
    });
    
    return connection;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}
