import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tipo_servicio, ventanilla } = body

    if (!tipo_servicio || !ventanilla) {
      return NextResponse.json(
        { success: false, error: 'Parámetros inválidos' },
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

      const [tickets] = await conn.query(
        'SELECT * FROM tickets WHERE tipo_servicio = ? AND estado = ? ORDER BY hora_emision ASC LIMIT 1',
        [tipo_servicio, 'espera']
      )

      if (Array.isArray(tickets) && tickets.length > 0) {
        const ticket = tickets[0]

        await conn.query(
          'UPDATE tickets SET estado = ?, ventanilla = ? WHERE id = ?',
          ['en_atencion', ventanilla, ticket.id]
        )

        await conn.commit()

        return NextResponse.json({
          success: true,
          ticket
        })
      } else {
        await conn.commit()
        return NextResponse.json({
          success: false,
          message: 'No hay tickets en espera'
        })
      }
    } catch (error) {
      await conn.rollback()
      throw error
    } finally {
      await conn.end()
    }
  } catch (error) {
    console.error('Error calling ticket:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
