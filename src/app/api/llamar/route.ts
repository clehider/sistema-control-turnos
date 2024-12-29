import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

export async function POST(request: Request) {
  try {
    const { tipo_servicio, ventanilla } = await request.json()

    if (!tipo_servicio || !ventanilla) {
      return NextResponse.json(
        { success: false, error: 'Parámetros inválidos' },
        { status: 400 }
      )
    }

    const ticketsRef = db.collection('tickets')
    const snapshot = await ticketsRef
      .where('tipo_servicio', '==', tipo_servicio)
      .where('estado', '==', 'espera')
      .orderBy('hora_emision', 'asc')
      .limit(1)
      .get()

    if (snapshot.empty) {
      return NextResponse.json({
        success: false,
        message: 'No hay tickets en espera para este tipo de servicio'
      })
    }

    const ticket = snapshot.docs[0]
    await ticket.ref.update({
      estado: 'en_atencion',
      ventanilla,
      hora_actualizacion: FieldValue.serverTimestamp()
    })

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticket.id,
        ...ticket.data()
      }
    })
  } catch (error) {
    console.error('Error llamando ticket:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
