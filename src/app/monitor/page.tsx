'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Ticket {
  id: string
  numero: string
  tipo_servicio: string
  estado: string
  ventanilla?: number
}

export default function MonitorPage() {
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null)
  const [waitingTickets, setWaitingTickets] = useState<Ticket[]>([])
  const [lastTicketId, setLastTicketId] = useState<string | null>(null)

  const playNotification = useCallback((ticketNumber: string, ventanilla: number) => {
    const speak = (text: string) => {
      return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.onend = resolve;
        window.speechSynthesis.speak(utterance);
      });
    };

    const playBeep = () => {
      return new Promise((resolve) => {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);

        setTimeout(() => {
          audioContext.close();
          resolve(null);
        }, 500);
      });
    };

    (async () => {
      await playBeep();
      await speak(`Ticket número ${ticketNumber}, por favor acercarse a ventanilla ${ventanilla}`);
    })();
  }, []);

  const fetchTickets = useCallback(async () => {
    try {
      const response = await fetch('/api/tickets')
      const data = await response.json()
      
      const current = data.find((t: Ticket) => t.estado === 'en_atencion')
      const waiting = data.filter((t: Ticket) => t.estado === 'espera')

      if (current?.id !== lastTicketId) {
        if (lastTicketId !== null && current) {
          playNotification(current.numero, current.ventanilla || 0);
        }
        setLastTicketId(current?.id || null);
      }

      setCurrentTicket(current || null)
      setWaitingTickets(waiting)
    } catch (error) {
      console.error('Error obteniendo tickets:', error)
    }
  }, [lastTicketId, playNotification])

  useEffect(() => {
    fetchTickets()
    const interval = setInterval(fetchTickets, 5000)
    return () => clearInterval(interval)
  }, [fetchTickets])

  const getTipoServicioNombre = (tipo: string) => {
    const tipos = {
      'A': 'Atención General',
      'B': 'Servicios Empresariales',
      'C': 'Clientes Preferenciales',
      'P': 'Atención Prioritaria'
    }
    return tipos[tipo as keyof typeof tipos] || tipo
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Monitor de Tickets</h1>
      
      <div className="grid gap-6">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-center">Ticket en Atención</CardTitle>
          </CardHeader>
          <CardContent>
            {currentTicket ? (
              <div className="text-center">
                <div className="text-6xl font-bold mb-4">
                  {currentTicket.numero}
                </div>
                <div className="text-2xl mb-2">
                  {getTipoServicioNombre(currentTicket.tipo_servicio)}
                </div>
                <div className="text-3xl">
                  Ventanilla {currentTicket.ventanilla}
                </div>
              </div>
            ) : (
              <div className="text-center text-xl py-8">
                No hay tickets en atención
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Tickets en Espera</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {waitingTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 border rounded-lg text-center bg-muted cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => playNotification(ticket.numero, 0)}
                >
                  <div className="text-lg font-bold mb-1">{ticket.numero}</div>
                  <div className="text-sm text-muted-foreground">
                    {getTipoServicioNombre(ticket.tipo_servicio)}
                  </div>
                </div>
              ))}
              {waitingTickets.length === 0 && (
                <div className="text-center col-span-full text-muted-foreground py-4">
                  No hay tickets en espera
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

