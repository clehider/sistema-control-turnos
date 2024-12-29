'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Ticket {
  id: string;
  numero: string;
  tipo_servicio: string;
  estado: string;
  ventanilla?: number;
}

export function TicketDisplay() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('/api/tickets');
        if (!response.ok) {
          throw new Error('Error fetching tickets');
        }
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
    const interval = setInterval(fetchTickets, 5000); // Actualizar cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Tickets en Atención</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Ventanilla</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets
                .filter(ticket => ticket.estado === 'en_atencion')
                .map(ticket => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.numero}</TableCell>
                    <TableCell>{ticket.tipo_servicio}</TableCell>
                    <TableCell>{ticket.ventanilla}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tickets en Espera</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Servicio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets
                .filter(ticket => ticket.estado === 'espera')
                .map(ticket => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.numero}</TableCell>
                    <TableCell>{ticket.tipo_servicio}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
