import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

export async function POST(request: Request) {
  try {
    const { tipo_servicio } = await request.json()

    if (!tipo_servicio || !['A', 'B', 'C', 'P'].includes(tipo_servicio)) {
      return NextResponse.json(
        { success: false, error: 'Tipo de servicio inválido' },
        { status: 400 }
      )
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const ticketsRef = db.collection('tickets')
    const snapshot = await ticketsRef
      .where('fecha', '>=', today)
      .where('tipo_servicio', '==', tipo_servicio)
      .orderBy('fecha', 'desc')
      .limit(1)
      .get()

    const lastNum = snapshot.empty ? 0 : parseInt(snapshot.docs[0].data().numero)
    const newNum = (lastNum + 1).toString().padStart(4, '0')
    
    const ticketData = {
      numero: newNum,
      tipo_servicio,
      estado: 'espera',
      hora_emision: FieldValue.serverTimestamp(),
      fecha: new Date(),
    }

    const docRef = await ticketsRef.add(ticketData)

    return NextResponse.json({
      success: true,
      ticket_id: docRef.id,
      numero: newNum
    })
  } catch (error) {
    console.error('Error generating ticket:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
