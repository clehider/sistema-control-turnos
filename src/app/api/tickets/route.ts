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

    const [rows] = await conn.query(
      'SELECT * FROM tickets WHERE estado IN (?, ?) ORDER BY hora_emision ASC',
      ['espera', 'en_atencion']
    );

    await conn.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
