import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tipo_servicio } = body

    if (!tipo_servicio || !['A', 'B', 'C', 'P'].includes(tipo_servicio)) {
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
      await conn.beginTransaction()

      const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '')
      
      // Obtener el último número
      const [maxNumResult] = await conn.query(
        'SELECT MAX(CAST(numero AS UNSIGNED)) as max_num FROM tickets WHERE DATE(hora_emision) = CURDATE() AND tipo_servicio = ?',
        [tipo_servicio]
      )
      
      const maxNum = (maxNumResult as any)[0].max_num || 0
      const numero = String(maxNum + 1).padStart(4, '0')
      const id = `${fecha}${tipo_servicio}${numero}`

      // Insertar nuevo ticket
      await conn.query(
        'INSERT INTO tickets (id, numero, tipo_servicio, hora_emision, estado) VALUES (?, ?, ?, NOW(), ?)',
        [id, numero, tipo_servicio, 'espera']
      )

      await conn.commit()
      
      return NextResponse.json({
        success: true,
        ticket_id: id
      })

    } catch (error) {
      await conn.rollback()
      throw error
    } finally {
      await conn.end()
    }

  } catch (error) {
    console.error('Error generating ticket:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
