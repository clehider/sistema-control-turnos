'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface Ticket {
  id: string;
  numero: string;
  tipo_servicio: string;
  estado: string;
  ventanilla?: number;
}

export default function AdminPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [ventanilla, setVentanilla] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets')
      const data = await response.json()
      setTickets(data)
    } catch (error) {
      console.error('Error fetching tickets:', error)
      toast({
        variant: "destructive",
        description: "Error al cargar los tickets",
      })
    }
  }

  useEffect(() => {
    fetchTickets()
    const interval = setInterval(fetchTickets, 5000)
    return () => clearInterval(interval)
  }, [])

  const llamarTicket = async (tipoServicio: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/llamar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tipo_servicio: tipoServicio, ventanilla }),
      })

      const data = await response.json()
      if (data.success) {
        toast({
          description: `Llamando ticket: ${data.ticket.numero} - Ventanilla ${ventanilla}`,
        })
        fetchTickets()
      } else {
        toast({
          variant: "destructive",
          description: data.message || "No hay tickets en espera",
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        variant: "destructive",
        description: "Error al llamar el ticket",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const finalizarAtencion = async (ticketId: string) => {
    try {
      const response = await fetch('/api/finalizar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticket_id: ticketId }),
      })

      const data = await response.json()
      if (data.success) {
        toast({
          description: "Atención finalizada",
        })
        fetchTickets()
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        variant: "destructive",
        description: "Error al finalizar la atención",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-primary">Panel de Administración</h1>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Número de Ventanilla
            <input
              type="number"
              value={ventanilla}
              onChange={(e) => setVentanilla(Number(e.target.value))}
              className="ml-2 p-2 bg-secondary text-secondary-foreground border rounded"
              min="1"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Llamar Siguiente Ticket</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Button onClick={() => llamarTicket('A')} disabled={isLoading}>
                Atención General
              </Button>
              <Button onClick={() => llamarTicket('B')} disabled={isLoading}>
                Servicios Empresariales
              </Button>
              <Button onClick={() => llamarTicket('C')} disabled={isLoading}>
                Clientes Preferenciales
              </Button>
              <Button onClick={() => llamarTicket('P')} disabled={isLoading}>
                Atención Prioritaria
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tickets en Atención</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tickets
                  .filter(ticket => ticket.estado === 'en_atencion')
                  .map(ticket => (
                    <div key={ticket.id} className="flex justify-between items-center p-2 border rounded bg-secondary/50 text-secondary-foreground">
                      <span>
                        Ticket {ticket.numero} - Ventanilla {ticket.ventanilla}
                      </span>
                      <Button onClick={() => finalizarAtencion(ticket.id)}>
                        Finalizar
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tickets en Espera</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {tickets
                .filter(ticket => ticket.estado === 'espera')
                .map(ticket => (
                  <div key={ticket.id} className="p-2 border rounded bg-secondary/50 text-secondary-foreground">
                    Ticket {ticket.numero} - {ticket.tipo_servicio}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
