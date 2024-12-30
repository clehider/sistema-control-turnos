import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'

export const dynamic = 'force-static'
export const revalidate = 3600 // revalidar cada hora

export async function POST(request: Request) {
  try {
    const { ticketId } = await request.json()
    
    const ticketRef = db.collection('tickets').doc(ticketId)
    await ticketRef.update({
      estado: 'finalizado',
      hora_finalizacion: new Date().toISOString()
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al finalizar ticket:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
