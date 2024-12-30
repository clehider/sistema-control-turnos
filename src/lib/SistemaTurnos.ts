import mysql from 'serverless-mysql';

export class SistemaTurnos {
  private conn: ReturnType<typeof mysql>;

  constructor() {
    this.conn = mysql({
      config: {
        host: process.env.MYSQL_HOST,
        port: parseInt(process.env.MYSQL_PORT || '3306'),
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD
      }
    });
  }

  // Aquí puedes agregar métodos para interactuar con la base de datos
  // Por ejemplo:
  async generarTicket(): Promise<string> {
    // Implementa la lógica para generar un nuevo ticket
    return 'T001'; // Esto es solo un ejemplo
  }

  async cerrarConexion() {
    await this.conn.end();
  }
}
