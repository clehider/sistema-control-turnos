import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const ticketsRef = db.collection('tickets')
    const snapshot = await ticketsRef
      .where('estado', 'in', ['espera', 'en_atencion'])
      .orderBy('hora_emision', 'asc')
      .get()

    const tickets = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json(tickets)
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
