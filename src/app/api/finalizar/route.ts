import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { ticket_id } = body

    if (!ticket_id) {
      return NextResponse.json(
        { success: false, error: 'ID de ticket requerido' },
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
      await conn.beginTransaction()

      await conn.query(
        'UPDATE tickets SET estado = ?, hora_finalizacion = NOW() WHERE id = ?',
        ['completado', ticket_id]
      )

      await conn.commit()

      return NextResponse.json({
        success: true
      })
    } catch (error) {
      await conn.rollback()
      throw error
    } finally {
      await conn.end()
    }
  } catch (error) {
    console.error('Error finalizing ticket:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
