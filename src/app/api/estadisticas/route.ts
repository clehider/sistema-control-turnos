import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

export async function GET() {
  try {
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: 'edu123',
      database: 'sistema_turnos'
    });

    // Tiempo promedio de atención
    const [tiempoPromedio] = await conn.query(`
      SELECT AVG(TIMESTAMPDIFF(MINUTE, hora_emision, hora_finalizacion)) as promedio
      FROM tickets
      WHERE estado = 'completado' AND DATE(hora_emision) = CURDATE()
    `);

    // Tickets por tipo de servicio
    const [ticketsPorTipo] = await conn.query(`
      SELECT tipo_servicio, COUNT(*) as cantidad
      FROM tickets
      WHERE DATE(hora_emision) = CURDATE()
      GROUP BY tipo_servicio
    `);

    // Rendimiento por ventanilla
    const [rendimientoPorVentanilla] = await conn.query(`
      SELECT ventanilla, COUNT(*) as cantidad
      FROM tickets
      WHERE estado = 'completado' AND DATE(hora_emision) = CURDATE()
      GROUP BY ventanilla
    `);

    await conn.end();

    const estadisticas = {
      tiempoPromedioAtencion: (tiempoPromedio as any)[0]?.promedio || 0,
      ticketsPorTipo: Object.fromEntries((ticketsPorTipo as any[]).map(t => [t.tipo_servicio, t.cantidad])),
      rendimientoPorVentanilla: Object.fromEntries((rendimientoPorVentanilla as any[]).map(r => [r.ventanilla, r.cantidad]))
    };

    return NextResponse.json(estadisticas);
  } catch (error) {
    console.error('Error fetching estadísticas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
