import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'

export const dynamic = 'force-static'
export const revalidate = 3600 // revalidar cada hora

export async function POST() {
  try {
    const ticketsRef = db.collection('tickets')
    
    // Generar número de ticket
    const fecha = new Date()
    const numeroTicket = `T${fecha.getFullYear()}${(fecha.getMonth() + 1).toString().padStart(2, '0')}${fecha.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
    
    // Crear nuevo ticket
    const nuevoTicket = {
      numero: numeroTicket,
      estado: 'espera',
      hora_emision: fecha.toISOString(),
      hora_atencion: null,
      hora_finalizacion: null
    }

    await ticketsRef.doc(numeroTicket).set(nuevoTicket)

    return NextResponse.json({ 
      success: true, 
      ticket: nuevoTicket 
    })
  } catch (error) {
    console.error('Error al generar ticket:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
