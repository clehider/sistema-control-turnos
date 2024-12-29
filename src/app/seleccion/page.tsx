'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/toast"

const servicios = [
  { id: 'A', nombre: 'Atención General' },
  { id: 'B', nombre: 'Servicios Empresariales' },
  { id: 'C', nombre: 'Clientes Preferenciales' },
  { id: 'P', nombre: 'Atención Prioritaria' },
];

export default function SeleccionServicio() {
  const [isLoading, setIsLoading] = useState(false);
  const { Toast, addToast } = useToast();
  const [activeToast, setActiveToast] = useState<React.ReactNode | null>(null);

  const generarTicket = async (tipoServicio: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generar.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tipo_servicio: tipoServicio }),
      });
      const data = await response.json();
      if (data.success) {
        setActiveToast(
          <Toast
            message={`Su número de ticket es: ${data.ticket_id}`}
            type="success"
          />
        );
      } else {
        throw new Error(data.error || 'Error al generar el ticket');
      }
    } catch (error) {
      console.error('Error:', error);
      setActiveToast(
        <Toast
          message="No se pudo generar el ticket. Por favor, intente de nuevo."
          type="error"
        />
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Seleccione su Servicio</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {servicios.map(servicio => (
            <Card key={servicio.id} className="shadow-lg">
              <CardHeader className="bg-blue-500 text-white">
                <CardTitle className="text-xl text-center">{servicio.nombre}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Button 
                  onClick={() => generarTicket(servicio.id)}
                  className="w-full text-lg py-6"
                  disabled={isLoading}
                >
                  {isLoading ? 'Generando...' : 'Generar Ticket'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {activeToast}
    </div>
  );
}

