import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tipo_servicio } = body

    console.log('Recibida solicitud para tipo de servicio:', tipo_servicio);

    if (!tipo_servicio || !['A', 'B', 'C', 'P'].includes(tipo_servicio)) {
      console.log('Tipo de servicio inválido:', tipo_servicio);
      return NextResponse.json(
        { success: false, error: 'Tipo de servicio inválido' },
        { status: 400 }
      )
    }

    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: 'edu123',
      database: 'sistema_turnos'
    });

    try {
      await conn.beginTransaction();
      console.log('Transacción iniciada');

      const [rows] = await conn.execute(
        'SELECT MAX(CAST(numero AS UNSIGNED)) as max_num FROM tickets WHERE DATE(hora_emision) = CURDATE() AND tipo_servicio = ?',
        [tipo_servicio]
      );

      console.log('Resultado de consulta MAX:', rows);

      const maxNum = (rows as any)[0].max_num || 0;
      const numero = String(maxNum + 1).padStart(4, '0');
      const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const id = `${fecha}${tipo_servicio}${numero}`;

      console.log('Generando ticket con ID:', id);

      await conn.execute(
        'INSERT INTO tickets (id, numero, tipo_servicio, hora_emision, estado) VALUES (?, ?, ?, NOW(), ?)',
        [id, numero, tipo_servicio, 'espera']
      );

      await conn.commit();
      console.log('Transacción completada');

      return NextResponse.json({
        success: true,
        ticket_id: id,
        numero: numero,
        tipo_servicio: tipo_servicio
      });

    } catch (error) {
      await conn.rollback();
      console.error('Error en la transacción:', error);
      throw error;
    } finally {
      await conn.end();
    }

  } catch (error) {
    console.error('Error generando ticket:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
