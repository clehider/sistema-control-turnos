import mysql from 'mysql2/promise';

export class SistemaTurnos {
  private conn: mysql.Connection | null = null;

  constructor() {
    this.initializeConnection();
  }

  private async initializeConnection() {
    try {
      this.conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
      console.log('Conexión a la base de datos establecida');
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error);
    }
  }

  async generarTurno(): Promise<{ numero: number; fecha: string } | null> {
    if (!this.conn) {
      console.error('La conexión a la base de datos no está establecida');
      return null;
    }

    try {
      const [result] = await this.conn.execute(
        'INSERT INTO turnos (fecha) VALUES (NOW())'
      );
      const insertId = (result as mysql.ResultSetHeader).insertId;
      
      const [rows] = await this.conn.execute<mysql.RowDataPacket[]>(
        'SELECT numero, fecha FROM turnos WHERE id = ?',
        [insertId]
      );
      
      const turno = rows[0] as { numero: number; fecha: string };
      return turno;
    } catch (error) {
      console.error('Error al generar turno:', error);
      return null;
    }
  }

  async obtenerTurnosPendientes(): Promise<mysql.RowDataPacket[]> {
    if (!this.conn) {
      console.error('La conexión a la base de datos no está establecida');
      return [];
    }

    try {
      const [rows] = await this.conn.execute<mysql.RowDataPacket[]>(
        'SELECT * FROM turnos WHERE estado = "pendiente" ORDER BY fecha ASC'
      );
      return rows;
    } catch (error) {
      console.error('Error al obtener turnos pendientes:', error);
      return [];
    }
  }

  async llamarTurno(id: number): Promise<boolean> {
    if (!this.conn) {
      console.error('La conexión a la base de datos no está establecida');
      return false;
    }

    try {
      await this.conn.execute(
        'UPDATE turnos SET estado = "llamado", hora_llamada = NOW() WHERE id = ?',
        [id]
      );
      return true;
    } catch (error) {
      console.error('Error al llamar turno:', error);
      return false;
    }
  }

  async finalizarTurno(id: number): Promise<boolean> {
    if (!this.conn) {
      console.error('La conexión a la base de datos no está establecida');
      return false;
    }

    try {
      await this.conn.execute(
        'UPDATE turnos SET estado = "finalizado", hora_finalizacion = NOW() WHERE id = ?',
        [id]
      );
      return true;
    } catch (error) {
      console.error('Error al finalizar turno:', error);
      return false;
    }
  }

  async cerrarConexion() {
    if (this.conn) {
      await this.conn.end();
      console.log('Conexión a la base de datos cerrada');
    }
  }
}
