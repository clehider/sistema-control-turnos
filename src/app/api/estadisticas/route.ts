import { NextResponse } from 'next/server';

export const dynamic = 'force-static'
export const revalidate = 3600 // revalidar cada hora

interface Estadisticas {
  totalTickets: number;
  ticketsAtendidos: number;
  tiempoPromedioAtencion: number;
}

export async function GET(): Promise<NextResponse<Estadisticas>> {
  // Aquí normalmente obtendrías los datos de una base de datos
  // Por ahora, usaremos datos de ejemplo
  const estadisticas: Estadisticas = {
    totalTickets: 100,
    ticketsAtendidos: 75,
    tiempoPromedioAtencion: 15, // en minutos
  };

  return NextResponse.json(estadisticas);
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    
    // Aquí normalmente procesarías los datos y los guardarías en una base de datos
    console.log('Datos recibidos:', body);

    return NextResponse.json({ message: "Estadísticas actualizadas correctamente" }, { status: 200 });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return NextResponse.json({ message: "Error al procesar la solicitud" }, { status: 500 });
  }
}
