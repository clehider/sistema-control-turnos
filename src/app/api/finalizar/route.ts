import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    if (!db) {
      throw new Error('Database not initialized');
    }

    const { ticketId } = await request.json();
    
    if (!ticketId) {
      return NextResponse.json(
        { error: 'ticketId is required' },
        { status: 400 }
      );
    }

    const ticketRef = db.collection('tickets').doc(ticketId);
    
    await ticketRef.update({
      estado: 'finalizado',
      hora_finalizacion: new Date().toISOString()
    });

    revalidatePath('/monitor');
    
    return NextResponse.json({ 
      success: true,
      message: 'Ticket finalizado exitosamente'
    });

  } catch (error) {
    console.error('Error al finalizar el ticket:', error);
    return NextResponse.json(
      { error: 'Error al finalizar el ticket' },
      { status: 500 }
    );
  }
}
