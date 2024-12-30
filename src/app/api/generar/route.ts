import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    if (!db) {
      throw new Error('Database not initialized');
    }

    const ticketsRef = db.collection('tickets');
    
    // Generar número de ticket
    const fecha = new Date();
    const fechaStr = fecha.toISOString().split('T')[0];
    
    // Obtener el último ticket del día
    const ultimoTicket = await ticketsRef
      .where('fecha', '>=', fechaStr)
      .where('fecha', '<', fechaStr + '\uf8ff')
      .orderBy('fecha', 'desc')
      .limit(1)
      .get();
    
    let numeroTicket = 1;
    if (!ultimoTicket.empty) {
      const ultimoDoc = ultimoTicket.docs[0];
      numeroTicket = (ultimoDoc.data().numero || 0) + 1;
    }

    // Crear nuevo ticket
    const nuevoTicket = {
      numero: numeroTicket,
      fecha: fecha.toISOString(),
      estado: 'pendiente',
      hora_generacion: fecha.toISOString(),
      hora_llamada: null,
      hora_finalizacion: null
    };

    const docRef = await ticketsRef.add(nuevoTicket);

    revalidatePath('/monitor');
    
    return NextResponse.json({
      success: true,
      ticket: {
        id: docRef.id,
        ...nuevoTicket
      }
    });

  } catch (error) {
    console.error('Error al generar ticket:', error);
    return NextResponse.json(
      { error: 'Error al generar el ticket' },
      { status: 500 }
    );
  }
}
