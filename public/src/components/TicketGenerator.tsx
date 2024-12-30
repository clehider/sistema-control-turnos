'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface TicketGeneratorProps {
  onTicketGenerated: (ticketId: string) => void;
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
      console.log('Iniciando generación de ticket para:', serviceType);
      
      const response = await fetch('/api/generar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tipo_servicio: serviceType }),
      });

      const data = await response.json();
      console.log('Respuesta recibida:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error al generar el ticket');
      }

      if (!data.success) {
        throw new Error(data.error || 'Error al generar el ticket');
      }

      onTicketGenerated(data.ticket_id);
      toast({
        description: `Ticket generado: ${data.ticket_id}`,
      });

      // Solo intentar imprimir si tenemos datos válidos
      if (data.ticket_id) {
        try {
          const printWindow = window.open('', '_blank');
          if (!printWindow) {
            throw new Error('No se pudo abrir la ventana de impresión');
          }

          printWindow.document.write(`
            <html>
              <head>
                <title>Ticket</title>
                <style>
                  body {
                    font-family: 'Courier New', monospace;
                    text-align: center;
                    margin: 0;
                    padding: 20px;
                    width: 80mm;
                    background: white;
                  }
                  .ticket {
                    padding: 20px;
                    border: 1px solid #eee;
                    border-radius: 8px;
                  }
                  .header {
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #000;
                  }
                  .number {
                    font-size: 32px;
                    font-weight: bold;
                    margin: 20px 0;
                    padding: 10px;
                    background: #f8f9fa;
                    border-radius: 4px;
                  }
                  .info {
                    font-size: 14px;
                    margin: 8px 0;
                    color: #666;
                  }
                  .footer {
                    margin-top: 20px;
                    font-size: 12px;
                    color: #999;
                  }
                </style>
              </head>
              <body>
                <div class="ticket">
                  <div class="header">Sistema de Turnos</div>
                  <div class="number">Ticket: ${data.ticket_id}</div>
                  <div class="info">Fecha: ${new Date().toLocaleDateString()}</div>
                  <div class="info">Hora: ${new Date().toLocaleTimeString()}</div>
                  <div class="footer">Por favor, espere a ser llamado</div>
                </div>
                <script>
                  window.onload = () => {
                    window.print();
                    setTimeout(() => window.close(), 500);
                  };
                </script>
              </body>
            </html>
          `);
        } catch (printError) {
          console.error('Error al imprimir:', printError);
          toast({
          variant: "destructive",
            description: "Ticket generado pero hubo un error al imprimir",
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Error al generar el ticket",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {serviceTypes.map((service) => (
        <Card key={service.id} className="card-shadow hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <CardTitle className="text-xl font-semibold">{service.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Button 
              onClick={() => generateTicket(service.id)}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              {isGenerating ? 'Generando...' : 'Generar Ticket'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
