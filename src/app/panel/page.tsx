'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


const tiposServicio: { [key: string]: string } = {
  'A': 'Atención General',
  'B': 'Servicios Empresariales',
  'C': 'Clientes Preferenciales',
  'P': 'Atención Prioritaria'
};

interface Ticket {
  id: string;
  numero: string;
  tipo_servicio: string;
  estado: string;
  ventanilla: number | null;
}

export default function PanelVisualizacion() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('/api/obtener_tickets.php');
        if (!response.ok) {
          throw new Error('Error al obtener los tickets');
        }
        const data = await response.json();
        if (data.success) {
          setTickets(data.tickets);
          setError('');
        } else {
          setError(data.error || 'Error desconocido');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Error al conectar con el servidor');
      }
    };

    fetchTickets();
    const interval = setInterval(fetchTickets, 3000); // Actualizar cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  const ticketsLlamados = tickets.filter(ticket => ticket.estado === 'en_atencion');
  const ticketsEnEspera = tickets.filter(ticket => ticket.estado === 'espera');

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Panel de Visualización de Turnos</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader className="bg-blue-500 text-white">
              <CardTitle className="text-xl text-center">Tickets en Atención</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Número</TableHead>
                    <TableHead className="text-center">Servicio</TableHead>
                    <TableHead className="text-center">Ventanilla</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ticketsLlamados.length > 0 ? (
                    ticketsLlamados.map(ticket => (
                      <TableRow key={ticket.id} className="hover:bg-gray-100">
                        <TableCell className="text-center font-bold">{ticket.numero}</TableCell>
                        <TableCell className="text-center">{tiposServicio[ticket.tipo_servicio]}</TableCell>
                        <TableCell className="text-center">{ticket.ventanilla}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-gray-500">
                        No hay tickets en atención
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="bg-green-500 text-white">
              <CardTitle className="text-xl text-center">Tickets en Espera</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Número</TableHead>
                    <TableHead className="text-center">Servicio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ticketsEnEspera.length > 0 ? (
                    ticketsEnEspera.map(ticket => (
                      <TableRow key={ticket.id} className="hover:bg-gray-100">
                        <TableCell className="text-center font-bold">{ticket.numero}</TableCell>
                        <TableCell className="text-center">{tiposServicio[ticket.tipo_servicio]}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-gray-500">
                        No hay tickets en espera
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

