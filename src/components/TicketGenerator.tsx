'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from 'lucide-react'

interface TicketGeneratorProps {
  onTicketGenerated: (ticketId: string, ticketNumber: string) => void;
}

const serviceTypes = [
  { id: 'A', name: 'Atención General' },
  { id: 'B', name: 'Servicios Empresariales' },
  { id: 'C', name: 'Clientes Preferenciales' },
  { id: 'P', name: 'Atención Prioritaria' },
];

export function TicketGenerator({ onTicketGenerated }: TicketGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateTicket = async (serviceType: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tipo_servicio: serviceType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al generar el ticket');
      }

      onTicketGenerated(data.ticket_id, data.numero);
      toast({
        title: "Ticket generado",
        description: `Número de ticket: ${data.numero}`,
      });

    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Error al generar el ticket",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {serviceTypes.map((service) => (
        <Card key={service.id} className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600">
            <CardTitle className="text-xl font-semibold text-white">{service.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Button 
              onClick={() => generateTicket(service.id)}
              disabled={isGenerating}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando...
                </>
              ) : (
                'Generar Ticket'
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
