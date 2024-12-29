import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

export async function POST(request: Request) {
  try {
    const { ticket_id } = await request.json()

    if (!ticket_id) {
      return NextResponse.json(
        { success: false, error: 'ID de ticket requerido' },
        { status: 400 }
      )
    }

    const ticketRef = db.collection('tickets').doc(ticket_id)
    const ticket = await ticketRef.get()

    if (!ticket.exists) {
      return NextResponse.json(
        { success: false, error: 'Ticket no encontrado' },
        { status: 404 }
      )
    }

    await ticketRef.update({
      estado: 'completado',
      hora_finalizacion: FieldValue.serverTimestamp()
    })

    return NextResponse.json({
      success: true,
      message: 'Ticket finalizado correctamente'
    })
  } catch (error) {
    console.error('Error finalizando ticket:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
